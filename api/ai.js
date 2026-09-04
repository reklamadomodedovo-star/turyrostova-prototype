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
  const history = Array.isArray(payload?.history) ? payload.history.slice(-6) : [];
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const system = [
    'Ты Алиса — ведущий эксперт и персональный турагент агентства «Ростов-Елена-Тур».',
    'Твоя цель — предоставить туристу профессиональную, детализированную и визуально структурированную подборку туров.',
    'Обязательно учитывай все детали запроса: страну, курорт, город вылета, даты/месяц, длительность (ночи), количество взрослых и детей, бюджет и пожелания по отдыху.',
    'Сформируй 2-3 лучших варианта тура. Для КАЖДОГО варианта обязательно укажи:',
    '1. Название отеля и звёздность (например, «Sunrise Beach Resort 4★»)',
    '2. Курорт и страна (например, «Индия, Южный Гоа, Кавелоссим»)',
    '3. Даты и длительность (например, «12 ночей, 5–17 ноября»)',
    '4. Рейсы и перелёт (например, «Прямой рейс Москва (SVO) ⇄ Гоа (GOI), а/к Azur Air, багаж 20 кг + 5 кг ручная кладь»)',
    '5. Номер и пляж (например, «Deluxe Garden View, 1-я пляжная линия (80 м)»)',
    '6. Питание (например, «Всё включено» или «Завтраки»)',
    '7. Главные преимущества (например, «3 экскурсии в подарок, бесплатный трансфер, спа-комплекс»)',
    '8. Итоговую стоимость за ВСЕХ туристов в рублях (например, «240 000 ₽ за двоих (120 000 ₽/чел.)»).',
    'Форматируй ответ четко, с абзацами и пунктами. В конце добавь вежливую фразу о том, что цены и наличие мест демонстрационные, и менеджер готов зафиксировать бронь или скорректировать детали под запрос.',
    'Если данных совсем мало (например просто «Привет»), тепло поздоровайся и задай 2-3 конкретных вопроса для точного подбора.'
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
        temperature: 0.4,
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
