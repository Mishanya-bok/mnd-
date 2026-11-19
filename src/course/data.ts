// Контент курса собран по холсту кураторов (фреймы 1–4).

export type Tool = {
  name: string
  group: 'Текст' | 'Фото' | 'Видео' | 'Звук'
  role: string
  price?: string
  details?: string[]
  badge?: string
}

export const tools: Tool[] = [
  {
    name: 'ChatGPT',
    group: 'Текст',
    role: 'Текстовый генератор, который умеет создавать фото',
    price: '18 € / ≈1 833 ₽',
    details: ['Пишет промпты', 'Создаёт изображения', 'Придумывает идеи и сценарии'],
    badge: 'есть бесплатный',
  },
  {
    name: 'Claude',
    group: 'Текст',
    role: 'Текстовый генератор, очень умный',
    price: '20 $ / ≈2 000 ₽',
    details: ['Глубже понимает запрос', 'Пишет промпты и сценарии', 'Умеет создавать дизайн и писать код', 'Можно подгружать скиллы'],
    badge: 'платный',
  },
  {
    name: 'Midjourney',
    group: 'Фото',
    role: 'Изображения: кинематографично, мощные стилистики, реализм',
    price: '10 $ / ≈800 ₽',
    details: ['180 минут генераций', '4 фото ≈ 1 минута'],
  },
  {
    name: 'Nano Banana Pro',
    group: 'Фото',
    role: 'Создание изображений — самый частый в работе',
    details: ['Google', 'Редактирование по референсам'],
  },
  {
    name: 'Veo 3',
    group: 'Видео',
    role: 'Анимация видео — на текущий момент слабее остальных',
    price: '2 500–4 000 ₽',
    details: ['Google'],
  },
  {
    name: 'Kling 3.0',
    group: 'Видео',
    role: 'Анимация видео — средний-сильный уровень',
    details: ['3–15 секунд', 'Start frame → end frame', 'На вход 1–2 картинки', 'Недорогой в генерациях'],
  },
  {
    name: 'Kling 3.0 Omni Edit',
    group: 'Видео',
    role: 'Редактирование готового видео',
    details: ['На вход даёшь видео', 'Меняешь детали в ролике'],
  },
  {
    name: 'Seedance 2.0',
    group: 'Видео',
    role: 'Анимация видео — самый сильный на рынке, но очень дорогой',
    details: ['4–15 секунд', 'На вход: до 8 фото, до 3 видео, аудио', 'Генерация по референсам'],
  },
  {
    name: 'ElevenLabs',
    group: 'Звук',
    role: 'Создание озвучки',
    price: '6 $',
  },
]

export const higgsfieldModels = ['ChatGPT (картинки)', 'Nano Banana Pro', 'Veo 3', 'Seedance 2.0', 'Kling']

export const glossary = [
  {
    term: 'Промпт',
    text: 'Конкретный запрос для нейросети. Чем точнее описано, что ты хочешь увидеть, тем ближе результат.',
  },
  {
    term: 'Скилл',
    text: 'Заранее заложенный длинный промпт-навык, обычно в виде файла. Ты не пишешь сочинение: прикладываешь скилл по своему направлению, добавляешь короткий запрос, и нейросеть обрабатывает их вместе — шире и при этом точнее.',
  },
  {
    term: 'Start / end frame',
    text: 'Первый и последний кадр видео. Даёшь модели две картинки, и она анимирует переход между ними.',
  },
  {
    term: 'Референс',
    text: 'Фото, видео или звук, который ты прикладываешь к промпту, чтобы нейросеть повторила объект, персонажа или стиль.',
  },
  {
    term: 'Элемент / сетка объекта',
    text: 'Один объект с нескольких ракурсов на одной картинке. По ней видео-модель держит объект одинаковым во всех кадрах.',
  },
  {
    term: 'Higgsfield',
    text: 'Платформа, где собраны генераторы картинок и видео. Создаёт визуал, но не пишет промпты — их готовим в GPT или Claude.',
  },
]

export type PipelineStep = {
  where: string
  goal: string
  inputs: { label: string; img?: string; text?: string }[]
  output: { label: string; img: string }
  prompt?: string
}

