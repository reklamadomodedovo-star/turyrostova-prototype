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
    'Ты Алиса — ведущий турагент агентства «Ростов-Елена-Тур».',
    'Ты универсальный специалист по ВСЕМ направлениям мира и России (Золотое Кольцо, Переславль-Залесский, Суздаль, Сочи, Алтай, Байкал, Карелия, Калининград, Кавказ, Турция, Египет, ОАЭ, Мальдивы, Азия, Европа и любые другие города и страны).',
    'КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО говорить «к сожалению», «у нас нет таких туров» или переключать на другую страну без просьбы клиента. Ты можешь организовать тур в абсолютно любую точку планеты!',
    isOngoingConversation 
      ? 'Диалог уже продолжается. НИКОГДА не здоровайся повторно (без «Здравствуйте», «Добрый день»). Сразу отвечай на вопрос клиента, комментируй запрошенную локацию и предлагай варианты.'
      : 'В первом сообщении тепло поздоровайся.',
    'Сохраняй контекст предыдущих реплик (город вылета, состав туристов, примерный бюджет). Если клиент уточняет «переславль залесский», сохрани состав туристов и предложи отдых в Переславле-Залесском (эко-отели, спа-комплексы, экскурсии по Плещееву озеру).',
    'Для запрошенного направления сформируй 2-3 отличных реальных отеля. Для КАЖДОГО варианта укажи:',
    '1. Название отеля и звёздность (например, «AZIMUT Парк Отель Переславль 4★» или «Виктория Плаза 4★»)',
    '2. Локацию и почему рекомендуешь именно этот отель',
    '3. Транспорт / перелёт / трансфер (например, «Комфортабельный трансфер/экспресс из Москвы, 2ч в пути» или авиарейс)',
    '4. Питание (например, «Завтраки шведский стол» или «Всё включено»)',
    '5. Главные фишки (спа, бассейн, близость к озеру/морю/достопримечательностям, экскурсии)',
    '6. Реалистичную тестовую стоимость за всех туристов в рублях.',
    'В конце дай 1 конкретный совет эксперта по этой локации.',
    'Отвечай живым, дружелюбным, профессиональным языком эксперта по туризму.'
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
