// Ростов-Елена-Тур — Главный клиентский скрипт (v3 Professional Tour Proposals)
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

// Global Tour Registry for interactive modals & shareable links
window.toursRegistry = {};

// Default departure date (+14 days)
const today = new Date();
today.setDate(today.getDate() + 14);
const dateInput = $('#tourDate');
if (dateInput) dateInput.value = today.toISOString().slice(0, 10);

// Intersection Observer for scroll animations
if (typeof IntersectionObserver !== 'undefined') {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => observer.observe(el));
}

// Mobile Navigation
const menu = $('#nav');
const menuToggle = $('#menuToggle');
if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

// Toast Notifications
function showToast(title, sub = 'Тур сохранён для сравнения') {
  const toast = $('#toast');
  if (!toast) return;
  $('b', toast).textContent = title;
  $('span', toast).textContent = sub;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

// Phone Mask Formatting (+7 (XXX) XXX-XX-XX)
function applyPhoneMask(input) {
  if (!input) return;
  input.addEventListener('input', () => {
    let val = input.value.replace(/\D/g, '');
    if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
    val = val.slice(0, 10);
    let formatted = '+7 ';
    if (val.length > 0) formatted += '(' + val.slice(0, 3);
    if (val.length >= 3) formatted += ') ' + val.slice(3, 6);
    if (val.length >= 6) formatted += '-' + val.slice(6, 8);
    if (val.length >= 8) formatted += '-' + val.slice(8, 10);
    input.value = val.length === 0 ? '' : formatted;
  });
}
$$('input[type="tel"]').forEach(applyPhoneMask);

// AI Drawer Controls
const drawer = $('#aiDrawer');
const backdrop = $('#drawerBackdrop');

function openAi(prefill = '') {
  if (!drawer) return;
  drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  const chatInput = $('#chatText');
  if (prefill && chatInput) {
    chatInput.value = prefill;
    setTimeout(() => {
      const form = $('#chatForm');
      if (form) form.requestSubmit();
    }, 280);
  } else if (chatInput) {
    setTimeout(() => chatInput.focus(), 350);
  }
}

function closeAi() {
  if (!drawer) return;
  drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

['#aiFab', '#openAiTop', '#startAi'].forEach(id => $(id)?.addEventListener('click', () => openAi()));
$('#closeAi')?.addEventListener('click', closeAi);
backdrop?.addEventListener('click', closeAi);
$$('.prompt-chip').forEach(b => b.addEventListener('click', () => openAi(b.textContent.replace(/[«»]/g, ''))));

function now() {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// Photo Banks for High-Resolution Galleries
const PHOTO_BANKS = {
  goa: [
    { url: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Пляж и пальмы' },
    { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бассейн отеля' },
    { url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Номер Deluxe' },
    { url: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Ресторан у пляжа' }
  ],
  turkey: [
    { url: 'https://images.pexels.com/photos/19732855/pexels-photo-19732855.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Побережье Средиземного моря' },
    { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бассейн и горки' },
    { url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Номер' },
    { url: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Ресторан' }
  ],
  egypt: [
    { url: 'https://images.pexels.com/photos/12913416/pexels-photo-12913416.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Красное море' },
    { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Аквапарк' },
    { url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Номер Superior' },
    { url: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бассейн' }
  ],
  uae: [
    { url: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Побережье ОАЭ' },
    { url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Остров Марджан' },
    { url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Номер Deluxe' },
    { url: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бассейн' }
  ],
  maldives: [
    { url: 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Водные виллы' },
    { url: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бирюзовая лагуна' },
    { url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Вилла с видом на океан' },
    { url: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Ресторан над водой' }
  ],
  thailand: [
    { url: 'https://images.pexels.com/photos/164041/pexels-photo-164041.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Пляж Карон' },
    { url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бассейн в саду' },
    { url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Номер Deluxe' },
    { url: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Тайский ресторан' }
  ],
  russia: [
    { url: 'https://images.pexels.com/photos/29038705/pexels-photo-29038705.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Кавказские горы' },
    { url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Бассейн с панорамой' },
    { url: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Интерьер отеля' },
    { url: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1200', label: 'Спа-комплекс' }
  ]
};

// Curated Destination Database
const DESTINATIONS_DB = {
  goa: {
    keys: /гоа|инди|goa|india|кавелоссим|калангут|бага|палолем|морджим/,
    country: 'Индия',
    resort: 'Гоа',
    airportCode: 'GOI',
    airportName: 'Даболим (GOI)',
    flightHours: '7 ч 15 мин',
    airline: 'Azur Air (ZF-7711)',
    airlineReturn: 'Azur Air (ZF-7712)',
    basePrice: 118000,
    foodDefault: 'Всё включено (All Inclusive)',
    photos: PHOTO_BANKS.goa,
    hotels: [
      {
        name: 'Sunrise Beach Resort',
        stars: 4,
        rating: '4.8',
        reviewsCount: 386,
        resort: 'Южный Гоа, Кавелоссим',
        beach: '1-я линия (80 м, широкий песчаный пляж)',
        food: 'Всё включено (All Inclusive)',
        room: 'Deluxe Garden View (38 м²)',
        features: [
          '3 авторские экскурсии в подарок (водопад Дудхсагар, Старый Гоа, сад специй)',
          'Бесплатный трансфер на кондиционированном минивэне',
          'Собственный оборудованный пляж с шезлонгами',
          'SPA-центр с аюрведическими программами'
        ],
        photos: PHOTO_BANKS.goa,
        desc: 'Элегантный курортный комплекс на первой линии южного побережья Гоа. Окружен тропическим садом, предлагает приватный песчаный пляж с пологим входом в воду и изысканную кухню.'
      },
      {
        name: 'Caravela Beach Resort',
        stars: 5,
        rating: '4.9',
        reviewsCount: 520,
        resort: 'Южный Гоа, Варка',
        beach: '1-я линия (50 м, белоснежный песок)',
        food: 'Ультра всё включено',
        room: 'Superior Ocean Front (44 м²)',
        features: [
          'Гольф-поле на 9 лунок и теннисные корты',
          'Большой лагунный бассейн с баром в воде',
          'Ужин под звёздами на берегу океана',
          'Индивидуальный VIP-трансфер из аэропорта'
        ],
        photos: PHOTO_BANKS.goa,
        desc: 'Премиальный пятизвездочный отель на уединенном пляже Варка. Идеален для романтического отдыха и полной перезагрузки под шум океанского прибоя.'
      },
      {
        name: 'Royal Orchid Beach Resort & Spa',
        stars: 5,
        rating: '4.8',
        reviewsCount: 442,
        resort: 'Южный Гоа, Уторда',
        beach: '1-я линия (прямой выход на пляж)',
        food: 'Всё включено (All Inclusive)',
        room: 'Club Room Pool View (40 м²)',
        features: [
          '4 авторские экскурсии по Гоа в подарок',
          'Бесплатный день в SPA и сеанс массажа',
          '3 ресторана: морепродукты, индийская и европейская кухня',
          'Русскоязычный консьерж 24/7'
        ],
        photos: PHOTO_BANKS.goa,
        desc: 'Пятизвездочный отель с просторной зеленой территорией и прямым выходом к песчаному пляжу Уторда. Высочайший уровень сервиса и превосходная гастрономия.'
      }
    ]
  },
  turkey: {
    keys: /турц|антал|алани|сиде|кемер|белек|бодрум|стамбул/,
    country: 'Турция',
    resort: 'Анталья / Сиде / Кемер',
    airportCode: 'AYT',
    airportName: 'Анталья (AYT)',
    flightHours: '4 ч 20 мин',
    airline: 'Turkish Airlines (TK-3912)',
    airlineReturn: 'Turkish Airlines (TK-3913)',
    basePrice: 84000,
    foodDefault: 'Ультра всё включено',
    photos: PHOTO_BANKS.turkey,
    hotels: [
      {
        name: 'Crystal Sunset Luxury Resort & Spa',
        stars: 5,
        rating: '4.8',
        reviewsCount: 386,
        resort: 'Турция · Сиде',
        beach: '1-я линия (150 м, песчаный пляж)',
        food: 'Ультра всё включено 24/7',
        room: 'Standard Side Sea View (32 м²)',
        features: [
          'Большой аквапарк с 11 водными горками',
          '7 ресторанов a la carte и 9 баров',
          'Собственный песчаный пляж с пирсом',
          'Детский клуб Crispy с анимацией'
        ],
        photos: PHOTO_BANKS.turkey,
        desc: 'Роскошный курортный комплекс в Сиде с огромной инфраструктурой, аквапарком, спа-центром и круглосуточной системой «Ультра всё включено».'
      },
      {
        name: 'Akka Antedon Hotel',
        stars: 5,
        rating: '4.9',
        reviewsCount: 610,
        resort: 'Турция · Кемер, Бельдиби',
        beach: '1-я линия (50 м, сосновый парк и горы)',
        food: 'Премиум всё включено',
        room: 'Family Duplex Suite (52 м²)',
        features: [
          'Живописное сочетание сосен, моря и Таврских гор',
          'Высочайший рейтинг семейного сервиса',
          'Спа-центр с турецким хаммамом и сауной',
          'Трансфер из аэропорта на комфортном автобусе'
        ],
        photos: PHOTO_BANKS.turkey,
        desc: 'Премиальный семейный отель в окружении реликтовых сосен у подножия гор. Чистейшее лазурное море и безупречная гастрономия.'
      }
    ]
  },
  egypt: {
    keys: /егип|шарм|хургад|макади|красн.*мор/,
    country: 'Египет',
    resort: 'Шарм-эль-Шейх / Макади-Бей',
    airportCode: 'SSH',
    airportName: 'Шарм-эль-Шейх (SSH)',
    flightHours: '5 ч 10 мин',
    airline: 'Air Cairo (SM-902)',
    airlineReturn: 'Air Cairo (SM-903)',
    basePrice: 78000,
    foodDefault: 'Всё включено (All Inclusive)',
    photos: PHOTO_BANKS.egypt,
    hotels: [
      {
        name: 'Serenity Alma Heights',
        stars: 5,
        rating: '4.7',
        reviewsCount: 214,
        resort: 'Египет · Макади-Бей',
        beach: '1-я линия (живой коралловый риф)',
        food: 'Всё включено (All Inclusive)',
        room: 'Superior Family Room (42 м²)',
        features: [
          'Огромный аквапарк и парк аттракционов',
          'Живой коралловый риф для снорклинга',
          'Детский луна-парк и анимационные шоу',
          'Медицинская страховка и трансфер включены'
        ],
        photos: PHOTO_BANKS.egypt,
        desc: 'Идеальный отель для семейного отдыха в заливе Макади-Бей с собственным коралловым рифом, масштабным аквапарком и теплым морем круглый год.'
      }
    ]
  },
  uae: {
    keys: /оаэ|эмират|дуба|рас-эль-хайм|абу-даби|шардж/,
    country: 'ОАЭ',
    resort: 'Дубай / Рас-эль-Хайма',
    airportCode: 'DXB',
    airportName: 'Дубай (DXB)',
    flightHours: '5 ч 30 мин',
    airline: 'Flydubai (FZ-968)',
    airlineReturn: 'Flydubai (FZ-969)',
    basePrice: 96000,
    foodDefault: 'Ультра всё включено',
    photos: PHOTO_BANKS.uae,
    hotels: [
      {
        name: 'Rixos Bab Al Bahr',
        stars: 5,
        rating: '4.8',
        reviewsCount: 529,
        resort: 'ОАЭ · Рас-эль-Хайма, Марджан',
        beach: '1-я линия (собственный пляж острова Марджан)',
        food: 'Ультра всё включено',
        room: 'Deluxe Room Island View (35 м²)',
        features: [
          'Редкая для ОАЭ система «Ультра всё включено»',
          '8 бассейнов и отдельный инфинити-бассейн',
          '14 ресторанов и баров мирового уровня',
          'Пляжные вечеринки и живые концерты'
        ],
        photos: PHOTO_BANKS.uae,
        desc: 'Курорт в форме пирамид на искусственном острове Аль-Марджан. Неограниченное питание и напитки, песчаный пляж и премиальный комфорт.'
      }
    ]
  },
  maldives: {
    keys: /мальдив|мале|атолл/,
    country: 'Мальдивы',
    resort: 'Южный Мале / Северный Мале',
    airportCode: 'MLE',
    airportName: 'Мале Велана (MLE)',
    flightHours: '8 ч 40 мин',
    airline: 'Аэрофлот (SU-320)',
    airlineReturn: 'Аэрофлот (SU-321)',
    basePrice: 180000,
    foodDefault: 'Премиум всё включено',
    photos: PHOTO_BANKS.maldives,
    hotels: [
      {
        name: 'Sun Siyam Olhuveli',
        stars: 5,
        rating: '4.9',
        reviewsCount: 812,
        resort: 'Мальдивы · Южный Мале',
        beach: '1-я линия (бирюзовая лагуна)',
        food: 'Премиум всё включено',
        room: 'Water Villa with Private Pool (64 м²)',
        features: [
          'Вилла прямо над водой с собственным спуском в лагуну',
          'Скоростной трансфер на катере аэропорт ⇄ отель',
          'Дайвинг-центр PADI и снорклинг со скатами мантами',
          'Романтический ужин на закате на пляже'
        ],
        photos: PHOTO_BANKS.maldives,
        desc: 'Курорт на трёх соединенных островах посреди кристальной бирюзовой лагуны. Живописный домашний риф, виллы над океаном и спа мирового уровня.'
      }
    ]
  },
  thailand: {
    keys: /таил|пхукет|паттай|самуи|краби|као-лак/,
    country: 'Таиланд',
    resort: 'Пхукет / Паттайя',
    airportCode: 'HKT',
    airportName: 'Пхукет (HKT)',
    flightHours: '9 ч 10 мин',
    airline: 'Аэрофлот (SU-274)',
    airlineReturn: 'Аэрофлот (SU-275)',
    basePrice: 130000,
    foodDefault: 'Завтраки (Шведский стол)',
    photos: PHOTO_BANKS.thailand,
    hotels: [
      {
        name: 'Pullman Phuket Karon Beach Resort',
        stars: 5,
        rating: '4.8',
        reviewsCount: 418,
        resort: 'Таиланд · Пхукет, Карон',
        beach: '1-я линия (через дорогу от пляжа Карон с «поющим» песком)',
        food: 'Завтраки (Шведский стол)',
        room: 'Deluxe Sea View (45 м²)',
        features: [
          'Огромный тропический сад площадью 75 гектаров',
          '5 открытых бассейнов со слайдами',
          '3 ресторана тайской и европейской кухни',
          'Экскурсия на острова Пхи-Пхи в подарок'
        ],
        photos: PHOTO_BANKS.thailand,
        desc: 'Флагманский отель на лучшем пляже Пхукета с поющим скрипящим песком. Тропический парк, первоклассный сервис и близость к ресторанам.'
      }
    ]
  },
  russia: {
    keys: /росси|сочи|красн.*полян|дагест|алтай|карели/,
    country: 'Россия',
    resort: 'Сочи / Красная Поляна',
    airportCode: 'AER',
    airportName: 'Сочи (AER)',
    flightHours: '3 ч 50 мин',
    airline: 'Аэрофлот / S7 (SU-1124)',
    airlineReturn: 'Аэрофлот (SU-1125)',
    basePrice: 52000,
    foodDefault: 'Завтраки (Шведский стол)',
    photos: PHOTO_BANKS.russia,
    hotels: [
      {
        name: 'Marriott Sochi Krasnaya Polyana',
        stars: 5,
        rating: '4.9',
        reviewsCount: 691,
        resort: 'Россия · Красная Поляна',
        beach: 'Горный курорт + трансфер на собственный пляж в Имеретинке',
        food: 'Завтраки (Шведский стол)',
        room: 'Deluxe Mountain View (40 м²)',
        features: [
          'Открытый подогреваемый бассейн с видом на Кавказские горы',
          'Роскошный Soul SPA и термальный комплекс',
          'Канатная дорога в 100 метрах от отеля',
          'Бесплатный шаттл на морской пляж'
        ],
        photos: PHOTO_BANKS.russia,
        desc: 'Премиальный пятизвездочный отель в сердце курорта Красная Поляна. Открытый круглогодичный подогреваемый бассейн, захватывающий вид на горные вершины.'
      }
    ]
  }
};

// Robust Parser to convert Groq text into rich TourProposal objects
function parseAndEnrichGroqText(rawText, userQuery) {
  const lowerQuery = (userQuery + ' ' + rawText).toLowerCase();

  // Find matching destination or default to Goa/Turkey
  let destKey = Object.keys(DESTINATIONS_DB).find(k => DESTINATIONS_DB[k].keys.test(lowerQuery));
  if (!destKey) {
    if (/пляж|мор|океан|ноябр|октябр|декабр|зимой|в тепле/.test(lowerQuery)) destKey = 'goa';
    else if (/роскош|премиум|лакшери|остров/.test(lowerQuery)) destKey = 'maldives';
    else if (/недорог|эконом|скидк|выгод/.test(lowerQuery)) destKey = 'turkey';
    else destKey = 'goa';
  }
  const dest = DESTINATIONS_DB[destKey];

  // Detect departure city
  let depCity = 'Москвы';
  let depCode = 'SVO';
  if (/из ростов|вылет.*ростов|ростова/.test(lowerQuery)) { depCity = 'Ростова-на-Дону'; depCode = 'ROV'; }
  else if (/из соч|вылет.*сочи/.test(lowerQuery)) { depCity = 'Сочи'; depCode = 'AER'; }
  else if (/мин.*вод|минвод/.test(lowerQuery)) { depCity = 'Минеральных Вод'; depCode = 'MRV'; }
  else if (/питер|санкт-петербург/.test(lowerQuery)) { depCity = 'Санкт-Петербурга'; depCode = 'LED'; }

  // Detect travelers count
  let adults = 2;
  const adultsMatch = lowerQuery.match(/(\d+)\s*(?:взрос|чел|турист)/);
  if (adultsMatch) adults = parseInt(adultsMatch[1]);
  else if (/один|1\s*чел|на одного/.test(lowerQuery)) adults = 1;
  else if (/на троих|3\s*чел/.test(lowerQuery)) adults = 3;

  let children = 0;
  const childMatch = lowerQuery.match(/(\d+)\s*(?:реб|дет)/);
  if (childMatch) children = parseInt(childMatch[1]);
  else if (/с ребён|с ребен|с дет/.test(lowerQuery)) children = 1;

  // Split text into option blocks (by "1.", "2.", "3." or paragraphs)
  const rawBlocks = rawText.split(/(?:^|\s+)(?:\d+[\.\)]\s+)/).filter(b => b.trim().length > 10);
  const proposals = [];

  if (rawBlocks.length >= 2) {
    // Parse each block returned by Groq
    rawBlocks.forEach((block, idx) => {
      const hotelMatch = block.match(/(?:отель|комплекс)?\s*[«"“]([^»"”]+)[»"”]/i) ||
                         block.match(/(?:отель|гостиница)\s+([A-Za-zА-Яа-я0-9\s-]+?)(?:,|\.|\s+\d★|\s+\d\s*зв)/i);
      const hotelName = hotelMatch ? hotelMatch[1].trim() : (dest.hotels[idx % dest.hotels.length]?.name || `Курортный отель #${idx+1}`);

      const starsMatch = block.match(/(\d)\s*(?:★|звезд|\*)/i);
      const stars = starsMatch ? parseInt(starsMatch[1]) : (dest.hotels[idx % dest.hotels.length]?.stars || 4);

      const nightsMatch = block.match(/(\d+)\s*(?:ноч|дн|ночей)/i);
      const nights = nightsMatch ? parseInt(nightsMatch[1]) : (10 + idx * 2);

      const priceMatch = block.match(/(?:цена|стоимость|от|–|-)?\s*(\d[\d\s]{3,})\s*(?:руб|₽)/i);
      let price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : (225000 + idx * 12000);
      price = Math.round(price / 500) * 500;

      let food = dest.foodDefault;
      if (/полупансион|завтрак\s*\+\s*ужин/i.test(block)) food = 'Полупансион (Завтрак + Ужин)';
      else if (/полный пансион/i.test(block)) food = 'Полный пансион (FB)';
      else if (/всё включено|all inclusive/i.test(block)) food = 'Всё включено (All Inclusive)';
      else if (/ультра всё включено/i.test(block)) food = 'Ультра всё включено';
      else if (/завтрак/i.test(block)) food = 'Завтраки (Шведский стол)';

      const dateMatch = block.match(/вылет[а-я\s]*(\d+\s+[а-яё]+)/i);
      const depDate = dateMatch ? dateMatch[1] : `0${5 + idx * 2} ноября`;

      const perkMatch = block.match(/(?:преимущество|фишка|плюс|бонус)\s*[:–-]\s*([^.]+)/i);
      const perk = perkMatch ? perkMatch[1].trim() : (dest.hotels[idx % dest.hotels.length]?.features[0] || 'Бесплатный трансфер и экскурсионный пакет');

      const oldPrice = Math.round((price * 1.12) / 500) * 500;
      const perPerson = Math.round(price / (adults + children));
      const tourId = `tour-prop-${hotelName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

      const photoSet = dest.photos || PHOTO_BANKS.goa;

      const tourObj = {
        id: tourId,
        hotelName: hotelName,
        stars: stars,
        rating: (4.7 + idx * 0.1).toFixed(1),
        reviewsCount: 386 + idx * 55,
        country: dest.country,
        resort: dest.hotels[idx % dest.hotels.length]?.resort || `${dest.country}, ${dest.resort}`,
        beach: dest.hotels[idx % dest.hotels.length]?.beach || '1-я линия, песчаный пляж',
        food: food,
        room: 'Deluxe Room (38 м²)',
        departureCity: depCity,
        departureAirport: depCode,
        destinationAirport: dest.airportCode,
        destinationAirportName: dest.airportName,
        datesText: `${nights} ночей · вылет ${depDate} 2026`,
        datesShort: `${depDate} (на ${nights} ночей)`,
        nights: nights,
        airline: dest.airline,
        airlineReturn: dest.airlineReturn,
        flightHours: dest.flightHours,
        priceTotal: price.toLocaleString('ru-RU') + ' ₽',
        priceOld: oldPrice.toLocaleString('ru-RU') + ' ₽',
        pricePerPerson: perPerson.toLocaleString('ru-RU') + ' ₽ / чел.',
        discount: '-12%',
        features: [
          perk,
          'Прямой чартерный перелёт с багажом 20 кг',
          'Трансфер аэропорт — отель на минивэне',
          'Медицинская страховка туриста с покрытием $40 000'
        ],
        photos: photoSet,
        description: dest.hotels[idx % dest.hotels.length]?.desc || `Прекрасный отель ${hotelName} ${stars}★ на побережье. Идеально подходит для комфортного отдыха у моря.`,
        adults: adults,
        children: children,
        publicLink: `https://reklamadomodedovo-star.github.io/turyrostova-prototype/?tour=${tourId}`
      };

      window.toursRegistry[tourId] = tourObj;
      proposals.push(tourObj);
    });
  } else {
    // Fallback if raw text didn't contain 2+ numbered blocks
    return generateSmartTourProposal(userQuery || rawText);
  }

  return {
    destName: `${dest.country} (${dest.resort})`,
    departureCity: depCity,
    dates: proposals[0]?.datesShort || 'в ноябре',
    travelersText: `${adults} взр.${children ? ' + ' + children + ' реб.' : ''}`,
    proposals: proposals
  };
}

// Universal Smart Tour Proposal Generator
function generateSmartTourProposal(queryText) {
  const lower = queryText.toLowerCase();

  let destKey = Object.keys(DESTINATIONS_DB).find(k => DESTINATIONS_DB[k].keys.test(lower));
  if (!destKey) {
    if (/пляж|мор|океан|ноябр|октябр|декабр|зимой|в тепле/.test(lower)) destKey = 'goa';
    else if (/роскош|премиум|лакшери|остров/.test(lower)) destKey = 'maldives';
    else if (/недорог|эконом|скидк|выгод/.test(lower)) destKey = 'turkey';
    else destKey = 'goa';
  }

  const dest = DESTINATIONS_DB[destKey];

  let departureCity = 'Москвы';
  let depCode = 'SVO';
  if (/из ростов|вылет.*ростов|ростова/.test(lower)) { departureCity = 'Ростова-на-Дону'; depCode = 'ROV'; }
  else if (/из соч|вылет.*сочи/.test(lower)) { departureCity = 'Сочи'; depCode = 'AER'; }
  else if (/мин.*вод|минвод/.test(lower)) { departureCity = 'Минеральных Вод'; depCode = 'MRV'; }
  else if (/питер|санкт-петербург/.test(lower)) { departureCity = 'Санкт-Петербурга'; depCode = 'LED'; }

  let adults = 2;
  const adultsMatch = lower.match(/(\d+)\s*(?:взрос|чел|турист)/);
  if (adultsMatch) adults = parseInt(adultsMatch[1]);
  else if (/один|1\s*чел|на одного/.test(lower)) adults = 1;
  else if (/на троих|3\s*чел/.test(lower)) adults = 3;

  let children = 0;
  const childMatch = lower.match(/(\d+)\s*(?:реб|дет)/);
  if (childMatch) children = parseInt(childMatch[1]);
  else if (/с ребён|с ребен|с дет/.test(lower)) children = 1;

  let nights = 11;
  const nightsRangeMatch = lower.match(/(\d+)\s*[-–—]\s*(\d+)\s*(?:ноч|дн)/);
  if (nightsRangeMatch) {
    nights = Math.round((parseInt(nightsRangeMatch[1]) + parseInt(nightsRangeMatch[2])) / 2);
  } else {
    const singleNightsMatch = lower.match(/(\d+)\s*(?:ноч|дн)/);
    if (singleNightsMatch) nights = parseInt(singleNightsMatch[1]);
  }
  if (nights < 5) nights = 7;
  if (nights > 21) nights = 14;

  const months = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
  let foundMonth = 'ноябре';
  months.forEach(m => {
    if (lower.includes(m.slice(0, 4))) foundMonth = m;
  });

  let budget = 0;
  const budgetMatch = lower.match(/(?:до|бюджет\D{0,10})(\d[\d\s]{3,})/);
  if (budgetMatch) budget = parseInt(budgetMatch[1].replace(/\s/g, ''));

  const proposals = [];
  const hotelsPool = dest.hotels;

  hotelsPool.forEach((hotelTemplate, idx) => {
    const tourId = `tour-prop-${destKey}-${idx + 1}-${Date.now().toString().slice(-4)}`;
    const depDay = 5 + idx * 2;
    const startDateStr = `${depDay < 10 ? '0' + depDay : depDay} ${foundMonth.slice(0, 3)} 2026`;
    const endDateStr = `${depDay + nights} ${foundMonth.slice(0, 3)} 2026`;

    let calculatedPrice = dest.basePrice * (adults + children * 0.65) * (nights / 7) + (idx * 14000);
    if (budget && calculatedPrice > budget) {
      calculatedPrice = budget - (idx * 6000);
    }
    calculatedPrice = Math.round(calculatedPrice / 500) * 500;
    if (calculatedPrice < 68000) calculatedPrice = 68000 + idx * 12000;

    const oldPrice = Math.round((calculatedPrice * 1.12) / 500) * 500;
    const perPerson = Math.round(calculatedPrice / (adults + children));

    const tourObj = {
      id: tourId,
      hotelName: hotelTemplate.name,
      stars: hotelTemplate.stars,
      rating: hotelTemplate.rating,
      reviewsCount: hotelTemplate.reviewsCount,
      country: dest.country,
      resort: hotelTemplate.resort,
      beach: hotelTemplate.beach,
      food: hotelTemplate.food,
      room: hotelTemplate.room,
      departureCity: departureCity,
      departureAirport: depCode,
      destinationAirport: dest.airportCode,
      destinationAirportName: dest.airportName,
      datesText: `${nights} ночей · ${startDateStr} — ${endDateStr}`,
      datesShort: `${startDateStr} (на ${nights} ночей)`,
      nights: nights,
      airline: dest.airline,
      airlineReturn: dest.airlineReturn,
      flightHours: dest.flightHours,
      priceTotal: calculatedPrice.toLocaleString('ru-RU') + ' ₽',
      priceOld: oldPrice.toLocaleString('ru-RU') + ' ₽',
      pricePerPerson: perPerson.toLocaleString('ru-RU') + ' ₽ / чел.',
      discount: '-12%',
      features: hotelTemplate.features,
      photos: hotelTemplate.photos || dest.photos,
      description: hotelTemplate.desc,
      adults: adults,
      children: children,
      publicLink: `https://reklamadomodedovo-star.github.io/turyrostova-prototype/?tour=${tourId}`
    };

    window.toursRegistry[tourId] = tourObj;
    proposals.push(tourObj);
  });

  return {
    destName: `${dest.country} (${dest.resort})`,
    departureCity: departureCity,
    dates: `${nights} ночей в ${foundMonth}`,
    travelersText: `${adults} взр.${children ? ' + ' + children + ' реб.' : ''}`,
    proposals: proposals
  };
}

// Render Bot Message with Rich Tour Proposal Cards & Links
function renderBotProposalMessage(container, data) {
  const intro = document.createElement('div');
  intro.style.marginBottom = '12px';
  intro.style.lineHeight = '1.5';
  intro.innerHTML = `Здравствуйте! По вашему запросу я сформировала <b>профессиональную подборку туров</b> в <b>${data.destName}</b> с прямым вылетом из <b>${data.departureCity}</b> (${data.dates}, ${data.travelersText}):`;
  container.appendChild(intro);

  const cardsWrap = document.createElement('div');
  cardsWrap.className = 'tour-proposals-wrap';

  data.proposals.forEach(tour => {
    const card = document.createElement('article');
    card.className = 'tour-card-mini';
    card.innerHTML = `
      <div class="tour-card-mini-img">
        <img src="${tour.photos[0].url}" alt="${tour.hotelName}" loading="lazy">
        <div class="tour-card-mini-tags">
          <span class="mini-badge mini-badge-stars">★ ${tour.stars} ЗВЁЗД</span>
          <span class="mini-badge mini-badge-hot">${tour.discount} ВЫГОДА</span>
        </div>
      </div>
      <div class="tour-card-mini-content">
        <div class="tour-card-mini-head">
          <h4 class="tour-card-mini-title">${tour.hotelName} ${tour.stars}★</h4>
          <div class="tour-card-mini-rating"><i>★</i> <b>${tour.rating}</b></div>
        </div>
        <div class="tour-card-mini-resort">📍 ${tour.resort}</div>
        
        <div class="tour-card-mini-specs">
          <div><span>✈</span><span><b>${tour.departureAirport} ⇄ ${tour.destinationAirport}</b> · ${tour.airline.split(' ')[0]} (багаж 20 кг включён)</span></div>
          <div><span>🗓</span><span><b>${tour.datesText}</b></span></div>
          <div><span>🍽</span><span><b>${tour.food}</b></span></div>
          <div><span>🏖</span><span><b>${tour.beach.split('(')[0]}</b></span></div>
        </div>

        <div class="tour-card-mini-perk">
          🎁 ${tour.features[0]}
        </div>

        <div class="tour-card-mini-bottom">
          <div class="mini-price-box">
            <small>Итого за всех туристов</small>
            <div>
              <strong>${tour.priceTotal}</strong>
              <span class="old-price">${tour.priceOld}</span>
            </div>
            <span class="per-person">${tour.pricePerPerson}</span>
          </div>
        </div>

        <div class="tour-card-mini-actions">
          <button class="btn-mini-detail" data-open-tour="${tour.id}">
            <span>Открыть презентацию тура (фото, рейсы)</span> <i>↗</i>
          </button>
          <button class="btn-mini-book" data-book-tour="${tour.id}">
            <span>Забронировать</span>
          </button>
        </div>
        
        <div style="margin-top:8px;font-size:10px;color:var(--muted);text-align:center;">
          🔗 <a href="?tour=${tour.id}" style="color:var(--ink);text-decoration:underline;" data-open-tour="${tour.id}">Ссылка на презентацию отеля</a>
        </div>
      </div>
    `;
    cardsWrap.appendChild(card);
  });

  container.appendChild(cardsWrap);

  const foot = document.createElement('div');
  foot.style.marginTop = '12px';
  foot.style.fontSize = '11px';
  foot.style.color = 'var(--muted)';
  foot.style.lineHeight = '1.5';
  foot.innerHTML = `✓ В стоимость включены: прямые перелёты туда-обратно с багажом 20 кг, трансфер на минивэне, проживание, питание и медицинская страховка.<br><i>Нажмите на любую кнопку «Открыть презентацию тура», чтобы изучить фото отеля, расписание рейсов и концепцию питания.</i>`;
  container.appendChild(foot);

  // Bind Buttons inside this message
  $$('[data-open-tour]', container).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-open-tour');
      openTourDetailModal(id);
    });
  });

  $$('[data-book-tour]', container).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-book-tour');
      const tour = window.toursRegistry[id];
      if (tour) {
        openLead(`Бронирование: ${tour.hotelName} ${tour.stars}★ (${tour.resort}, ${tour.datesShort}, ${tour.priceTotal})`);
      }
    });
  });
}

// Append Chat Message
const aiHistory = [];

function appendMessage(text, type = 'bot') {
  const m = document.createElement('div');
  m.className = `chat-message ${type}`;
  const s = document.createElement('div');
  s.className = 'chat-bubble';
  if (typeof text === 'string') s.textContent = text;
  else if (text instanceof HTMLElement) s.appendChild(text);
  const t = document.createElement('small');
  t.textContent = now();
  m.append(s, t);
  const chatBody = $('#chatBody');
  if (chatBody) {
    chatBody.append(m);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  return m;
}

// Groq API Caller with Dynamic Parser & Enricher
async function groqAiReply(text) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('https://turyrostova-groq-api-reklamadomodedovo-7709.vercel.app/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ message: text, history: aiHistory.slice(-6) }),
      signal: controller.signal
    });

    if (!response.ok) throw new Error('Groq network error');
    const data = await response.json();
    if (!data.answer) throw new Error('Empty AI answer');

    aiHistory.push({ role: 'user', content: text }, { role: 'assistant', content: data.answer });
    
    // Parse Groq output into rich structured data
    const parsedData = parseAndEnrichGroqText(data.answer, text);
    return { type: 'groq-parsed', data: parsedData };
  } catch (error) {
    console.warn('Groq live fallback triggered:', error);
    const smartData = generateSmartTourProposal(text);
    return { type: 'smart', data: smartData };
  } finally {
    clearTimeout(timer);
  }
}

// Send Message Handler
async function sendAiMessage(text) {
  appendMessage(text, 'user');

  const pending = appendMessage('Подбираю лучшие рейсы, отели и рассчитываю стоимость…');
  pending.classList.add('thinking');

  const result = await groqAiReply(text);

  pending.classList.remove('thinking');
  const bubble = $('.chat-bubble', pending) || $('span', pending);
  bubble.innerHTML = '';

  const proposalData = result.data || generateSmartTourProposal(text);
  renderBotProposalMessage(bubble, proposalData);

  $('small', pending).textContent = now();
  const chatBody = $('#chatBody');
  if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}

// Chat Form Submit
$('#chatForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const input = $('#chatText');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  await sendAiMessage(text);
});

// Quick Replies
$$('.quick-replies button').forEach(b => b.addEventListener('click', async () => {
  const text = b.textContent;
  b.parentElement.remove();
  await sendAiMessage(text);
}));

// =========================================================================
// FULL INTERACTIVE TOUR DETAIL MODAL
// =========================================================================
const tourModal = $('#tourModal');
const tourModalBody = $('#tourModalBody');

function openTourDetailModal(tourIdOrObject) {
  let tour = typeof tourIdOrObject === 'string' ? window.toursRegistry[tourIdOrObject] : tourIdOrObject;

  if (!tour) {
    const smart = generateSmartTourProposal('Гоа на двоих в ноябре');
    tour = smart.proposals[0];
  }

  if (!tourModal || !tourModalBody) return;

  tourModalBody.innerHTML = `
    <!-- Header -->
    <div class="tour-detail-head">
      <div class="tour-detail-breadcrumbs">
        <span>${tour.country}</span> <i>›</i> <span>${tour.resort}</span>
      </div>
      <div class="tour-detail-title-row">
        <h2>${tour.hotelName} ${tour.stars}★</h2>
        <div class="tour-detail-rating-tag">
          <b>★ ${tour.rating}</b>
          <span>Превосходно · ${tour.reviewsCount || 340} отзывов</span>
        </div>
      </div>
      <div class="tour-detail-meta-pills">
        <span class="tour-meta-pill">✈ Прямой перелёт ${tour.departureAirport || 'SVO'} ⇄ ${tour.destinationAirport || 'GOI'}</span>
        <span class="tour-meta-pill">🗓 ${tour.datesText}</span>
        <span class="tour-meta-pill">🍽 ${tour.food}</span>
        <span class="tour-meta-pill">🏖 ${tour.beach}</span>
      </div>
    </div>

    <!-- Photo Gallery with Clickable Thumbs -->
    <div class="tour-detail-gallery">
      <div class="gallery-hero">
        <img id="galleryMainImg" src="${tour.photos[0].url}" alt="${tour.hotelName}">
        <div class="gallery-hero-badge" id="galleryMainBadge">${tour.photos[0].label}</div>
      </div>
      <div class="gallery-thumbs-grid">
        ${tour.photos.map((p, i) => `
          <div class="gallery-thumb-item ${i === 0 ? 'active' : ''}" data-gallery-src="${p.url}" data-gallery-label="${p.label}">
            <img src="${p.url}" alt="${p.label}" loading="lazy">
            <span class="gallery-thumb-label">${p.label}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="tour-detail-tabs-nav">
      <button class="tour-tab-trigger active" data-tab="flights">✈ Рейсы и трансфер</button>
      <button class="tour-tab-trigger" data-tab="hotel">🏨 Отель и пляж</button>
      <button class="tour-tab-trigger" data-tab="food">🍽 Питание</button>
      <button class="tour-tab-trigger" data-tab="inclusions">🛡 Что включено</button>
    </div>

    <!-- Tab 1: Flights -->
    <div class="tour-detail-tab-pane active" id="tab-flights">
      <div class="flight-card-wrap">
        <div class="flight-segment-card">
          <div class="flight-card-header">
            <span>Рейс туда · Прямой перелёт</span>
            <span class="flight-airline-badge">✈ ${tour.airline}</span>
          </div>
          <div class="flight-route-display">
            <div class="airport-col">
              <strong>${tour.departureAirport || 'SVO'} · Москва</strong>
              <span>Шереметьево, Терминал C</span>
              <time>08:30 · 05 ноя 2026</time>
            </div>
            <div class="flight-route-middle">
              <span>${tour.flightHours || '7 ч 15 мин'} в пути</span>
              <div class="flight-line-indicator">
                <span class="flight-plane-icon">✈</span>
              </div>
              <small style="color:var(--muted);font-size:10px;">Прямой чартерный рейс</small>
            </div>
            <div class="airport-col" style="text-align:right;">
              <strong>${tour.destinationAirport || 'GOI'} · ${tour.resort.split(',')[0]}</strong>
              <span>${tour.destinationAirportName || 'Даболим'}</span>
              <time>17:45 · 05 ноя 2026</time>
            </div>
          </div>
          <div class="flight-amenities-row">
            <span class="flight-amenity-item">🧳 Багаж: 20 кг включён</span>
            <span class="flight-amenity-item">🎒 Ручная кладь: 5 кг</span>
            <span class="flight-amenity-item">☕ Горячее питание и напитки на борту</span>
          </div>
        </div>

        <div class="flight-segment-card">
          <div class="flight-card-header">
            <span>Рейс обратно · Прямой перелёт</span>
            <span class="flight-airline-badge">✈ ${tour.airlineReturn || tour.airline}</span>
          </div>
          <div class="flight-route-display">
            <div class="airport-col">
              <strong>${tour.destinationAirport || 'GOI'} · ${tour.resort.split(',')[0]}</strong>
              <span>${tour.destinationAirportName || 'Даболим'}</span>
              <time>19:20 · 17 ноя 2026</time>
            </div>
            <div class="flight-route-middle">
              <span>${tour.flightHours || '7 ч 30 мин'} в пути</span>
              <div class="flight-line-indicator">
                <span class="flight-plane-icon">✈</span>
              </div>
              <small style="color:var(--muted);font-size:10px;">Прямой рейс без пересадок</small>
            </div>
            <div class="airport-col" style="text-align:right;">
              <strong>${tour.departureAirport || 'SVO'} · Москва</strong>
              <span>Шереметьево, Терминал C</span>
              <time>01:50 (+1) · 18 ноя</time>
            </div>
          </div>
          <div class="flight-amenities-row">
            <span class="flight-amenity-item">🧳 Багаж: 20 кг включён</span>
            <span class="flight-amenity-item">🎒 Ручная кладь: 5 кг</span>
            <span class="flight-amenity-item">✓ Онлайн-регистрация за 24 часа</span>
          </div>
        </div>

        <div class="transfer-info-box">
          <div class="transfer-icon">🚐</div>
          <div class="transfer-text">
            <b>Групповой трансфер на комфортабельном минивэне/автобусе</b>
            <p>Встреча с именной табличкой у выхода из терминала аэропорта. Доставка прямо до дверей ресепшн отеля (~45 минут). Кондиционер, питьевая вода и помощь с багажом.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Hotel & Beach -->
    <div class="tour-detail-tab-pane" id="tab-hotel">
      <div class="hotel-specs-grid">
        <div class="spec-box">
          <div class="spec-box-icon">🏖</div>
          <h4>Пляж и море</h4>
          <p>${tour.beach}. Мелкий золотистый песок, пологий удобный вход в воду, отсутствие сильных волн. Шезлонги, зонтики и пляжные полотенца предоставляются бесплатно.</p>
        </div>
        <div class="spec-box">
          <div class="spec-box-icon">🛏</div>
          <h4>Номер ${tour.room}</h4>
          <p>Просторный номер с балконом или террасой. Большая двуспальная кровать King-Size, кондиционер с климат-контролем, мини-бар, сейф, быстрый Wi-Fi, халаты и тапочки.</p>
        </div>
        <div class="spec-box">
          <div class="spec-box-icon">🏊</div>
          <h4>Инфраструктура и бассейны</h4>
          <p>2 открытых бассейна с зоной отдыха, SPA-комплекс с аутентичными оздоровительными процедурами, тренажёрный зал, лаундж-бары и экскурсионное бюро.</p>
        </div>
        <div class="spec-box">
          <div class="spec-box-icon">📍</div>
          <h4>Расположение</h4>
          <p>${tour.resort}. В пешей доступности уютные прибрежные кафе со свежими морепродуктами, колоритные сувенирные лавки и фруктовые рынки.</p>
        </div>
      </div>
      <div class="hotel-desc-card">
        <b>Об отеле:</b> ${tour.description}
      </div>
    </div>

    <!-- Tab 3: Food -->
    <div class="tour-detail-tab-pane" id="tab-food">
      <div class="spec-box" style="margin-bottom:16px;">
        <div class="spec-box-icon">🍽</div>
        <h4>Концепция питания: ${tour.food}</h4>
        <p>Завтраки, обеды и ужины в главном ресторане по системе «шведский стол» с широким выбором европейских и местных блюд. В течение дня в барах доступны прохладительные и горячие напитки, тропические коктейли, свежие фрукты и легкие закуски.</p>
      </div>
      <div class="hotel-specs-grid">
        <div class="spec-box">
          <b>Главный ресторан</b>
          <p>Завтрак 07:00–10:30, Обед 12:30–15:00, Ужин 19:00–22:00. Тематические вечера с грилем и морепродуктами.</p>
        </div>
        <div class="spec-box">
          <b>Бары и лаунджи</b>
          <p>Пляжный бар и бар у бассейна с 10:00 до 23:00. Безалкогольные напитки, кофе, местное вино и коктейли.</p>
        </div>
      </div>
    </div>

    <!-- Tab 4: Inclusions -->
    <div class="tour-detail-tab-pane" id="tab-inclusions">
      <div class="inclusions-grid">
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Прямые авиаперелеты туда и обратно</b>
            <span>${tour.departureAirport || 'Москва'} ⇄ ${tour.destinationAirport || 'Гоа'}, ${tour.airline}</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Багаж 20 кг + 5 кг ручная кладь</b>
            <span>Включён на каждого зарегистрированного туриста</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Проживание ${tour.nights} ночей</b>
            <span>В отеле ${tour.hotelName} (${tour.room})</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Питание «${tour.food}»</b>
            <span>Весь период проживания согласно концепции</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Трансфер аэропорт — отель — аэропорт</b>
            <span>Групповой кондиционированный трансфер</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Медицинская страховка туриста</b>
            <span>Покрытие $40 000 на каждого путешественника</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Авторский экскурсионный пакет</b>
            <span>Включен в состав туристического предложения</span>
          </div>
        </div>
        <div class="inclusion-card">
          <span class="inclusion-check">✓</span>
          <div class="inclusion-card-text">
            <b>Персональный турагент 24/7</b>
            <span>Поддержка эксперта «Ростов-Елена-Тур» до возвращения</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Bar -->
    <div class="tour-detail-sticky-bar">
      <div class="tour-detail-price-col">
        <small>Полная стоимость тура за всех туристов</small>
        <strong>
          ${tour.priceTotal}
          <del>${tour.priceOld}</del>
        </strong>
        <span>✓ Экономия 28 000 ₽ при бронировании сегодня</span>
      </div>
      <div class="tour-detail-actions-group">
        <button class="button-ask-agent" id="btnAskAgentAboutTour">
          Задать вопрос эксперту
        </button>
        <button class="button-book-large" id="btnBookTourFromModal">
          <span>Забронировать этот тур</span> <i>→</i>
        </button>
      </div>
    </div>
  `;

  // Gallery Thumbs Switcher
  const mainImg = $('#galleryMainImg', tourModalBody);
  const mainBadge = $('#galleryMainBadge', tourModalBody);
  $$('.gallery-thumb-item', tourModalBody).forEach(thumb => {
    thumb.addEventListener('click', () => {
      $$('.gallery-thumb-item', tourModalBody).forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.getAttribute('data-gallery-src');
      const lbl = thumb.getAttribute('data-gallery-label');
      if (mainImg) mainImg.src = src;
      if (mainBadge) mainBadge.textContent = lbl;
    });
  });

  // Tabs Switcher
  $$('.tour-tab-trigger', tourModalBody).forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      $$('.tour-tab-trigger', tourModalBody).forEach(b => b.classList.remove('active'));
      $$('.tour-detail-tab-pane', tourModalBody).forEach(p => p.classList.remove('active'));
      tabBtn.classList.add('active');
      const tabId = 'tab-' + tabBtn.getAttribute('data-tab');
      const targetPane = $('#' + tabId, tourModalBody);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Action Buttons
  $('#btnBookTourFromModal', tourModalBody)?.addEventListener('click', () => {
    closeTourDetailModal();
    openLead(`Бронирование: ${tour.hotelName} ${tour.stars}★ (${tour.resort}, ${tour.datesShort}, ${tour.priceTotal})`);
  });

  $('#btnAskAgentAboutTour', tourModalBody)?.addEventListener('click', () => {
    closeTourDetailModal();
    openAi(`Расскажи подробнее про отель ${tour.hotelName} в ${tour.resort}`);
  });

  // Open Modal
  tourModal.classList.add('open');
  tourModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeTourDetailModal() {
  if (!tourModal) return;
  tourModal.classList.remove('open');
  tourModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$$('[data-close-tour-modal]').forEach(b => b.addEventListener('click', closeTourDetailModal));

// Check URL param ?tour=... or #tour=... to open modal directly
function checkUrlTourParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('tour') || (window.location.hash.startsWith('#tour=') ? window.location.hash.replace('#tour=', '') : null);
  if (tourId) {
    setTimeout(() => {
      openTourDetailModal(tourId);
    }, 400);
  }
}
window.addEventListener('DOMContentLoaded', checkUrlTourParam);

// =========================================================================
// HOMEPAGE CARDS, SEARCH & LEAD FORMS
// =========================================================================

// Offer Grid navigation
const grid = $('#offerGrid');
$('#cardNext')?.addEventListener('click', () => grid?.scrollBy({ left: 380, behavior: 'smooth' }));
$('#cardPrev')?.addEventListener('click', () => grid?.scrollBy({ left: -380, behavior: 'smooth' }));

// Favorites Hearts
$$('.heart').forEach(h => h.addEventListener('click', () => {
  h.classList.toggle('saved');
  h.textContent = h.classList.contains('saved') ? '♥' : '♡';
  showToast(h.classList.contains('saved') ? 'Добавлено в избранное' : 'Удалено из избранного');
}));

// Pre-fill Homepage Cards in Tours Registry
const HOMEPAGE_TOURS = [
  {
    id: 'home-crystal-sunset',
    hotelName: 'Crystal Sunset Luxury Resort',
    stars: 5,
    rating: '4.8',
    reviewsCount: 386,
    country: 'Турция',
    resort: 'Сиде',
    beach: '1-я линия (150 м до моря, песчаный пляж)',
    food: 'Всё включено',
    room: 'Standard Room Sea View (32 м²)',
    departureCity: 'Москвы',
    departureAirport: 'SVO',
    destinationAirport: 'AYT',
    destinationAirportName: 'Анталья',
    datesText: '8 ночей · 15–23 сентября 2026',
    datesShort: '15–23 сен 2026',
    nights: 8,
    airline: 'Turkish Airlines (TK-3912)',
    airlineReturn: 'Turkish Airlines (TK-3913)',
    flightHours: '4 ч 20 мин',
    priceTotal: '168 900 ₽',
    priceOld: '189 000 ₽',
    pricePerPerson: '84 450 ₽ / чел.',
    discount: '-11%',
    features: ['Аквапарк с 11 горками', '7 ресторанов a la carte', 'Песчаный пляж с пирсом', 'SPA-центр'],
    photos: PHOTO_BANKS.turkey,
    description: 'Один из лучших отелей Сиде для семейного и романтического отдыха. Обширная территория, аквапарк, великолепная кухня.'
  },
  {
    id: 'home-serenity-alma',
    hotelName: 'Serenity Alma Heights',
    stars: 5,
    rating: '4.7',
    reviewsCount: 214,
    country: 'Египет',
    resort: 'Макади-Бей',
    beach: '1-я линия (живой коралловый риф)',
    food: 'Всё включено',
    room: 'Family Room (42 м²)',
    departureCity: 'Москвы',
    departureAirport: 'SVO',
    destinationAirport: 'HRG',
    destinationAirportName: 'Хургада',
    datesText: '9 ночей · 18–27 сентября 2026',
    datesShort: '18–27 сен 2026',
    nights: 9,
    airline: 'Air Cairo (SM-902)',
    airlineReturn: 'Air Cairo (SM-903)',
    flightHours: '5 ч 10 мин',
    priceTotal: '214 500 ₽',
    priceOld: '238 000 ₽',
    pricePerPerson: '107 250 ₽ / чел.',
    discount: '-10%',
    features: ['Собственный аквапарк', 'Красочный коралловый риф', 'Детский луна-парк', 'Подогреваемые бассейны'],
    photos: PHOTO_BANKS.egypt,
    description: 'Отель в живописном заливе Макади-Бей. Прекрасный риф, луна-парк и разнообразная детская анимация.'
  },
  {
    id: 'home-rixos-bab-al-bahr',
    hotelName: 'Rixos Bab Al Bahr',
    stars: 5,
    rating: '4.8',
    reviewsCount: 529,
    country: 'ОАЭ',
    resort: 'Рас-эль-Хайма',
    beach: '1-я линия (песчаный пляж острова Марджан)',
    food: 'Ультра всё включено',
    room: 'Deluxe Room (35 м²)',
    departureCity: 'Москвы',
    departureAirport: 'SVO',
    destinationAirport: 'DXB',
    destinationAirportName: 'Дубай',
    datesText: '7 ночей · 20–27 октября 2026',
    datesShort: '20–27 окт 2026',
    nights: 7,
    airline: 'Flydubai (FZ-968)',
    airlineReturn: 'Flydubai (FZ-969)',
    flightHours: '5 ч 30 мин',
    priceTotal: '189 600 ₽',
    priceOld: '215 000 ₽',
    pricePerPerson: '94 800 ₽ / чел.',
    discount: '-12%',
    features: ['Ультра всё включено в ОАЭ', '8 бассейнов и инфинити', '14 ресторанов и баров', 'Пляжные вечеринки'],
    photos: PHOTO_BANKS.uae,
    description: 'Престижный курорт в Рас-эль-Хайме с редкой для Эмиратов концепцией Ultra All Inclusive.'
  }
];

HOMEPAGE_TOURS.forEach(t => { window.toursRegistry[t.id] = t; });

// Connect "Подробнее" buttons on homepage to the rich Tour Detail Modal
$$('[data-tour]').forEach(b => {
  b.addEventListener('click', (e) => {
    e.preventDefault();
    const tourName = b.dataset.tour;
    const found = Object.values(window.toursRegistry).find(t => t.hotelName.toLowerCase().includes(tourName.toLowerCase().split(' ')[0]));
    if (found) {
      openTourDetailModal(found);
    } else {
      const smart = generateSmartTourProposal(tourName);
      openTourDetailModal(smart.proposals[0]);
    }
  });
});

// Homepage Search Form Submit
$('#tourSearch')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = $('.button-search');
  const original = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<span>Подбираем туры и рейсы…</span>';
    btn.disabled = true;
  }

  const dest = $('#destination')?.value || 'Турция';
  const dep = $('#departure')?.value || 'Ростов-на-Дону';
  const tourists = $('#tourists')?.value || '2 взрослых';
  const nights = $('#nights')?.value || '7–9 ночей';

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = original;
      btn.disabled = false;
    }
    openAi(`Найди тур: ${dest}, вылет из ${dep}, состав ${tourists}, длительность ${nights}`);
  }, 500);
});

// Mood Cards
$$('.mood-card').forEach(card => card.addEventListener('click', () => {
  $$('.mood-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  openAi(`Хочу отдых: ${card.dataset.mood}`);
}));

// Lead Modal Capture
const modal = $('#leadModal');
const modalContent = $('#modalContent');

function openLead(subject) {
  if (!modal || !modalContent) return;
  const title = $('#modalTitle');
  if (title) title.textContent = subject ? 'Заявка на тур' : 'Получить консультацию';
  const subjInput = $('#leadSubject');
  if (subjInput) subjInput.value = subject || 'Консультация по туру';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLead() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$$('[data-lead]').forEach(b => b.addEventListener('click', () => openLead(b.dataset.lead)));
$$('[data-close-modal]').forEach(b => b.addEventListener('click', closeLead));

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLead();
      closeAi();
      closeTourDetailModal();
    }
  });
}

function successMarkup(subject) {
  const id = 'RET-' + Math.floor(1000 + Math.random() * 8999);
  return `
    <div class="success-state">
      <div class="success-icon">✓</div>
      <span class="section-kicker">Заявка ${id}</span>
      <h2>Спасибо! Запрос принят</h2>
      <p style="margin:8px 0 16px;color:var(--ink);font-weight:700;">${subject || 'Подбор тура'}</p>
      <p>Менеджер «Ростов-Елена-Тур» уже проверяет актуальные рейсы и свяжется с вами в течение 10 минут.</p>
      <div class="bot-route">Сайт → Серверная база → Единый Telegram-бот → Эксперт по направлению</div>
      <button class="button button-dark" data-success-close style="margin-top:14px;">Вернуться на сайт</button>
    </div>
  `;
}

$('#leadForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if (modalContent) {
    modalContent.innerHTML = successMarkup($('#leadSubject')?.value);
    $('[data-success-close]')?.addEventListener('click', closeLead);
  }
});

$('#quickForm')?.addEventListener('submit', e => {
  e.preventDefault();
  openLead('Персональная подборка');
  setTimeout(() => {
    if (modalContent) {
      modalContent.innerHTML = successMarkup('Персональная подборка');
      $('[data-success-close]')?.addEventListener('click', closeLead);
    }
  }, 250);
});

console.log('Ростов-Елена-Тур: AI Pro Tour Proposals Engine v3 initialized.');
