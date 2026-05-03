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
    id: 'alien',
    title: 'Alien',
    category: 'AI-видео',
    year: '2025',
    description:
      '— напиши пару предложений: что за проект, идея, стиль.',
    videoSrc: '/videos/alien.webm',
    tags: ['AI-видео', 'Кино'],
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
    id: 'ai-1',
    title: '— напиши название',
    category: 'AI-видео',
    year: '2026',
    description:
      '— напиши пару предложений: что за проект, для кого, в каком стиле.',
    videoSrc: '/videos/ai-1.webm',
    tags: ['AI-видео'],
    featured: true,
  },
  {
    id: 'ai-2',
    title: '— напиши название',
    category: 'AI-видео',
    year: '2026',
    description:
      '— напиши пару предложений: что за проект, для кого, в каком стиле.',
    videoSrc: '/videos/ai-2.webm',
    tags: ['AI-видео'],
    featured: true,
  },
  {
    id: 'ai-3',
    title: '— напиши название',
    category: 'AI-видео',
    year: '2026',
    description:
      '— напиши пару предложений: что за проект, для кого, в каком стиле.',
    videoSrc: '/videos/ai-3.webm',
    tags: ['AI-видео'],
    featured: true,
  },
]
