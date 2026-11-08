/*
 * Работы студии mnd. — каждая работа = одна видеокассета на главной.
 *
 * Как добавить / расписать ролик:
 *   1. Положите видео в public/videos/, обложку (кадр) в public/thumbs/
 *      (обложку можно сделать так: ffmpeg -ss 2 -i video.webm -frames:v 1 -vf scale=720:-2 thumb.jpg)
 *   2. Добавьте объект в массив ниже.
 *   3. Заполните текстовые поля. Пустые поля ('' или []) на сайте просто не показываются.
 *
 * Поля:
 *   id        — уникальный ключ латиницей
 *   title     — название проекта (крупно на кассете и на карточке)
 *   client    — клиент / артист
 *   year      — год
 *   category  — 'Коммерция' | 'Реализм' | 'Мультфильмы' | 'Продукты' (можно добавить свою)
 *   video     — путь к ролику
 *   thumb     — путь к картинке на этикетке кассеты
 *   vertical  — true, если ролик 9:16
 *   about     — общее описание проекта
 *   task      — задача клиента
 *   solution  — что и как сделали
 *   result    — результат (охваты, где показывали и т.п.)
 *   facts     — доп. строки в карточке: [['Сроки', '3 недели'], ['Кадров', '24']]
 *   tags      — теги
 */

