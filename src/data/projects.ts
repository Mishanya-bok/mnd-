export interface Project {
  id: string
  title: string
  category: string
  year: string
  description: string
  videoSrc: string
  tags: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'showreel',
    title: 'Шоурил студии',
    category: 'Шоурил',
    year: '2025',
    description:
      'Лучшие работы студии mnd. в одном ролике — коммерческие проекты, спек-реклама и кинематографические визуалы.',
    videoSrc: '/videos/showreel.webm',
    tags: ['Шоурил', 'AI Продакшен', 'mnd.team'],
    featured: true,
  },
  {
    id: 'rolf-banners',
    title: 'Rolf — Баннеры Москвы',
    category: 'Коммерческий',
    year: '2025',
    description:
      'Коммерческий ролик для Rolf, показанный на 10 крупнейших экранах Москвы. Совместная работа с агентством Dibrain — городской масштаб, брендовая точность, кинематографический визуальный язык.',
    videoSrc: '/videos/rolf-banners.webm',
    tags: ['Коммерческий', 'OOH', 'Dibrain'],
    featured: true,
  },
  {
    id: 'rolf',
    title: 'Rolf × Красная машина',
    category: 'Коммерческий',
    year: '2025',
    description:
      'Коммерческий ролик для автомобильного бренда Rolf. Совместный проект с агентством Dibrain — динамика, движение и визуальная идентичность в одном кинематографическом видео.',
    videoSrc: '/videos/rolf.webm',
    tags: ['Коммерческий', 'Авто', 'Dibrain'],
    featured: true,
  },
  {
    id: 'roman',
    title: 'Роман Каграманов',
    category: 'Блогер',
    year: '2026',
    description:
      'Видео-контент для блогера Романа Каграманова. В этом проекте mnd. отвечали за графику — вся визуальная часть создана с помощью AI.',
    videoSrc: '/videos/roman.webm',
    tags: ['Блогер', 'AI Графика', 'Личный бренд'],
    featured: true,
  },
  {
    id: 'yandex-lavka',
    title: 'Яндекс Лавка',
    category: 'Спек-реклама',
    year: '2026',
    description:
      'Спек-реклама для Яндекс Лавки в стиле реализма. Продукт снятый так, будто это уже официальный кампейн.',
    videoSrc: '/videos/yandex-lavka.webm',
    tags: ['Спек-реклама', 'Фудтех', 'Реализм'],
    featured: true,
  },
  {
    id: 'energy',
    title: 'Energy Drink',
    category: 'Спек-реклама',
    year: '2026',
    description:
      'Спек-реклама для энергетического напитка. Высокоэнергетичный визуальный язык, созданный для коммерческого применения в полную силу.',
    videoSrc: '/videos/ai-1.webm',
    tags: ['Спек-реклама', 'Напитки', 'AI Продакшен'],
    featured: true,
  },
  {
    id: 'vkusno',
    title: 'Вкусно и Точка',
    category: 'Спек-реклама',
    year: '2026',
    description:
      'Вертикальный спек-ролик для Вкусно и Точка. Мобильный формат, динамичная подача, яркая визуальная идентичность.',
    videoSrc: '/videos/ai-2.webm',
    tags: ['Спек-реклама', 'Фудтех', 'Вертикальный'],
    featured: true,
  },
  {
    id: 'feastables',
    title: 'Feastables',
    category: 'Спек-реклама',
    year: '2026',
    description:
      'Спек-реклама для Feastables. Насыщенный визуальный язык, точная режиссура и высокий продакшен-уровень — один из сильнейших роликов студии.',
    videoSrc: '/videos/ai-3.webm',
    tags: ['Спек-реклама', 'FMCG', 'AI Продакшен'],
    featured: true,
  },
]