export const pipeline: PipelineStep[] = [
  {
    where: 'ChatGPT',
    goal: 'Идём в ChatGPT, чтобы получить картинку',
    inputs: [
      { label: 'Фото машины', img: '/course/car-photo.jpg' },
      {
        label: 'Запрос текстом',
        text: 'Сделай мне по данному автомобилю сетку из 4 ракурсов: строго прямо, под 45 градусов, сзади, строго сбоку. На белом фоне. Найди в интернете этот авто и воссоздай машину максимально точно.',
      },
    ],
    output: { label: 'Элемент — сетка объекта', img: '/course/car-grid.jpg' },
  },
  {
    where: 'Claude + скилл',
    goal: 'Идём в Claude, чтобы получить промпт',
    inputs: [
      { label: 'Сетка объекта', img: '/course/car-grid.jpg' },
      { label: 'Скилл (файл)', img: '/course/skill.jpg' },
      {
        label: 'Запрос текстом',
        text: 'Сделай промпт общего характера для Seedance 2.0 на 12 сек: общий план 3 сек, детали 3 сек, передняя фара крупным планом 3 сек, машина сзади крупным планом под углом 3 сек. Белая дорогая циклорама. Промпт без привязки к марке, машина всегда стоит на месте. Камера двигается как роборука.',
      },
    ],
    output: { label: 'Готовый промпт', img: '/course/skill.jpg' },
    prompt:
      'Style & Mood: Professional automotive product cinematography with a premium high-end garage aesthetic. Seamless white cyclorama forms the walls and floor… Motion-control camera choreography throughout — Bolt cinebot aesthetic, mechanically precise trajectories, zero handheld feel. Dynamic Description: The vehicle sits stationary at the center of the cyclorama for the entire twelve-second sequence… Hard cut. In a tight two-second beat, the robotic arm pushes in macro on the front headlight assembly… Static Description: Location: premium showroom / high-end private garage…',
  },
  {
    where: 'Higgsfield',
    goal: 'Идём в Higgsfield, чтобы получить видео',
    inputs: [
      { label: 'Сетка объекта', img: '/course/car-grid.jpg' },
      { label: 'Промпт из Claude', text: 'the vehicle. Style & Mood: Professional automotive product cinematography…' },
    ],
    output: { label: 'Видео 12 сек', img: '/course/car-video.jpg' },
  },
]

export const animationWays = [
  {
    title: 'Только текст',
    subtitle: 'Даём нейросети просто запрос текстом (промптом)',
    request: 'Нужно создать видео на 10 секунд, вертикальный формат, дайвинг возле разноцветных кораллов, вода прозрачная, хорошая подводная видимость.',
    flow: ['Запрос', 'Claude', 'Промпт', 'Видео'],
    img: '/course/dive-text.jpg',
    note: 'Быстро, но нейросеть сама решает, как выглядят персонаж и место.',
  },
  {
    title: 'Референсы + текст',
    subtitle: 'Даём нейросети фото, видео, звук и запрос текстом',
    request: 'Тот же запрос + фото дайвера. В промпте Claude ссылается на картинку как <<<image_1.',
    flow: ['Запрос + фото', 'Claude', 'Промпт', 'Видео'],
    img: '/course/diver-video.jpg',
    note: 'Полный контроль: персонаж и стиль совпадают с референсом. Так работаем с коммерцией.',
  },
]

export type Lesson = { id: string; title: string; points: string[] }

export type Module = {
  id: string
  num: string
  title: string
  tagline: string
  tools: string[]
  lessons: Lesson[]
  practice: string
  draft?: boolean
}