export const projects = [
  // ── КОММЕРЦИЯ ──────────────────────────────────────
  {
    id: 'basta',
    title: 'Fresh x Basta',
    client: 'Fresh',
    year: '2025',
    category: 'Коммерция',
    video: '/videos/commercial-basta.webm',
    thumb: '/thumbs/commercial-basta.jpg',
    vertical: true,
    about:
      'Ролик об открытии автосалона Fresh в Ростове-на-Дону и анонсе Басты как официального амбассадора бренда. Кинематографический визуальный язык на стыке ивент-контента и личного бренда.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Авто', 'Ивент', 'Амбассадор'],
  },
  {
    id: 'rolf-banners',
    title: 'Рольф — параллельный импорт',
    client: 'Рольф',
    year: '2025',
    category: 'Коммерция',
    video: '/videos/commercial-rolf-banners.webm',
    thumb: '/thumbs/commercial-rolf-banners.jpg',
    about:
      'Ролик в стиле живописи и реальности: художественное полотно оживает в движении.',
    task: '',
    solution: '',
    result: 'Показан на 10 крупнейших билбордах Москвы.',
    facts: [],
    tags: ['Авто', 'OOH', 'Билборды'],
  },
  {
    id: 'rolf',
    title: 'Рольф × Красная Машина',
    client: 'Рольф',
    year: '2025',
    category: 'Коммерция',
    video: '/videos/commercial-rolf.webm',
    thumb: '/thumbs/commercial-rolf.jpg',
    about:
      'Коллаборация автосалона Рольф со сборной России по хоккею «Красная Машина». Динамика, движение и энергия — в одном кинематографическом ролике.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Авто', 'Спорт', 'Коллаборация'],
  },
  {
    id: 'roman',
    title: 'Мередит',
    client: 'Роман Каграманов',
    year: '2026',
    category: 'Коммерция',
    video: '/videos/commercial-roman.webm',
    thumb: '/thumbs/commercial-roman.jpg',
    about:
      'Визуализация героев книги «Мередит»: они вылетают из печатной машинки как призраки, оживая прямо на глазах.',
    task: '',
    solution: 'ИИ-анимация в сочетании с реальной съёмкой.',
    result: '',
    facts: [],
    tags: ['Личный бренд', 'Книга', 'Live + AI'],
  },
  {
    id: 'ntc',
    title: 'НТЦ',
    client: 'НТЦ',
    year: '2025',
    category: 'Коммерция',
    video: '/videos/commercial-ntc.webm',
    thumb: '/thumbs/commercial-ntc.jpg',
    about:
      'НТЦ — российский разработчик системного программного обеспечения. Ролик подчёркивает технологичность компании.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Технологии', 'B2B'],
  },
  {
    id: 'velos',
    title: 'VELOS',
    client: 'VELOS',
    year: '2025',
    category: 'Коммерция',
    video: '/videos/commercial-velos.webm',
    thumb: '/thumbs/commercial-velos.jpg',
    vertical: true,
    about:
      'Застройщик премиальной недвижимости в Дубае. Видео отражает этапы постройки проекта с нуля.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Недвижимость', 'Дубай'],
  },
  {
    id: 'velos-graphics',
    title: 'VELOS Graphics',
    client: 'VELOS',
    year: '2025',
    category: 'Коммерция',
    video: '/videos/commercial-velos-graphics.webm',
    thumb: '/thumbs/commercial-velos-graphics.jpg',
    about:
      'В рамках полноценного ролика про объект недвижимости был сделан графический элемент постройки здания с нуля.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Моушн', 'Недвижимость'],
  },

  // ── РЕАЛИЗМ ────────────────────────────────────────
  {
    id: 'alien',
    title: 'Alien',
    client: 'Авторский проект mnd.',
    year: '2026',
    category: 'Реализм',
    video: '/videos/realism-alien.webm',
    thumb: '/thumbs/realism-alien.jpg',
    vertical: true,
    about:
      'Необычные цвета, атмосфера и визуальные эффекты делают это видео по-настоящему «инопланетным». Авторская работа — без сценария, только ощущение.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Атмосфера', 'Авторское'],
  },
  {
    id: 'angel',
    title: 'Ангел, возьми мой поцелуй',
    client: 'Музыкальный клип',
    year: '2026',
    category: 'Реализм',
    video: '/videos/realism-angel.webm',
    thumb: '/thumbs/realism-angel.jpg',
    about:
      'Клип о любовной паре: парень — обычный человек, девушка — ангел. Цвет, эффекты и звуковая дорожка создают ощущение другого измерения.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Клип', 'Романтика'],
  },
  {
    id: 'soyuzmultfilm',
    title: 'Юбилей Союзмультфильма',
    client: 'Союзмультфильм',
    year: '2026',
    category: 'Реализм',
    video: '/videos/realism-cooking.webm',
    thumb: '/thumbs/realism-cooking.jpg',
    about:
      'Юбилейный ролик: сочетание реального 3D-мира и двухмерных персонажей легендарной студии. Технически сложная работа, где анимация и реальность существуют в одном пространстве.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['3D + 2D', 'Юбилей'],
  },
  {
    id: 'from',
    title: 'ИЗВНЕ × Агентство Насилия',
    client: 'Агентство Насилия',
    year: '2026',
    category: 'Реализм',
    video: '/videos/realism-from.webm',
    thumb: '/thumbs/realism-from.jpg',
    about:
      'Клип для Агентства Насилия с персонажами сериала «Извне» — синтез двух вселенных. Атмосфера паранойи и тревоги в каждом кадре.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Клип', 'Сериал'],
  },
  {
    id: 'serial',
    title: 'Детективный сериал',
    client: 'Концепт-трейлер',
    year: '2026',
    category: 'Реализм',
    video: '/videos/realism-serial.webm',
    thumb: '/thumbs/realism-serial.jpg',
    vertical: true,
    about:
      'Концептуальный трейлер сериала о загадочных убийствах XIX века и клубе любителей детективов. Тёмная эстетика и ощущение, что история уже началась.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Сериал', 'Детектив'],
  },
  {
    id: 'yandex',
    title: 'Яндекс Лавка',
    client: 'Спек-реклама',
    year: '2026',
    category: 'Реализм',
    video: '/videos/realism-yandex.webm',
    thumb: '/thumbs/realism-yandex.jpg',
    about:
      'Для большого счастья нужно одно маленькое действие. Бытовая история, рассказанная языком кино.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Спек', 'Фудтех'],
  },

  // ── МУЛЬТФИЛЬМЫ ────────────────────────────────────
  {
    id: 'friendly',
    title: 'Friendly Thug × Kizaru',
    client: 'Музыкальный клип',
    year: '2026',
    category: 'Мультфильмы',
    video: '/videos/cartoon-friendly.webm',
    thumb: '/thumbs/cartoon-friendly.jpg',
    about:
      'Клип в стиле хип-хоп анимации. Динамичные приключения героев органично сочетаются с музыкой артистов.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Хип-хоп', 'Клип'],
  },
  {
    id: 'halloween',
    title: 'Fresh — Halloween',
    client: 'Fresh',
    year: '2025',
    category: 'Мультфильмы',
    video: '/videos/cartoon-halloween.webm',
    thumb: '/thumbs/cartoon-halloween.jpg',
    vertical: true,
    about:
      'Хэллоуинский ролик для крупнейшего автосалона России. Анимационный стиль, сезонная атмосфера и фирменный tone-of-voice бренда.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Авто', 'Сезонное'],
  },
  {
    id: 'migal',
    title: 'Fresh — Денис Мигаль',
    client: 'Fresh',
    year: '2025',
    category: 'Мультфильмы',
    video: '/videos/cartoon-migal.webm',
    thumb: '/thumbs/cartoon-migal.jpg',
    vertical: true,
    about:
      'Мультфильм ко дню рождения Дениса Мигаля — история становления создателя крупнейшего автосалона Fresh. Личная история в формате анимационного короткого метра.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Авто', 'Личная история'],
  },
  {
    id: 'mnd-movie',
    title: 'mnd. movie',
    client: 'Авторский проект mnd.',
    year: '2026',
    category: 'Мультфильмы',
    video: '/videos/cartoon-mnd.webm',
    thumb: '/thumbs/cartoon-mnd.jpg',
    about:
      'Авторский мультфильм студии — история о парочке, которая мечтала снять свой фильм. Творческий манифест команды в формате анимации.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Студия', 'Авторское'],
  },
  {
    id: 'ny-pogodi',
    title: 'Ну, погоди!',
    client: 'Союзмультфильм',
    year: '2026',
    category: 'Мультфильмы',
    video: '/videos/cartoon-ny-pogodi.webm',
    thumb: '/thumbs/cartoon-ny-pogodi.jpg',
    about:
      'Спецвыпуск к юбилею Союзмультфильма в стиле легендарного «Ну, погоди!». Дань уважения классике советской анимации.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Юбилей', 'Классика'],
  },

  // ── ПРОДУКТЫ ───────────────────────────────────────
  {
    id: 'feastables',
    title: 'Feastables',
    client: 'Спек-реклама',
    year: '2026',
    category: 'Продукты',
    video: '/videos/product-feastables.webm',
    thumb: '/thumbs/product-feastables.jpg',
    about:
      'Спек-реклама шоколада Feastables: состав, вкус и текстура передаются прямо через экран. Предметная съёмка как гастрономический опыт.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['FMCG', 'Спек'],
  },
  {
    id: 'go-champ',
    title: 'Go Champ Energy',
    client: 'Спек-реклама',
    year: '2026',
    category: 'Продукты',
    video: '/videos/product-go-champ.webm',
    thumb: '/thumbs/product-go-champ.jpg',
    about:
      'Спек-реклама для энергетика Go Champ — энергия, динамика и скорость в каждом кадре.',
    task: '',
    solution: '',
    result: 'Ролик был отмечен самим брендом.',
    facts: [],
    tags: ['Напитки', 'Спек'],
  },
  {
    id: 'mozi',
    title: 'Mozi Jewelry',
    client: 'Mozi',
    year: '2026',
    category: 'Продукты',
    video: '/videos/product-mozi.webm',
    thumb: '/thumbs/product-mozi.jpg',
    vertical: true,
    about:
      'Украшение из баскетбольной коллекции Mozi на паркете: через свет и движение камеры раскрывается концепция и премиальность браслета.',
    task: '',
    solution: '',
    result: '',
    facts: [],
    tags: ['Ювелирное', 'Предметка'],
  },
]
