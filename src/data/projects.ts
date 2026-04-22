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
    id: 'alien',
    title: 'Alien',
    category: 'Фэшн-атмосфера',
    year: '2025',
    description:
      'Атмосферная фэшн-работа с кинематографическими эффектами. Форма, текстура и визуальное настроение — как основной материал.',
    videoSrc: '/videos/alien.webm',
    tags: ['Фэшн', 'Атмосфера', 'AI Генерация'],
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