export const modules: Module[] = [
  {
    id: 'gpt',
    num: '01',
    title: 'Работа с GPT и Claude',
    tagline: 'Текстовые нейросети — мозг всего пайплайна',
    tools: ['ChatGPT', 'Claude', 'Скиллы'],
    lessons: [
      {
        id: 'gpt-1',
        title: 'Что такое промпт',
        points: ['Промпт — конкретный запрос для нейросети', 'Из чего состоит хороший запрос', 'Как дорабатывать ответ итерациями'],
      },
      {
        id: 'gpt-2',
        title: 'ChatGPT vs Claude',
        points: [
          'ChatGPT: промпты, изображения, идеи и сценарии, есть бесплатный',
          'Claude: глубже понимает запрос, дизайн, код, платный',
          'Когда какой открывать',
        ],
      },
      {
        id: 'gpt-3',
        title: 'Скиллы',
        points: [
          'Скилл — готовый длинный промпт-навык в виде файла',
          'Как подгрузить скилл в Claude',
          'Пример: «Seedance 2.0 — Universal Director» превращает короткий запрос в промпт для видео',
        ],
      },
    ],
    practice: 'Получи от Claude со скиллом промпт для 12-секундного ролика по своему короткому запросу.',
  },
  {
    id: 'photo',
    num: '02',
    title: 'Фото: GPT и Nano Banana',
    tagline: 'Создаём кадры, персонажей и сетки объектов',
    tools: ['ChatGPT', 'Nano Banana Pro', 'Midjourney'],
    lessons: [
      {
        id: 'photo-1',
        title: 'Картинки в ChatGPT',
        points: ['Генерация и правки прямо в диалоге', 'Запрос текстом + фото-референс', 'Поиск объекта в интернете и точное воссоздание'],
      },
      {
        id: 'photo-2',
        title: 'Nano Banana Pro',
        points: ['Самый частый инструмент в работе', 'Редактирование по референсам', 'Консистентный персонаж и продукт'],
      },
      {
        id: 'photo-3',
        title: 'Элемент — сетка объекта',
        points: ['4 ракурса: прямо, 45°, сзади, сбоку', 'Белый фон', 'Зачем сетка видео-модели'],
      },
      {
        id: 'photo-4',
        title: 'Start и end frame',
        points: ['Готовим первый и последний кадр', 'Пример: белая коробка → брендированная упаковка', 'Midjourney для кинематографичных стилистик'],
      },
    ],
    practice: 'Сделай сетку из 4 ракурсов для любого продукта и пару start/end frame.',
  },
  {
    id: 'video',
    num: '03',
    title: 'Видео-генерация',
    tagline: 'Два способа анимации и выбор модели',
    tools: ['Higgsfield', 'Kling 3.0', 'Seedance 2.0', 'Veo 3'],
    lessons: [
      {
        id: 'video-1',
        title: 'Higgsfield',
        points: ['Где собраны все генераторы', 'Делает картинки и видео, но НЕ пишет промпты', 'Как не сжечь кредиты'],
      },
      {
        id: 'video-2',
        title: 'Два способа анимации',
        points: ['Только текст (промпт)', 'Фото, видео, звук + текст', 'Пример с дайвером'],
      },
      {
        id: 'video-3',
        title: 'Kling 3.0',
        points: ['Start frame → end frame, на вход 1–2 картинки', '3–15 секунд, недорогой', 'Omni Edit: редактирование готового видео'],
      },
      {
        id: 'video-4',
        title: 'Seedance 2.0',
        points: ['Самый сильный и самый дорогой', 'На вход до 8 фото, 3 видео и аудио', 'Пример: машина на циклораме, 12 секунд'],
      },
    ],
    practice: 'Пройди весь пайплайн: фото → сетка → промпт в Claude → видео в Higgsfield.',
  },
  {
    id: 'edit',
    num: '04',
    title: 'Монтаж',
    tagline: 'Собираем шоты в готовый ролик',
    tools: ['Монтажка', 'ElevenLabs'],
    draft: true,
    lessons: [
      { id: 'edit-1', title: 'Основы монтажа', points: ['Склейки и ритм', 'Хронометраж под площадку'] },
      { id: 'edit-2', title: 'Звук и озвучка', points: ['Озвучка в ElevenLabs', 'Музыка и саунд-дизайн'] },
      { id: 'edit-3', title: 'Экспорт', points: ['Вертикаль и горизонталь', 'Апскейл и финальная проверка'] },
    ],
    practice: 'Смонтируй ролик из своих шотов с озвучкой.',
  },
  {
    id: 'business',
    num: '05',
    title: 'Ценник и клиенты',
    tagline: 'Как превратить навык в доход',
    tools: ['Портфолио', 'Прайс'],
    draft: true,
    lessons: [
      { id: 'biz-1', title: 'Как сформировать ценник', points: ['Себестоимость: подписки и кредиты', 'Пакеты услуг'] },
      { id: 'biz-2', title: 'Где искать клиентов', points: ['Портфолио и шоурил', 'Первые сообщения клиентам'] },
      { id: 'biz-3', title: 'Работа с заказчиком', points: ['Бриф и согласования', 'Сдача проекта'] },
    ],
    practice: 'Собери прайс и портфолио из работ курса.',
  },
]
