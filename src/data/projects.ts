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
    id: 'rolf-banners',
    title: 'Rolf — Баннеры Москвы',
    category: 'Коммерческий',
    year: '2025',
    description:
      'Коммерческий ролик для Rolf, показанный на 10 крупнейших экранах Москвы. Городской масштаб, брендовая точность, кинематографический визуальный язык.',
    videoSrc: '/videos/rolf-banners.webm',
    tags: ['Коммерческий', 'OOH', 'Городской масштаб'],
    featured: true,
  },
  {
    id: 'rolf',
    title: 'Rolf × Красная машина',
    category: 'Коммерческий',
    year: '2025',
    description:
      'Коммерческий ролик для автомобильного бренда Rolf. Динамика, движение и визуальная идентичность — в одном кинематографическом видео.',
    videoSrc: '/videos/rolf.webm',
    tags: ['Коммерческий', 'Авто', 'Брендовый контент'],
    featured: true,
  },
  {
    id: 'roman',
    title: 'Роман Каграманов',
    category: 'Блогер',
    year: '2026',
    description:
      'Видео-контент для блогера Романа Каграманова. Персональный визуальный стиль, выстроенный под аудиторию и платформу.',
    videoSrc: '/videos/roman.webm',
    tags: ['Блогер', 'Контент', 'Личный бренд'],
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
