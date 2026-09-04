# Ростов-Елена-Тур — полный handoff проекта

> Этот файл предназначен для передачи проекта разработчику или деплоя в репозиторий. Он содержит контекст, архитектуру, инструкции по запуску и полный исходный код текстовых файлов. Данные о турах и цены в прототипе тестовые.

## 1. Что это за проект

Современный демонстрационный сайт турагентства «Ростов-Елена-Тур»:

- адаптивный лендинг;
- форма поиска туров с тестовыми параметрами;
- 9 демонстрационных карточек;
- формы захвата заявок;
- модальное окно заявки с автоподстановкой параметров тура и маской телефона (+7);
- полноэкранная детальная презентация тура (Tour Detail Modal) с фотогалереей, расписанием рейсов туда/обратно, нормами багажа, концепцией питания и чек-листом включенных услуг;
- AI-турагент «Алиса» с интерактивными мини-карточками туров и кнопками мгновенного просмотра и бронирования;
- ответы AI генерирует Groq, модель `openai/gpt-oss-20b` через Vercel Function + встроенный интеллектуальный офлайн-движок;
- публичный фронтенд размещён на GitHub Pages;
- защищённый API-прокси размещён как Vercel Function;
- ключ Groq хранится только в переменной окружения Vercel.

## 2. Адреса и репозиторий

- Репозиторий: https://github.com/reklamadomodedovo-star/turyrostova-prototype
- Публичный сайт (GitHub Pages): https://reklamadomodedovo-star.github.io/turyrostova-prototype/
- AI API (Vercel): https://turyrostova-groq-api-reklamadomodedovo-7709.vercel.app/api/ai
- Vercel project: `turyrostova-groq-api`

## 3. Полный исходный код

### `index.html`

````html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Ростов-Елена-Тур — персональный подбор путешествий, поиск туров и поддержка эксперта.">
  <meta name="theme-color" content="#092f33">
  <title>Ростов-Елена-Тур — путешествие, которое подходит именно вам</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Prata&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=ui-fix-v4">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"TravelAgency","name":"Ростов-Елена-Тур","telephone":"+7-863-221-05-21","email":"rostovelenatur@yandex.ru","address":{"@type":"PostalAddress","addressLocality":"Ростов-на-Дону","streetAddress":"ул. Лермонтовская, 125","addressCountry":"RU"},"url":"https://turyrostova.ru/"}
  </script>
