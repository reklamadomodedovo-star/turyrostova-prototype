const ALLOWED_ORIGINS = new Set([
  'https://reklamadomodedovo-star.github.io',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
]);

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.has(origin) || origin.endsWith('.e2b.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: 'AI is not configured' });

  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = {};
    }
  }

  const message = String(payload?.message || '').trim().slice(0, 2000);
  const history = Array.isArray(payload?.history) ? payload.history.slice(-8) : [];
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const isOngoingConversation = history.length > 0;

  const system = [
    'Ты Алиса — персональный турагент и эксперт агентства «Ростов-Елена-Тур».',
    'Веди диалог живо, тепло, профессионально и по делу, как опытный менеджер по туризму, который искренне заботится об идеальном отпуске клиента.',
    isOngoingConversation 
      ? 'ВАЖНО: Диалог уже идет! НИКОГДА не здоровайся повторно (никаких «Здравствуйте», «Добрый день» и формальных вступлений). Сразу отвечай на вопрос клиента, комментируй новую локацию/пожелание и давай рекомендации.'
      : 'В первом сообщении тепло поздоровайся и представься как турагент Алиса.',
    'Сохраняй контекст предыдущих сообщений (город вылета, количество туристов, месяц, примерный бюджет). Если клиент спрашивает «а если в сочи?», сохраняй параметры вылета и состав путешественников из предыдущих реплик.',
    'Давай ценные советы по локациям и сезону: объясняй, чем хороша Красная Поляна или побережье, какой пляж лучше на Гоа, где лучший риф в Египте или спокойная бухта в ОАЭ.',
    'Предложи 2-3 конкретных проверенных отеля. Для КАЖДОГО варианта обязательно укажи:',
    '1. Отель и звёздность (например, «Marriott Krasnaya Polyana 5★»)',
    '2. Курорт/локацию и почему рекомендуешь именно его',
    '3. Длительность и даты вылета',
    '4. Питание (например, «Завтраки шведский стол» или «Всё включено»)',
    '5. Фишку/преимущество отеля (инфинити-бассейн с подогревом, спа, первая линия, экскурсии)',
    '6. Итоговую тестовую цену за всех туристов в рублях.',
    'В конце добавь 1-2 предложения с советом от себя или вопросом (например, «Хотите вариант ближе к морю или именно с горными пейзажами?»).',
    'Отвечай только на русском языке, живым человеческим языком.'
  ].join('\n');

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: system },
          ...history
            .filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
            .map(item => ({ role: item.role, content: item.content.slice(0, 1200) })),
          { role: 'user', content: message }
        ],
        reasoning_effort: 'low',
        temperature: 0.45,
        max_completion_tokens: 1200
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('Groq error', upstream.status, data?.error?.message || 'unknown');
      return res.status(502).json({ error: 'Groq request failed' });
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) return res.status(502).json({ error: 'Empty Groq response' });

    return res.status(200).json({
      answer,
      provider: 'groq',
      model: 'openai/gpt-oss-20b'
    });
  } catch (error) {
    console.error('AI function error', error?.message || error);
    return res.status(500).json({ error: 'AI request failed' });
  }
}