</head>
<body>
  <div class="prototype-note"><span></span> Демонстрационный прототип нового сайта</div>

  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="Ростов-Елена-Тур — главная">
      <span class="brand-mark">РЕТ</span>
      <span class="brand-copy"><b>Ростов-Елена-Тур</b><small>путешествия с заботой</small></span>
    </a>
    <nav class="nav" id="nav" aria-label="Основная навигация">
      <a href="#search">Найти тур</a>
      <a href="#offers">Горящие туры</a>
      <a href="#ai">Подбор с ИИ</a>
      <a href="#about">О нас</a>
      <a href="#reviews">Отзывы</a>
    </nav>
    <div class="header-actions">
      <a class="phone" href="tel:+78632210521">+7 (863) 221-05-21</a>
      <button class="button button-small button-dark" data-lead="Перезвонить мне">Перезвонить</button>
    </div>
    <button class="menu-toggle" id="menuToggle" aria-label="Открыть меню" aria-expanded="false"><i></i><i></i></button>
  </header>

  <main>
    <section class="hero">
      <div class="hero-media" aria-hidden="true">
        <img src="https://images.pexels.com/photos/19732855/pexels-photo-19732855.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="">
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content reveal">
        <div class="eyebrow"><span>26 лет рядом с туристами</span><span>Ростов-на-Дону</span></div>
        <h1>Отпуск, который<br><em>подходит именно вам</em></h1>
        <p>Найдём лучший вариант, честно сравним отели и останемся на связи до вашего возвращения домой.</p>
      </div>
      <div class="weather-card reveal delay-2">
        <span class="weather-icon">☀</span><div><small>Анталья сейчас</small><strong>+29° · море +27°</strong></div>
      </div>
      <a class="scroll-cue" href="#search"><span>Искать тур</span><i>↓</i></a>
    </section>

    <section class="search-wrap" id="search">
      <div class="search-card reveal">
        <div class="search-topline">
          <div>
            <span class="section-kicker">Поиск путешествия</span>
            <h2>Куда отправимся?</h2>
          </div>
          <button class="ai-inline" id="openAiTop"><span class="spark">✦</span><span><b>Не знаете, куда?</b><small>Подберём вместе с ИИ</small></span><i>→</i></button>
        </div>
        <form class="search-form" id="tourSearch">
          <label><span>Откуда</span><select id="departure"><option>Ростов-на-Дону</option><option>Москва</option><option>Сочи</option><option>Минеральные Воды</option></select></label>
          <label><span>Куда</span><select id="destination"><option>Турция</option><option>Египет</option><option>ОАЭ</option><option>Россия</option><option>Куда угодно</option></select></label>
          <label><span>Когда</span><input id="tourDate" type="date" aria-label="Дата вылета"></label>
          <label><span>Ночей</span><select id="nights"><option>7–9 ночей</option><option>10–12 ночей</option><option>13–15 ночей</option></select></label>
          <label><span>Туристы</span><select id="tourists"><option>2 взрослых</option><option>2 взрослых, 1 ребёнок</option><option>1 взрослый</option><option>Свой состав</option></select></label>
          <button class="button button-search" type="submit"><span>Найти туры</span><i>→</i></button>
        </form>
        <div class="search-foot"><span><i></i> Более 500 000 предложений от туроператоров</span><small>Демонстрационная версия поиска</small></div>
      </div>
    </section>

    <section class="stats section-pad reveal">
      <div><strong>26</strong><span>лет создаём<br>путешествия</span></div>
      <div><strong>12 000+</strong><span>туристов уже<br>отдохнули с нами</span></div>
      <div><strong>24/7</strong><span>на связи во время<br>вашего путешествия</span></div>
      <div><strong>4,9</strong><span>средняя оценка<br>по отзывам</span></div>
    </section>

    <section class="offers section-pad" id="offers">
      <div class="section-head reveal">
        <div><span class="section-kicker">Выбор редакции</span><h2>Идеи, с которых можно<br><em>начать путешествие</em></h2></div>
        <div class="section-actions"><button class="round-arrow" id="cardPrev" aria-label="Назад">←</button><button class="round-arrow" id="cardNext" aria-label="Вперёд">→</button></div>
      </div>
      <div class="offer-grid" id="offerGrid">
        <article class="tour-card reveal">
          <div class="tour-image"><img src="https://images.pexels.com/photos/19732855/pexels-photo-19732855.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Бирюзовое море у побережья Турции"><span class="tag hot">Горящий</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Турция · Сиде</span><span>8 ночей</span></div><h3>Crystal Sunset Luxury Resort</h3><div class="rating"><b>4,8</b><span>Превосходно · 386 отзывов</span></div><div class="tour-details"><span>Всё включено</span><span>Вылет из Москвы</span></div><div class="tour-price"><div><small>за двоих</small><strong>от 168 900 ₽</strong></div><button class="button button-outline" data-tour="Crystal Sunset Luxury Resort">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal delay-1">
          <div class="tour-image"><img src="https://images.pexels.com/photos/12913416/pexels-photo-12913416.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Семейный отдых на пляже"><span class="tag family">С детьми</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Египет · Макади-Бей</span><span>9 ночей</span></div><h3>Serenity Alma Heights</h3><div class="rating"><b>4,7</b><span>Отлично · 214 отзывов</span></div><div class="tour-details"><span>Всё включено</span><span>Аквапарк</span></div><div class="tour-price"><div><small>за семью</small><strong>от 214 500 ₽</strong></div><button class="button button-outline" data-tour="Serenity Alma Heights">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal delay-2">
          <div class="tour-image"><img src="https://images.pexels.com/photos/29038705/pexels-photo-29038705.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Круизный лайнер у европейского побережья"><span class="tag cruise">Круиз</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Средиземноморье</span><span>7 ночей</span></div><h3>Италия, Франция и Испания</h3><div class="rating"><b>4,9</b><span>Выбор эксперта</span></div><div class="tour-details"><span>Полный пансион</span><span>6 городов</span></div><div class="tour-price"><div><small>за человека</small><strong>от 139 800 ₽</strong></div><button class="button button-outline" data-tour="Круиз: Италия, Франция и Испания">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal">
          <div class="tour-image"><img src="https://images.pexels.com/photos/12913416/pexels-photo-12913416.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Пляжный отдых в Объединённых Арабских Эмиратах"><span class="tag family">Новинка</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>ОАЭ · Рас-эль-Хайма</span><span>7 ночей</span></div><h3>Rixos Bab Al Bahr</h3><div class="rating"><b>4,8</b><span>Превосходно · 529 отзывов</span></div><div class="tour-details"><span>Ультра всё включено</span><span>Первая линия</span></div><div class="tour-price"><div><small>за двоих</small><strong>от 189 600 ₽</strong></div><button class="button button-outline" data-tour="Rixos Bab Al Bahr">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal delay-1">
          <div class="tour-image"><img src="https://images.pexels.com/photos/19732855/pexels-photo-19732855.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Морское побережье Таиланда"><span class="tag hot">−18%</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Таиланд · Пхукет</span><span>11 ночей</span></div><h3>Pullman Phuket Karon Beach</h3><div class="rating"><b>4,7</b><span>Отлично · 418 отзывов</span></div><div class="tour-details"><span>Завтраки</span><span>Тропический сад</span></div><div class="tour-price"><div><small>за двоих</small><strong>от 246 300 ₽</strong></div><button class="button button-outline" data-tour="Pullman Phuket Karon Beach">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal delay-2">
          <div class="tour-image"><img src="https://images.pexels.com/photos/29038705/pexels-photo-29038705.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Путешествие по Стамбулу"><span class="tag cruise">Сити-тур</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Турция · Стамбул</span><span>5 ночей</span></div><h3>Radisson Blu Pera</h3><div class="rating"><b>4,6</b><span>Отлично · 307 отзывов</span></div><div class="tour-details"><span>Завтраки</span><span>Центр города</span></div><div class="tour-price"><div><small>за двоих</small><strong>от 124 900 ₽</strong></div><button class="button button-outline" data-tour="Radisson Blu Pera">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal">
          <div class="tour-image"><img src="https://images.pexels.com/photos/29038705/pexels-photo-29038705.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Горный отдых в Красной Поляне"><span class="tag family">Россия</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Россия · Красная Поляна</span><span>6 ночей</span></div><h3>Marriott Sochi Krasnaya Polyana</h3><div class="rating"><b>4,9</b><span>Выбор гостей · 691 отзыв</span></div><div class="tour-details"><span>Завтраки</span><span>Спа и бассейн</span></div><div class="tour-price"><div><small>за двоих</small><strong>от 96 400 ₽</strong></div><button class="button button-outline" data-tour="Marriott Sochi Krasnaya Polyana">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal delay-1">
          <div class="tour-image"><img src="https://images.pexels.com/photos/12913416/pexels-photo-12913416.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Семейный отдых на Кипре"><span class="tag hot">Горящий</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Кипр · Пафос</span><span>8 ночей</span></div><h3>Louis Phaethon Beach</h3><div class="rating"><b>4,7</b><span>Отлично · 344 отзыва</span></div><div class="tour-details"><span>Всё включено</span><span>Для семей</span></div><div class="tour-price"><div><small>за семью</small><strong>от 218 700 ₽</strong></div><button class="button button-outline" data-tour="Louis Phaethon Beach">Подробнее</button></div></div>
        </article>
        <article class="tour-card reveal delay-2">
          <div class="tour-image"><img src="https://images.pexels.com/photos/19732855/pexels-photo-19732855.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Бирюзовое море на Мальдивах"><span class="tag cruise">Премиум</span><button class="heart" aria-label="Добавить в избранное">♡</button></div>
          <div class="tour-body"><div class="tour-meta"><span>Мальдивы · Южный Мале</span><span>9 ночей</span></div><h3>Sun Siyam Olhuveli</h3><div class="rating"><b>4,9</b><span>Превосходно · 812 отзывов</span></div><div class="tour-details"><span>Полупансион</span><span>Вилла у океана</span></div><div class="tour-price"><div><small>за двоих</small><strong>от 338 500 ₽</strong></div><button class="button button-outline" data-tour="Sun Siyam Olhuveli">Подробнее</button></div></div>
        </article>
      </div>
      <p class="demo-caption">Цены и предложения показаны для демонстрации интерфейса и не являются публичной офертой.</p>
    </section>

    <section class="ai-section section-pad" id="ai">
      <div class="ai-visual reveal">
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
        <div class="ai-orb"><span>✦</span><b>РЕТ AI</b><small>знает, какой отдых<br>подойдёт именно вам</small></div>
        <span class="floating-chip chip-one">Песчаный пляж</span><span class="floating-chip chip-two">До 250 000 ₽</span><span class="floating-chip chip-three">С ребёнком 6 лет</span>
      </div>
      <div class="ai-copy reveal delay-1">
        <span class="section-kicker light">Ваш личный турагент 24/7</span>
        <h2>Расскажите о мечте.<br><em>ИИ соберёт путешествие.</em></h2>
        <p>Не нужно разбираться в сотнях отелей. Ответьте на несколько простых вопросов — помощник поймёт ваши пожелания, сравнит варианты и объяснит разницу.</p>
        <div class="ai-prompts"><button class="prompt-chip">«Хотим на море с ребёнком»</button><button class="prompt-chip">«Куда улететь до 180 000 ₽?»</button><button class="prompt-chip">«Нужен тихий отель без детей»</button></div>
        <button class="button button-coral" id="startAi"><span>Начать подбор с ИИ</span><i>✦</i></button>
        <small class="ai-human">В любой момент можно позвать живого менеджера</small>
      </div>
    </section>

    <section class="directions section-pad">
      <div class="section-head reveal"><div><span class="section-kicker">Выберите настроение</span><h2>Как вы хотите<br><em>провести этот отпуск?</em></h2></div></div>
      <div class="mood-grid reveal">
        <button class="mood-card active" data-mood="Море и солнце"><span>01</span><b>Море и солнце</b><small>Пляжи, тепло и полная перезагрузка</small><i>↗</i></button>
        <button class="mood-card" data-mood="С детьми"><span>02</span><b>С детьми</b><small>Семейные отели, аквапарки и удобный перелёт</small><i>↗</i></button>
        <button class="mood-card" data-mood="Круизы"><span>03</span><b>Круизы</b><small>Несколько стран за одно путешествие</small><i>↗</i></button>
        <button class="mood-card" data-mood="Россия"><span>04</span><b>Открыть Россию</b><small>Карелия, Кавказ, Алтай и экскурсионные маршруты</small><i>↗</i></button>
      </div>
    </section>

    <section class="about section-pad" id="about">
      <div class="about-intro reveal"><span class="section-kicker">Почему нам доверяют</span><h2>Мы не продаём туры.<br><em>Мы отвечаем за ваш отдых.</em></h2></div>
      <div class="about-grid">
        <article class="about-main reveal"><span class="big-number">24/7</span><h3>Не оставляем один на один с проблемой</h3><p>От бронирования до возвращения домой ваш менеджер остаётся на связи и помогает в любой ситуации.</p><button class="text-link" data-lead="Познакомиться с менеджером">Познакомиться с командой <i>→</i></button></article>
        <article class="benefit reveal delay-1"><span class="benefit-icon">◇</span><h3>Помним ваши предпочтения</h3><p>Сохраняем историю путешествий и с каждым разом подбираем точнее.</p></article>
        <article class="benefit reveal delay-2"><span class="benefit-icon">✓</span><h3>Говорим честно</h3><p>Расскажем не только о плюсах отеля, но и о нюансах, которые важно знать.</p></article>
      </div>
    </section>

    <section class="reviews section-pad" id="reviews">
      <div class="review-card reveal">
        <div class="quote-mark">“</div>
        <blockquote>К каждому из нас индивидуальный подход. Девочки на связи 24/7 от момента бронирования до возвращения, перед поездкой всегда напомнят, что необходимо взять с собой.</blockquote>
        <div class="review-author"><span>ЕТ</span><div><b>Елена Т.</b><small>Отдых в Турции · Яндекс</small></div><strong>5,0 ★</strong></div>
      </div>
      <div class="review-copy reveal delay-1"><span class="section-kicker">Отзывы туристов</span><h2>Лучше всего о нас<br><em>говорят путешествия</em></h2><p>Настоящие истории клиентов — о выборе отеля, поддержке и тех моментах, ради которых хочется снова собирать чемодан.</p><a class="button button-dark" href="https://yandex.ru" target="_blank" rel="noopener">Читать все отзывы <i>→</i></a></div>
    </section>

    <section class="lead-section section-pad">
      <div class="lead-inner reveal">
        <span class="section-kicker light">Начнём с простого</span>
        <h2>Где вы хотите<br><em>проснуться завтра?</em></h2>
        <p>Оставьте номер — эксперт перезвонит, задаст несколько вопросов и подготовит первую подборку.</p>
        <form class="quick-form" id="quickForm"><label><span>Ваше имя</span><input required name="name" placeholder="Например, Анна"></label><label><span>Телефон</span><input required name="phone" type="tel" placeholder="+7 (___) ___-__-__"></label><button class="button button-coral" type="submit">Получить подборку <i>→</i></button></form>
        <small>Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных</small>
      </div>
      <div class="telegram-flow reveal delay-2">
        <div class="tg-head"><span class="tg-logo">➤</span><div><b>Новая заявка #RET-4821</b><small>Ростов-Елена-Тур · только что</small></div></div>
        <dl><div><dt>Клиент</dt><dd>Анна · +7 928 ••• •• 41</dd></div><div><dt>Запрос</dt><dd>Турция, двое взрослых + ребёнок</dd></div><div><dt>Бюджет</dt><dd>до 250 000 ₽</dd></div><div><dt>Источник</dt><dd>ИИ-подбор · новый сайт</dd></div></dl>
        <div class="tg-actions"><button>Взять в работу</button><button>Открыть диалог</button></div>
        <span class="flow-label">Так менеджер получает каждую заявку</span>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-top"><a class="brand brand-light" href="#top"><span class="brand-mark">РЕТ</span><span class="brand-copy"><b>Ростов-Елена-Тур</b><small>путешествия с заботой</small></span></a><div class="footer-cta"><span>Есть вопрос?</span><button class="button button-coral" data-lead="Задать вопрос">Задать менеджеру</button></div></div>
    <div class="footer-grid"><div><span>Связаться</span><a href="tel:+78632210521">+7 (863) 221-05-21</a><a href="mailto:rostovelenatur@yandex.ru">rostovelenatur@yandex.ru</a></div><div><span>Адрес</span><p>Ростов-на-Дону<br>ул. Лермонтовская, 125</p></div><div><span>Направления</span><a href="#offers">Горящие туры</a><a href="#ai">Подбор с ИИ</a><a href="#search">Поиск туров</a></div><div><span>Документы</span><a href="#">Политика обработки данных</a><a href="#">Договор</a><a href="#">Способы оплаты</a></div></div>
    <div class="footer-bottom"><span>© ООО «Ростов-Елена-Тур» · ИНН 6165109025 · РТА 0007787</span><span>Прототип новой digital-платформы</span></div>
  </footer>

  <button class="ai-fab" id="aiFab" aria-label="Открыть ИИ-консультанта"><span>✦</span><div><b>Подобрать тур</b><small>с помощью ИИ</small></div></button>

  <aside class="ai-drawer" id="aiDrawer" aria-hidden="true">
    <div class="ai-drawer-head"><div><span class="ai-avatar">✦</span><div><b>Алиса, AI-турагент</b><small><i></i> онлайн · отвечает сразу</small></div></div><button id="closeAi" aria-label="Закрыть">×</button></div>
    <div class="chat-body" id="chatBody">
      <div class="chat-message bot"><div class="chat-bubble">Здравствуйте! Я помогу выбрать путешествие под ваши пожелания. Расскажите, с кем и когда хотите поехать?</div><small>13:04</small></div>
      <div class="quick-replies"><button>Выгодный тур в Турцию на двоих в сентябре из Ростова</button><button>Семья с ребёнком</button><button>Отдых вдвоём</button></div>
    </div>
    <form class="chat-input" id="chatForm"><textarea id="chatText" rows="1" placeholder="Напишите, каким видите отпуск…"></textarea><button type="submit" aria-label="Отправить">↑</button></form>
    <div class="chat-note">Groq GPT‑OSS 20B · без регистрации · туры и цены тестовые</div>
  </aside>
  <div class="drawer-backdrop" id="drawerBackdrop"></div>

  <div class="modal" id="leadModal" aria-hidden="true">
    <div class="modal-backdrop" data-close-modal></div>
    <div class="modal-panel">
      <button class="modal-close" data-close-modal aria-label="Закрыть">×</button>
      <div class="modal-content" id="modalContent">
        <span class="section-kicker">Персональная консультация</span><h2 id="modalTitle">Уточнить детали тура</h2><p>Оставьте контакт — менеджер свяжется с вами и проверит актуальную стоимость.</p>
        <form id="leadForm"><input type="hidden" id="leadSubject"><label><span>Как вас зовут?</span><input required name="name" placeholder="Ваше имя"></label><label><span>Номер телефона</span><input required name="phone" type="tel" placeholder="+7 (___) ___-__-__"></label><label><span>Как удобнее связаться?</span><select name="channel"><option>Позвонить</option><option>WhatsApp</option><option>Telegram</option><option>MAX</option></select></label><button class="button button-coral" type="submit">Отправить заявку <i>→</i></button><small>Данные защищены и используются только для связи по заявке</small></form>
      </div>
    </div>
  </div>

  
  <!-- Full Interactive Tour Detail Modal -->
  <div class="modal tour-detail-modal" id="tourModal" aria-hidden="true">
    <div class="modal-backdrop" data-close-tour-modal></div>
    <div class="tour-modal-panel">
      <button class="modal-close" data-close-tour-modal aria-label="Закрыть">×</button>
      <div id="tourModalBody">
        <!-- Dynamically rendered by JavaScript -->
      </div>
    </div>
  </div>

  <div class="toast" id="toast"><b>Добавлено в избранное</b><span>Тур сохранён для сравнения</span></div>
  <script src="app.js?v=tour-proposals-v4"></script>
</body>
</html>

````

### `styles.css`

````css
:root{--ink:#092f33;--ink-2:#15484b;--coral:#ff6f4d;--sand:#f4f0e7;--cream:#fbf9f5;--mint:#b8e7dc;--white:#fff;--muted:#66777a;--line:rgba(9,47,51,.13);--shadow:0 24px 70px rgba(9,47,51,.13)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink);font-family:Manrope,Arial,sans-serif;font-size:16px;overflow-x:hidden}button,input,select,textarea{font:inherit}button,a{tap-highlight-color:transparent}a{color:inherit;text-decoration:none}img{display:block;width:100%;height:100%;object-fit:cover}em{font-family:Prata,Georgia,serif;font-style:italic;font-weight:400}.prototype-note{height:28px;background:var(--coral);color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;text-transform:uppercase;letter-spacing:.12em;font-size:10px;font-weight:800}.prototype-note span{width:6px;height:6px;background:#fff;border-radius:50%;animation:pulse 1.8s infinite}.site-header{height:82px;padding:0 clamp(24px,5vw,84px);display:flex;align-items:center;justify-content:space-between;position:absolute;top:28px;left:0;right:0;z-index:20;color:#fff;border-bottom:1px solid rgba(255,255,255,.18)}.brand{display:flex;align-items:center;gap:13px}.brand-mark{width:43px;height:43px;border-radius:50%;display:grid;place-items:center;border:1px solid currentColor;font-family:Prata,serif;font-size:12px;letter-spacing:.04em}.brand-copy{display:flex;flex-direction:column;line-height:1.15}.brand-copy b{font-size:16px}.brand-copy small{text-transform:uppercase;letter-spacing:.14em;font-size:8px;opacity:.7;margin-top:4px}.nav{display:flex;gap:clamp(18px,2.4vw,38px)}.nav a{font-size:13px;font-weight:600;position:relative}.nav a:after{content:"";position:absolute;left:0;right:100%;bottom:-9px;height:1px;background:#fff;transition:.3s}.nav a:hover:after{right:0}.header-actions{display:flex;align-items:center;gap:19px}.phone{font-weight:700;font-size:13px}.button{border:0;border-radius:100px;padding:16px 24px;display:inline-flex;align-items:center;justify-content:center;gap:18px;font-weight:700;cursor:pointer;transition:transform .25s,box-shadow .25s,background .25s}.button:hover{transform:translateY(-2px)}.button-small{padding:12px 18px;font-size:12px}.button-dark{background:var(--ink);color:#fff}.site-header .button-dark{background:#fff;color:var(--ink)}.menu-toggle{display:none;background:transparent;border:0;width:42px;height:42px;padding:10px}.menu-toggle i{display:block;height:1px;background:currentColor;margin:7px 0}.hero{height:min(770px,88vh);min-height:660px;position:relative;color:#fff;overflow:hidden;background:#0b3a3d}.hero-media{position:absolute;inset:0}.hero-media img{animation:heroZoom 18s ease-in-out infinite alternate}.hero-gradient{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,36,39,.95) 0%,rgba(5,36,39,.72) 42%,rgba(5,36,39,.13) 72%),linear-gradient(0deg,rgba(5,36,39,.55),transparent 45%)}.hero-content{position:relative;z-index:2;padding:180px clamp(24px,7vw,110px) 120px;max-width:920px}.eyebrow{display:flex;align-items:center;gap:28px;font-size:11px;text-transform:uppercase;letter-spacing:.14em;font-weight:700}.eyebrow span+span{opacity:.62}.hero h1{font-size:clamp(52px,6.2vw,94px);line-height:1.02;letter-spacing:-.055em;margin:26px 0 24px}.hero h1 em{color:var(--mint)}.hero p{max-width:570px;font-size:18px;line-height:1.7;color:rgba(255,255,255,.78)}.hero-trust{display:flex;align-items:center;gap:16px;margin-top:33px}.avatars{display:flex}.avatars span{width:37px;height:37px;border-radius:50%;background:var(--sand);color:var(--ink);display:grid;place-items:center;border:2px solid var(--ink);margin-left:-8px;font-size:12px;font-weight:800}.avatars span:first-child{margin-left:0}.hero-trust div:last-child{display:flex;flex-direction:column}.hero-trust strong{font-size:13px}.hero-trust small{font-size:11px;opacity:.65;margin-top:3px}.weather-card{position:absolute;right:5.5vw;bottom:120px;z-index:3;display:flex;gap:13px;align-items:center;padding:15px 18px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);border-radius:14px;backdrop-filter:blur(14px)}.weather-icon{font-size:26px;color:#ffd65c}.weather-card div{display:flex;flex-direction:column}.weather-card small{font-size:10px;text-transform:uppercase;letter-spacing:.1em;opacity:.65}.weather-card strong{font-size:13px;margin-top:4px}.scroll-cue{position:absolute;right:5.5vw;bottom:32px;z-index:3;display:flex;align-items:center;gap:14px;font-size:11px;text-transform:uppercase;letter-spacing:.14em}.scroll-cue i{font-style:normal;border:1px solid rgba(255,255,255,.4);height:42px;width:42px;border-radius:50%;display:grid;place-items:center}.search-wrap{position:relative;z-index:4;margin-top:-74px;padding:0 clamp(20px,5vw,80px)}.search-card{max-width:1400px;margin:auto;background:#fff;border-radius:22px;padding:30px 34px 20px;box-shadow:var(--shadow)}.search-topline{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px}.section-kicker{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.16em;font-weight:800;color:var(--coral);margin-bottom:10px}.section-kicker.light{color:var(--mint)}.search-card h2{margin:0;font-size:30px;letter-spacing:-.04em}.ai-inline{border:0;background:#eef8f5;border-radius:14px;padding:10px 14px;display:flex;align-items:center;gap:12px;color:var(--ink);cursor:pointer;text-align:left}.spark{width:34px;height:34px;border-radius:50%;background:var(--ink);color:var(--mint);display:grid;place-items:center}.ai-inline span:nth-child(2){display:flex;flex-direction:column}.ai-inline b{font-size:12px}.ai-inline small{font-size:10px;opacity:.6;margin-top:2px}.ai-inline i{font-style:normal;margin-left:7px}.search-form{display:grid;grid-template-columns:1.15fr 1.1fr 1fr .85fr 1.15fr auto;border:1px solid var(--line);border-radius:14px;overflow:hidden}.search-form label{padding:12px 16px;border-right:1px solid var(--line);display:flex;flex-direction:column;min-width:0}.search-form label span,.quick-form label span,.modal label span{font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:800}.search-form select,.search-form input{border:0;background:transparent;color:var(--ink);font-weight:700;margin-top:5px;outline:none;min-width:0;width:100%;font-size:13px}.button-search{border-radius:0;background:var(--coral);color:#fff;padding:0 24px}.search-foot{display:flex;justify-content:space-between;margin-top:14px;color:var(--muted);font-size:10px}.search-foot span{display:flex;align-items:center;gap:7px}.search-foot i{width:7px;height:7px;border-radius:50%;background:#2bb673;box-shadow:0 0 0 4px rgba(43,182,115,.1)}.section-pad{padding-left:clamp(24px,7vw,110px);padding-right:clamp(24px,7vw,110px)}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;max-width:1400px;margin:80px auto 100px}.stats div{display:flex;align-items:center;gap:18px;padding-left:30px;border-left:1px solid var(--line)}.stats strong{font-family:Prata,serif;font-size:35px;font-weight:400}.stats span{font-size:11px;line-height:1.5;color:var(--muted)}.offers{max-width:1600px;margin:auto;padding-bottom:120px}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:42px}.section-head h2,.about-intro h2,.review-copy h2,.ai-copy h2{font-size:clamp(37px,4.3vw,64px);line-height:1.08;letter-spacing:-.05em;margin:0}.section-head h2 em,.about-intro h2 em,.review-copy h2 em{color:var(--coral)}.section-actions{display:flex;gap:8px}.round-arrow{width:48px;height:48px;border:1px solid var(--line);background:transparent;border-radius:50%;cursor:pointer;color:var(--ink);font-size:18px;transition:.2s}.round-arrow:hover{background:var(--ink);color:#fff}.offer-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.tour-card{background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 12px 38px rgba(9,47,51,.07);transition:.35s}.tour-card:hover{transform:translateY(-7px);box-shadow:0 24px 55px rgba(9,47,51,.13)}.tour-image{height:258px;position:relative;overflow:hidden}.tour-image img{transition:.6s}.tour-card:hover .tour-image img{transform:scale(1.045)}.tag{position:absolute;left:15px;top:15px;padding:8px 11px;border-radius:100px;font-size:9px;text-transform:uppercase;letter-spacing:.1em;font-weight:800}.tag.hot{background:var(--coral);color:#fff}.tag.family{background:var(--mint)}.tag.cruise{background:#fff}.heart{position:absolute;right:15px;top:15px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.9);font-size:21px;color:var(--ink);cursor:pointer;display:grid;place-items:center}.heart.saved{background:var(--coral);color:#fff}.tour-body{padding:21px}.tour-meta,.tour-details{display:flex;justify-content:space-between;gap:10px;font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.tour-body h3{font-size:20px;line-height:1.3;margin:10px 0}.rating{display:flex;align-items:center;gap:9px}.rating b{background:var(--ink);color:#fff;border-radius:6px;padding:5px 7px;font-size:10px}.rating span{font-size:11px;color:var(--muted)}.tour-details{padding:17px 0;border-bottom:1px solid var(--line);margin-top:12px;text-transform:none;letter-spacing:0}.tour-price{display:flex;align-items:end;justify-content:space-between;padding-top:17px}.tour-price>div{display:flex;flex-direction:column}.tour-price small{font-size:10px;color:var(--muted)}.tour-price strong{font-size:20px;margin-top:3px}.button-outline{padding:10px 14px;border:1px solid var(--line);background:transparent;color:var(--ink);font-size:10px}.demo-caption{margin:18px 0 0;color:var(--muted);font-size:10px;text-align:right}.ai-section{min-height:700px;background:var(--ink);color:#fff;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:8vw;overflow:hidden}.ai-visual{height:580px;position:relative;display:grid;place-items:center}.ai-orb{width:260px;height:260px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 35% 28%,#6ad7c2 0%,#207a78 42%,#0b4145 75%);box-shadow:0 0 90px rgba(85,212,190,.27);z-index:2}.ai-orb>span{font-size:33px;color:#c8fff3}.ai-orb b{font-family:Prata,serif;font-size:36px;margin:8px 0}.ai-orb small{color:rgba(255,255,255,.65);line-height:1.5}.orbit{position:absolute;border:1px solid rgba(184,231,220,.17);border-radius:50%}.orbit-one{width:410px;height:410px;animation:spin 22s linear infinite}.orbit-two{width:540px;height:540px;animation:spin 35s linear reverse infinite}.orbit:after{content:"✦";position:absolute;top:50%;left:-8px;color:var(--mint);font-size:14px}.floating-chip{position:absolute;z-index:3;padding:11px 15px;border-radius:100px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(10px);font-size:11px}.chip-one{top:90px;right:13%}.chip-two{bottom:90px;left:10%}.chip-three{bottom:150px;right:5%}.ai-copy{padding:80px 0;max-width:610px}.ai-copy h2 em{color:var(--mint)}.ai-copy>p{color:rgba(255,255,255,.66);font-size:16px;line-height:1.8;max-width:570px;margin:25px 0}.ai-prompts{display:flex;flex-wrap:wrap;gap:8px;margin:25px 0}.prompt-chip{border:1px solid rgba(255,255,255,.17);background:transparent;color:#fff;border-radius:100px;padding:10px 13px;font-size:10px;cursor:pointer}.prompt-chip:hover{background:rgba(255,255,255,.1)}.button-coral{background:var(--coral);color:#fff;box-shadow:0 12px 28px rgba(255,111,77,.23)}.ai-human{display:block;color:rgba(255,255,255,.4);font-size:10px;margin-top:13px}.directions{padding-top:120px;padding-bottom:120px}.mood-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.mood-card{min-height:270px;border:0;border-right:1px solid var(--line);background:transparent;color:var(--ink);padding:28px;text-align:left;display:flex;flex-direction:column;cursor:pointer;transition:.3s}.mood-card:last-child{border-right:0}.mood-card>span{font-size:10px;color:var(--muted)}.mood-card b{font-family:Prata,serif;font-size:27px;margin-top:auto}.mood-card small{font-size:11px;color:var(--muted);line-height:1.5;margin-top:10px}.mood-card i{align-self:flex-end;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-style:normal;margin-top:20px}.mood-card:hover,.mood-card.active{background:var(--mint)}.mood-card.active i{background:var(--ink);color:#fff}.about{background:var(--sand);padding-top:120px;padding-bottom:120px}.about-intro{margin-bottom:50px}.about-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px}.about-grid article{border-radius:20px;padding:35px}.about-main{background:var(--ink);color:#fff;min-height:410px;display:flex;flex-direction:column}.big-number{font-family:Prata,serif;font-size:76px;color:var(--mint)}.about-main h3{font-size:24px;max-width:380px;margin:auto 0 12px}.about-main p{font-size:13px;line-height:1.7;color:rgba(255,255,255,.63);max-width:470px}.text-link{border:0;background:transparent;color:var(--mint);padding:15px 0 0;text-align:left;font-weight:700;cursor:pointer}.text-link i{font-style:normal;margin-left:8px}.benefit{background:#fff;min-height:410px;display:flex;flex-direction:column}.benefit-icon{width:48px;height:48px;border-radius:50%;background:var(--sand);display:grid;place-items:center;font-size:21px}.benefit h3{font-family:Prata,serif;font-weight:400;font-size:27px;margin:auto 0 14px}.benefit p{font-size:13px;color:var(--muted);line-height:1.7}.reviews{display:grid;grid-template-columns:1.05fr 1fr;gap:9vw;align-items:center;padding-top:130px;padding-bottom:130px}.review-card{background:var(--mint);padding:42px;border-radius:22px}.quote-mark{font-family:Prata,serif;font-size:82px;line-height:.65;color:var(--ink)}blockquote{font-family:Prata,serif;font-size:25px;line-height:1.55;margin:25px 0 35px}.review-author{border-top:1px solid rgba(9,47,51,.18);padding-top:22px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:13px}.review-author>span{width:40px;height:40px;background:var(--ink);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:11px}.review-author div{display:flex;flex-direction:column}.review-author b{font-size:12px}.review-author small{font-size:10px;color:var(--muted);margin-top:3px}.review-author strong{font-size:12px}.review-copy p{line-height:1.8;color:var(--muted);margin:25px 0 30px}.lead-section{background:var(--ink);color:#fff;min-height:560px;display:grid;grid-template-columns:1.4fr 1fr;gap:8vw;align-items:center;padding-top:90px;padding-bottom:90px}.lead-inner h2{font-size:clamp(42px,5vw,72px);line-height:1.05;letter-spacing:-.05em;margin:0}.lead-inner h2 em{color:var(--mint)}.lead-inner>p{color:rgba(255,255,255,.62);line-height:1.7;max-width:630px}.quick-form{display:grid;grid-template-columns:1fr 1fr auto;gap:9px;margin-top:28px}.quick-form label{background:#fff;border-radius:12px;padding:11px 14px;display:flex;flex-direction:column}.quick-form input{border:0;outline:0;padding:6px 0 0;color:var(--ink);font-weight:700}.lead-inner>small{display:block;margin-top:13px;color:rgba(255,255,255,.35);font-size:9px}.telegram-flow{background:#fff;color:var(--ink);border-radius:20px;padding:25px;box-shadow:0 30px 80px rgba(0,0,0,.22);position:relative;transform:rotate(1.5deg)}.tg-head{display:flex;gap:12px;align-items:center;border-bottom:1px solid var(--line);padding-bottom:17px}.tg-logo{width:40px;height:40px;border-radius:50%;background:#2aabee;color:#fff;display:grid;place-items:center}.tg-head div{display:flex;flex-direction:column}.tg-head b{font-size:12px}.tg-head small{font-size:9px;color:var(--muted);margin-top:4px}.telegram-flow dl{margin:15px 0}.telegram-flow dl div{display:grid;grid-template-columns:90px 1fr;padding:8px 0}.telegram-flow dt{font-size:9px;color:var(--muted)}.telegram-flow dd{margin:0;font-size:11px;font-weight:700}.tg-actions{display:flex;gap:7px}.tg-actions button{flex:1;border:0;border-radius:8px;padding:10px;background:#2aabee;color:#fff;font-size:10px;font-weight:700}.tg-actions button+button{background:#edf8fd;color:#2586b9}.flow-label{position:absolute;right:-12px;top:-35px;background:var(--coral);color:#fff;padding:9px 12px;border-radius:9px;font-size:9px;font-weight:800;transform:rotate(-1.5deg)}footer{background:#062629;color:#fff;padding:60px clamp(24px,7vw,110px) 25px}.footer-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.12)}.footer-cta{display:flex;gap:18px;align-items:center}.footer-cta span{font-family:Prata,serif;font-size:22px}.footer-grid{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:40px;padding:45px 0}.footer-grid>div{display:flex;flex-direction:column;gap:11px}.footer-grid span{font-size:9px;color:var(--mint);text-transform:uppercase;letter-spacing:.14em;font-weight:800;margin-bottom:5px}.footer-grid a,.footer-grid p{font-size:12px;color:rgba(255,255,255,.65);line-height:1.6;margin:0}.footer-bottom{display:flex;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(255,255,255,.12);font-size:9px;color:rgba(255,255,255,.35)}.ai-fab{position:fixed;right:24px;bottom:22px;z-index:30;border:0;border-radius:100px;background:var(--coral);color:#fff;padding:10px 18px 10px 10px;display:flex;align-items:center;gap:10px;box-shadow:0 14px 35px rgba(255,111,77,.34);cursor:pointer}.ai-fab>span{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center}.ai-fab div{display:flex;flex-direction:column;text-align:left}.ai-fab b{font-size:11px}.ai-fab small{font-size:9px;opacity:.7;margin-top:2px}.ai-drawer{position:fixed;right:18px;bottom:18px;width:min(410px,calc(100vw - 24px));height:min(680px,calc(100vh - 36px));background:#fff;z-index:60;border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.3);display:flex;flex-direction:column;transform:translateX(calc(100% + 40px));opacity:0;transition:.35s;overflow:hidden}.ai-drawer.open{transform:none;opacity:1}.drawer-backdrop{position:fixed;inset:0;background:rgba(4,31,33,.38);backdrop-filter:blur(3px);z-index:50;opacity:0;pointer-events:none;transition:.3s}.drawer-backdrop.open{opacity:1;pointer-events:auto}.ai-drawer-head{background:var(--ink);color:#fff;padding:18px;display:flex;justify-content:space-between;align-items:center}.ai-drawer-head>div{display:flex;align-items:center;gap:11px}.ai-avatar{width:39px;height:39px;border-radius:50%;background:var(--mint);color:var(--ink);display:grid;place-items:center}.ai-drawer-head div div{display:flex;flex-direction:column}.ai-drawer-head b{font-size:12px}.ai-drawer-head small{font-size:9px;color:rgba(255,255,255,.5);margin-top:4px}.ai-drawer-head small i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#43d184}.ai-drawer-head>button{background:transparent;color:#fff;border:0;font-size:26px;cursor:pointer}.chat-body{flex:1;padding:18px;overflow-y:auto;background:#f4f5f2}.chat-message{display:flex;flex-direction:column;max-width:84%;margin-bottom:12px}.chat-message > .chat-bubble, .chat-message > span:first-child{padding:12px 14px;border-radius:14px 14px 14px 4px;background:#fff;font-size:12px;line-height:1.55;box-shadow:0 4px 15px rgba(9,47,51,.05)}.chat-message small{font-size:8px;color:var(--muted);margin-top:4px}.chat-message.user{margin-left:auto;align-items:flex-end}.chat-message.user > .chat-bubble, .chat-message.user > span:first-child{background:var(--ink);color:#fff;border-radius:14px 14px 4px 14px}.quick-replies{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 18px}.quick-replies button{border:1px solid var(--line);background:#fff;border-radius:100px;padding:8px 10px;font-size:9px;color:var(--ink);cursor:pointer}.chat-input{padding:12px;display:flex;gap:8px;border-top:1px solid var(--line)}.chat-input textarea{flex:1;border:0;resize:none;outline:0;padding:9px;font-size:12px}.chat-input button{width:38px;height:38px;border:0;border-radius:50%;background:var(--coral);color:#fff;font-size:18px;cursor:pointer}.chat-note{text-align:center;background:#fff;padding:0 10px 10px;font-size:8px;color:var(--muted)}.modal{position:fixed;inset:0;z-index:80;display:grid;place-items:center;opacity:0;pointer-events:none;transition:.3s}.modal.open{opacity:1;pointer-events:auto}.modal-backdrop{position:absolute;inset:0;background:rgba(4,31,33,.58);backdrop-filter:blur(6px)}.modal-panel{position:relative;background:#fff;border-radius:22px;width:min(520px,calc(100vw - 32px));padding:38px;box-shadow:0 30px 100px rgba(0,0,0,.25);transform:translateY(20px);transition:.3s}.modal.open .modal-panel{transform:none}.modal-close{position:absolute;right:16px;top:15px;border:0;background:var(--sand);width:34px;height:34px;border-radius:50%;font-size:22px;cursor:pointer}.modal-content h2{font-size:34px;line-height:1.15;letter-spacing:-.04em;margin:8px 0 12px}.modal-content>p{color:var(--muted);font-size:13px;line-height:1.6}.modal form{display:grid;gap:10px;margin-top:22px}.modal label{border:1px solid var(--line);border-radius:11px;padding:10px 13px;display:flex;flex-direction:column}.modal input,.modal select{border:0;outline:0;padding-top:6px;font-weight:700;color:var(--ink);background:#fff}.modal form small{text-align:center;color:var(--muted);font-size:8px}.success-state{text-align:center;padding:20px 0}.success-icon{width:70px;height:70px;border-radius:50%;background:var(--mint);display:grid;place-items:center;font-size:28px;margin:0 auto 20px}.success-state h2{font-size:32px}.success-state p{color:var(--muted);line-height:1.6}.success-state .bot-route{margin:22px 0;background:#f0f8f6;padding:14px;border-radius:12px;font-size:11px}.toast{position:fixed;left:24px;bottom:24px;z-index:100;background:var(--ink);color:#fff;padding:14px 20px;border-radius:12px;display:flex;flex-direction:column;transform:translateY(100px);opacity:0;transition:.3s}.toast.show{transform:none;opacity:1}.toast b{font-size:11px}.toast span{font-size:9px;opacity:.6;margin-top:3px}.search-results-banner{grid-column:1/-1;background:#eaf8f4;border-radius:12px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-top:2px}.search-results-banner b{color:var(--ink)}.search-results-banner span{color:var(--muted);font-size:10px}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .75s ease,transform .75s ease}.reveal.visible{opacity:1;transform:none}.delay-1{transition-delay:.1s}.delay-2{transition-delay:.2s}@keyframes pulse{50%{opacity:.3;transform:scale(.7)}}@keyframes heroZoom{from{transform:scale(1.02)}to{transform:scale(1.09)}}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:1100px){.nav{display:none}.nav.open{display:flex;position:absolute;top:82px;left:0;right:0;background:var(--ink);padding:24px;flex-direction:column}.menu-toggle{display:block;color:#fff}.header-actions .button{display:none}.search-form{grid-template-columns:repeat(3,1fr)}.search-form label{border-bottom:1px solid var(--line)}.button-search{min-height:62px}.offer-grid{grid-template-columns:repeat(3,360px);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:15px}.tour-card{scroll-snap-align:start}.about-grid{grid-template-columns:1fr 1fr}.about-main{grid-column:1/-1}.quick-form{grid-template-columns:1fr 1fr}.quick-form button{grid-column:1/-1}.mood-grid{grid-template-columns:1fr 1fr}.mood-card:nth-child(2){border-right:0}.mood-card:nth-child(-n+2){border-bottom:1px solid var(--line)}}
@media(max-width:760px){.prototype-note{height:24px}.site-header{top:24px;height:70px;padding:0 20px}.brand-copy b{font-size:13px}.brand-mark{width:38px;height:38px}.phone{display:none}.hero{height:700px;min-height:700px}.hero-gradient{background:linear-gradient(0deg,rgba(5,36,39,.94) 0%,rgba(5,36,39,.42) 70%),linear-gradient(90deg,rgba(5,36,39,.55),transparent)}.hero-content{padding:145px 22px 120px}.hero h1{font-size:49px;margin-top:22px}.hero p{font-size:15px}.eyebrow{font-size:9px}.weather-card{right:20px;bottom:93px}.scroll-cue{display:none}.search-wrap{margin-top:-40px;padding:0 14px}.search-card{padding:23px 16px 16px}.search-topline{align-items:flex-start}.search-card h2{font-size:25px}.ai-inline{width:45px;height:45px;padding:5px}.ai-inline span:nth-child(2),.ai-inline i{display:none}.search-form{grid-template-columns:1fr 1fr}.search-form label{min-height:62px}.button-search{grid-column:1/-1;min-height:56px}.search-foot{display:block;line-height:1.5}.search-foot small{display:block;margin-top:7px}.stats{grid-template-columns:1fr 1fr;margin:55px auto 80px;gap:25px 8px}.stats div{padding-left:14px;gap:10px}.stats strong{font-size:28px}.stats span{font-size:9px}.section-pad{padding-left:20px;padding-right:20px}.offers{padding-bottom:85px}.section-head{align-items:flex-end}.section-head h2,.about-intro h2,.review-copy h2,.ai-copy h2{font-size:37px}.offer-grid{grid-template-columns:repeat(3,84vw)}.tour-image{height:220px}.section-actions{display:none}.demo-caption{text-align:left}.ai-section{grid-template-columns:1fr;padding-top:60px;padding-bottom:80px}.ai-visual{height:420px;order:2}.ai-copy{padding:0}.ai-orb{width:210px;height:210px}.orbit-one{width:310px;height:310px}.orbit-two{width:390px;height:390px}.chip-one{right:0}.chip-three{right:0}.directions{padding-top:85px;padding-bottom:85px}.mood-grid{grid-template-columns:1fr}.mood-card{min-height:180px;border-right:0;border-bottom:1px solid var(--line)!important}.mood-card:last-child{border-bottom:0!important}.about{padding-top:85px;padding-bottom:85px}.about-grid{grid-template-columns:1fr}.about-main{grid-column:auto}.about-grid article{min-height:330px}.reviews{grid-template-columns:1fr;padding-top:85px;padding-bottom:85px}.review-card{padding:27px}.review-copy{order:-1}blockquote{font-size:20px}.lead-section{grid-template-columns:1fr;padding-top:80px;padding-bottom:80px}.lead-inner h2{font-size:44px}.quick-form{grid-template-columns:1fr}.quick-form button{grid-column:auto}.telegram-flow{margin-top:30px;transform:none}.flow-label{right:8px;transform:none}.footer-top{align-items:flex-start}.footer-cta{display:none}.footer-grid{grid-template-columns:1fr 1fr}.footer-bottom{display:block;line-height:1.7}.ai-fab{right:12px;bottom:12px}.ai-fab div{display:none}.ai-fab{padding:8px}.ai-drawer{right:12px;bottom:12px}.modal-panel{padding:30px 22px}.modal-content h2{font-size:29px}}
.live-search{max-width:1600px;margin:70px auto 110px;scroll-margin-top:25px}.live-search[hidden]{display:none}.live-search-head{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-bottom:26px}.live-search-head h2{font-size:clamp(34px,4vw,56px);letter-spacing:-.05em;margin:0}.live-search-head p{max-width:720px;color:var(--muted);line-height:1.7;font-size:14px;margin:15px 0 0}.live-search-head .button{flex:none}.live-search-frame{position:relative;background:#fff;border-radius:22px;overflow:hidden;box-shadow:var(--shadow);min-height:850px;border:1px solid var(--line)}.live-search-frame iframe{display:block;width:100%;height:980px;border:0;background:#fff}.live-search-loader{position:absolute;inset:0;z-index:1;background:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;transition:.25s}.live-search-loader.hidden{opacity:0;pointer-events:none}.live-search-loader span{width:42px;height:42px;border:3px solid var(--line);border-top-color:var(--coral);border-radius:50%;animation:spin 1s linear infinite}.live-search-loader b{font-size:14px}.live-search-loader small,.live-search-note{font-size:10px;color:var(--muted)}.live-search-note{text-align:center;margin:14px 0 0}@media(max-width:760px){.live-search{margin-top:50px;margin-bottom:80px}.live-search-head{align-items:flex-start;flex-direction:column;gap:20px}.live-search-head .button{width:100%}.live-search-frame{min-height:720px;border-radius:16px}.live-search-frame iframe{height:850px}.live-search-note{text-align:left}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
.hero p{max-width:650px;font-size:17px;line-height:1.65;color:var(--ink);background:rgba(255,255,255,.96);padding:17px 22px;margin:20px 0 0;border-radius:16px;box-shadow:0 16px 45px rgba(3,31,34,.18);backdrop-filter:blur(8px)}
@media(max-width:760px){.hero p{font-size:14px;line-height:1.6;padding:14px 16px;border-radius:13px;margin-top:16px}}
.live-search-redirect{min-height:190px;background:var(--ink);color:#fff;border-radius:22px;padding:34px 38px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;box-shadow:var(--shadow)}.live-search-icon{width:62px;height:62px;border-radius:50%;background:var(--mint);color:var(--ink);display:grid;place-items:center;font-size:25px}.live-search-redirect b{font-family:Prata,serif;font-size:24px;font-weight:400}.live-search-redirect p{max-width:720px;margin:9px 0 0;color:rgba(255,255,255,.62);font-size:13px;line-height:1.65}@media(max-width:760px){.live-search-redirect{grid-template-columns:1fr;padding:27px 22px}.live-search-icon{width:50px;height:50px}.live-search-redirect b{font-size:21px}.live-search-redirect .button{width:100%}}
.search-wrap{margin-top:0;padding-top:28px}.hero-content{padding-bottom:56px}@media(max-width:760px){.search-wrap{margin-top:0;padding-top:18px}.hero-content{padding-bottom:44px}}
.stats strong{white-space:nowrap}
.chat-message.thinking > .chat-bubble, .chat-message.thinking > span:first-child{color:var(--muted);font-style:italic}.chat-message.thinking > .chat-bubble:after, .chat-message.thinking > span:first-child:after{content:'…';display:inline-block;width:1.2em;overflow:hidden;vertical-align:bottom;animation:thinkingDots 1.2s steps(4,end) infinite}@keyframes thinkingDots{0%{width:0}100%{width:1.2em}}


/* ===================================================
   PROFESSIONAL TOUR PROPOSALS & INTERACTIVE MODAL
   =================================================== */
.chat-body .chat-message.bot { max-width: 96%; }
.tour-proposals-wrap { display: flex; flex-direction: column; gap: 14px; margin: 12px 0 6px; }
.tour-card-mini { background: #ffffff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(9, 47, 51, 0.08); transition: transform 0.25s, box-shadow 0.25s; }
.tour-card-mini:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(9, 47, 51, 0.14); }
.tour-card-mini-img { position: relative; height: 145px; background: var(--ink); overflow: hidden; }
.tour-card-mini-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.tour-card-mini:hover .tour-card-mini-img img { transform: scale(1.05); }
.tour-card-mini-tags { position: absolute; top: 10px; left: 10px; right: 10px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; }
.mini-badge { padding: 4px 9px; border-radius: 100px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; backdrop-filter: blur(8px); }
.mini-badge-stars { background: rgba(9, 47, 51, 0.85); color: #ffd65c; }
.mini-badge-hot { background: var(--coral); color: #fff; }
.tour-card-mini-content { padding: 14px 16px 16px; color: var(--ink); }
.tour-card-mini-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
.tour-card-mini-title { font-size: 15px; font-weight: 800; line-height: 1.3; margin: 0; color: var(--ink); }
.tour-card-mini-rating { flex-shrink: 0; background: #eef8f5; color: var(--ink); padding: 3px 7px; border-radius: 6px; font-size: 10px; font-weight: 800; display: flex; align-items: center; gap: 3px; }
.tour-card-mini-rating i { color: #f59e0b; font-style: normal; }
.tour-card-mini-resort { font-size: 11px; color: var(--muted); margin-bottom: 10px; display: flex; align-items: center; gap: 5px; }
.tour-card-mini-specs { display: grid; gap: 6px; font-size: 11px; background: var(--cream); padding: 10px 12px; border-radius: 10px; margin-bottom: 12px; }
.tour-card-mini-specs div { display: flex; align-items: center; gap: 7px; line-height: 1.35; }
.tour-card-mini-specs div span:first-child { font-size: 12px; width: 16px; text-align: center; flex-shrink: 0; }
.tour-card-mini-specs div span:last-child { color: var(--ink); font-weight: 600; }
.tour-card-mini-perk { font-size: 11px; color: #156247; background: rgba(184, 231, 220, 0.4); padding: 6px 10px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; font-weight: 600; }
.tour-card-mini-bottom { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px; border-top: 1px solid var(--line); margin-bottom: 12px; }
.mini-price-box { display: flex; flex-direction: column; }
.mini-price-box small { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
.mini-price-box strong { font-size: 18px; font-weight: 800; color: var(--ink); line-height: 1.1; margin-top: 2px; }
.mini-price-box .old-price { font-size: 11px; text-decoration: line-through; color: var(--muted); margin-left: 5px; font-weight: 400; }
.mini-price-box .per-person { font-size: 10px; color: var(--muted); margin-top: 2px; }
.tour-card-mini-actions { display: grid; grid-template-columns: 1.4fr 1fr; gap: 8px; }
.btn-mini-detail { background: var(--ink); color: #fff; border: 0; border-radius: 9px; padding: 10px 12px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s, transform 0.2s; }
.btn-mini-detail:hover { background: var(--coral); transform: translateY(-1px); }
.btn-mini-book { background: var(--coral); color: #fff; border: 0; border-radius: 9px; padding: 10px 12px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: background 0.2s, transform 0.2s; }
.btn-mini-book:hover { background: #e85532; transform: translateY(-1px); }

/* Tour Detail Big Modal */
.tour-modal-panel { position: relative; background: #fff; border-radius: 26px; width: min(880px, calc(100vw - 32px)); max-height: 92vh; overflow-y: auto; box-shadow: 0 35px 110px rgba(0, 0, 0, 0.35); transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; }
.modal.open .tour-modal-panel { transform: none; }
.tour-detail-head { padding: 28px 32px 18px; border-bottom: 1px solid var(--line); position: relative; background: #fff; }
.tour-detail-breadcrumbs { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 800; color: var(--coral); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.tour-detail-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.tour-detail-title-row h2 { font-size: clamp(24px, 3.2vw, 32px); font-weight: 800; letter-spacing: -0.03em; margin: 0; color: var(--ink); }
.tour-detail-rating-tag { background: #eef8f5; border: 1px solid rgba(43, 182, 115, 0.2); padding: 6px 12px; border-radius: 10px; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.tour-detail-rating-tag b { font-size: 14px; color: var(--ink); }
.tour-detail-rating-tag span { font-size: 11px; color: var(--muted); }
.tour-detail-meta-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.tour-meta-pill { font-size: 11px; font-weight: 600; padding: 5px 11px; background: var(--cream); border: 1px solid var(--line); border-radius: 100px; color: var(--ink); display: inline-flex; align-items: center; gap: 6px; }
.tour-detail-gallery { padding: 20px 32px; display: grid; grid-template-columns: 2.3fr 1fr; gap: 14px; background: var(--cream); border-bottom: 1px solid var(--line); }
.gallery-hero { position: relative; height: 320px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(9, 47, 51, 0.1); background: var(--ink); }
.gallery-hero img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease; }
.gallery-hero-badge { position: absolute; bottom: 14px; left: 14px; background: rgba(9, 47, 51, 0.85); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; backdrop-filter: blur(6px); }
.gallery-thumbs-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px; }
.gallery-thumb-item { position: relative; height: 98px; border-radius: 12px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: transform 0.2s, border-color 0.2s, opacity 0.2s; background: var(--ink); }
.gallery-thumb-item:hover { transform: scale(1.03); }
.gallery-thumb-item.active { border-color: var(--coral); box-shadow: 0 4px 14px rgba(255, 111, 77, 0.4); }
.gallery-thumb-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-thumb-label { position: absolute; bottom: 4px; left: 6px; right: 6px; font-size: 9px; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tour-detail-tabs-nav { display: flex; gap: 4px; padding: 0 32px; border-bottom: 1px solid var(--line); background: #fff; overflow-x: auto; }
.tour-tab-trigger { background: transparent; border: 0; padding: 16px 18px; font-size: 13px; font-weight: 700; color: var(--muted); border-bottom: 3px solid transparent; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; transition: color 0.2s, border-color 0.2s; }
.tour-tab-trigger:hover { color: var(--ink); }
.tour-tab-trigger.active { color: var(--ink); border-bottom-color: var(--coral); }
.tour-detail-tab-pane { display: none; padding: 26px 32px 36px; }
.tour-detail-tab-pane.active { display: block; }
.flight-card-wrap { display: flex; flex-direction: column; gap: 14px; }
.flight-segment-card { background: var(--cream); border: 1px solid var(--line); border-radius: 16px; padding: 18px 22px; }
.flight-card-header { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--coral); margin-bottom: 14px; }
.flight-airline-badge { color: var(--ink); background: #fff; padding: 4px 10px; border-radius: 100px; border: 1px solid var(--line); font-size: 11px; }
.flight-route-display { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; margin-bottom: 14px; }
.airport-col strong { display: block; font-size: 20px; font-weight: 800; color: var(--ink); }
.airport-col span { font-size: 12px; color: var(--muted); }
.airport-col time { display: block; font-size: 15px; font-weight: 700; color: var(--coral); margin-top: 2px; }
.flight-route-middle { display: flex; flex-direction: column; align-items: center; min-width: 140px; }
.flight-route-middle span { font-size: 11px; font-weight: 700; color: var(--muted); margin-bottom: 4px; }
.flight-line-indicator { position: relative; width: 100%; height: 2px; background: rgba(9, 47, 51, 0.18); margin: 6px 0; }
.flight-plane-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--cream); padding: 0 6px; font-size: 13px; color: var(--coral); }
.flight-amenities-row { display: flex; flex-wrap: wrap; gap: 10px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 11px; color: var(--ink); }
.flight-amenity-item { display: flex; align-items: center; gap: 6px; background: #fff; padding: 5px 10px; border-radius: 8px; border: 1px solid var(--line); }
.transfer-info-box { background: #eaf8f4; border: 1px solid rgba(43, 182, 115, 0.25); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; }
.transfer-icon { width: 44px; height: 44px; border-radius: 50%; background: #2bb673; color: #fff; display: grid; place-items: center; font-size: 20px; flex-shrink: 0; }
.transfer-text b { display: block; font-size: 13px; color: var(--ink); margin-bottom: 3px; }
.transfer-text p { margin: 0; font-size: 12px; color: var(--muted); }
.hotel-specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.spec-box { background: var(--cream); border: 1px solid var(--line); border-radius: 14px; padding: 18px; }
.spec-box-icon { font-size: 22px; margin-bottom: 8px; }
.spec-box h4 { font-size: 14px; font-weight: 800; margin: 0 0 6px; color: var(--ink); }
.spec-box p { margin: 0; font-size: 12px; line-height: 1.6; color: var(--muted); }
.hotel-desc-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 20px; font-size: 13px; line-height: 1.7; color: var(--ink); }
.inclusions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.inclusion-card { display: flex; align-items: flex-start; gap: 12px; background: var(--cream); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
.inclusion-check { width: 24px; height: 24px; border-radius: 50%; background: #2bb673; color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
.inclusion-card-text b { display: block; font-size: 13px; color: var(--ink); margin-bottom: 2px; }
.inclusion-card-text span { font-size: 11px; color: var(--muted); }
.tour-detail-sticky-bar { position: sticky; bottom: 0; background: #fff; border-top: 1px solid var(--line); padding: 18px 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 -10px 30px rgba(9, 47, 51, 0.08); border-radius: 0 0 26px 26px; z-index: 5; }
.tour-detail-price-col { display: flex; flex-direction: column; }
.tour-detail-price-col small { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: var(--muted); }
.tour-detail-price-col strong { font-size: 26px; font-weight: 800; color: var(--ink); line-height: 1.1; margin-top: 2px; }
.tour-detail-price-col strong del { font-size: 14px; color: var(--muted); font-weight: 400; margin-left: 8px; }
.tour-detail-price-col span { font-size: 11px; color: #2bb673; font-weight: 700; margin-top: 2px; }
.tour-detail-actions-group { display: flex; gap: 12px; }
.button-book-large { background: var(--coral); color: #fff; border: 0; border-radius: 100px; padding: 14px 28px; font-size: 14px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(255, 111, 77, 0.35); transition: transform 0.2s, background 0.2s, box-shadow 0.2s; }
.button-book-large:hover { background: #e85532; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(255, 111, 77, 0.45); }
.button-ask-agent { background: var(--cream); color: var(--ink); border: 1px solid var(--line); border-radius: 100px; padding: 14px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.button-ask-agent:hover { background: #eae4d8; }

@media (max-width: 760px) {
  .tour-modal-panel { width: 100vw; height: 100vh; max-height: 100vh; border-radius: 0; }
  .tour-detail-head { padding: 20px 18px 14px; }
  .tour-detail-title-row { flex-direction: column; gap: 8px; }
  .tour-detail-gallery { grid-template-columns: 1fr; padding: 14px 18px; }
  .gallery-hero { height: 220px; }
  .gallery-thumbs-grid { grid-template-columns: repeat(4, 1fr); grid-template-rows: 1fr; gap: 8px; }
  .gallery-thumb-item { height: 60px; }
  .tour-detail-tabs-nav { padding: 0 14px; }
  .tour-tab-trigger { padding: 12px 14px; font-size: 12px; }
  .tour-detail-tab-pane { padding: 20px 18px 30px; }
  .flight-route-display { grid-template-columns: 1fr; gap: 12px; text-align: center; }
  .flight-route-middle { min-width: 100%; }
  .hotel-specs-grid { grid-template-columns: 1fr; }
  .inclusions-grid { grid-template-columns: 1fr; }
  .tour-detail-sticky-bar { flex-direction: column; gap: 12px; padding: 14px 18px; border-radius: 0; }
  .tour-detail-price-col { text-align: center; align-items: center; }
  .tour-detail-actions-group { width: 100%; flex-direction: column; }
  .button-book-large { width: 100%; justify-content: center; }
  .button-ask-agent { width: 100%; justify-content: center; }
  .tour-card-mini-actions { grid-template-columns: 1fr; }
}


/* Fix Nested Elements Inside Tour Cards */
.tour-card-mini span { padding: 0; background: transparent; box-shadow: none; border-radius: 0; }
.mini-badge { padding: 4px 10px !important; border-radius: 100px !important; font-size: 10px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 0.06em !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; box-shadow: none !important; }
.mini-badge-stars { background: rgba(9, 47, 51, 0.9) !important; color: #ffd65c !important; }
.mini-badge-hot { background: var(--coral) !important; color: #ffffff !important; }
.btn-mini-detail { background: var(--ink) !important; color: #ffffff !important; border: 0 !important; border-radius: 10px !important; padding: 11px 14px !important; font-size: 11px !important; font-weight: 700 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; transition: background 0.2s, transform 0.2s !important; text-decoration: none !important; }
.btn-mini-detail span { color: #ffffff !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
.btn-mini-detail:hover { background: var(--coral) !important; transform: translateY(-1px) !important; }
.btn-mini-book { background: var(--coral) !important; color: #ffffff !important; border: 0 !important; border-radius: 10px !important; padding: 11px 16px !important; font-size: 12px !important; font-weight: 800 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; transition: background 0.2s, transform 0.2s !important; }
.btn-mini-book span { color: #ffffff !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
.btn-mini-book:hover { background: #e85532 !important; transform: translateY(-1px) !important; }
.tour-card-mini-specs span { color: inherit !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
.mini-price-box .old-price { font-size: 12px !important; text-decoration: line-through !important; color: var(--muted) !important; margin-left: 6px !important; font-weight: 400 !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; }
.mini-price-box .per-person { font-size: 11px !important; color: var(--muted) !important; margin-top: 2px !important; display: block !important; background: transparent !important; padding: 0 !important; box-shadow: none !important; }

````

### `app.js`

````javascript
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

````

### `api/ai.js`

````javascript
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

````

### `vercel.json`

````json
{
  "functions": {
    "api/ai.js": {
      "maxDuration": 30
    }
  }
}

````

### `.nojekyll`

Пустой файл.
