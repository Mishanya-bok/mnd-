import { asset } from '@lib/asset'

export type Aspect = '16:9' | '9:16'

export interface Project {
  id: string
  title: string
  category: string
  year: string
  aspect: Aspect
  /** compressed loop used in the carousel + lightbox */
  src: string
  /** poster / freeze-frame for inactive cards */
  poster: string
}

/**
 * To add a case: drop one object into this array.
 *   src    → /videos/<slug>.mp4
 *   poster → /videos/<slug>.jpg
 * Rename any title/category freely — nothing else depends on it.
 */
const rawProjects: Project[] = [
  { id: 'ptx',              title: 'Positive Technologies',        category: 'ИИ-реклама',              year: '2026', aspect: '16:9', src: '/videos/ptx.mp4',              poster: '/videos/ptx.jpg' },
  { id: 'intro-showreel',   title: 'P&G',                          category: 'ИИ-реклама',              year: '2026', aspect: '16:9', src: '/videos/intro-showreel.mp4',   poster: '/videos/intro-showreel.jpg' },
  { id: 'rolf-red-machine', title: 'Рольф × Красная Машина',       category: 'ИИ-реклама',              year: '2025', aspect: '16:9', src: '/videos/rolf-red-machine.mp4', poster: '/videos/rolf-red-machine.jpg' },
  { id: 'yandex-lavka',     title: 'Яндекс Лавка',                 category: 'ИИ-реклама',              year: '2026', aspect: '16:9', src: '/videos/yandex-lavka.mp4',     poster: '/videos/yandex-lavka.jpg' },
  { id: 'compound-2',       title: 'Баста × Fresh',                category: 'Брендированный контент',  year: '2026', aspect: '9:16', src: '/videos/compound-2.mp4',       poster: '/videos/compound-2.jpg' },
  { id: 'compound-1',       title: 'Alien',                        category: 'ИИ-реклама',              year: '2026', aspect: '9:16', src: '/videos/compound-1.mp4',       poster: '/videos/compound-1.jpg' },
  { id: 'nishevo',          title: 'Гаврилина — Нишево',           category: 'Клип',                    year: '2026', aspect: '16:9', src: '/videos/nishevo.mp4',          poster: '/videos/nishevo.jpg' },
  { id: 'angel-kiss',       title: 'Ангел, возьми мой поцелуй',    category: 'Клип',                    year: '2026', aspect: '16:9', src: '/videos/angel-kiss.mp4',       poster: '/videos/angel-kiss.jpg' },
  { id: 'miyagi-8mile',     title: 'Miyagi & Эндшпиль — 8 Mile',   category: 'Клип',                    year: '2026', aspect: '16:9', src: '/videos/miyagi-8mile.mp4',     poster: '/videos/miyagi-8mile.jpg' },
  { id: 'izvne',            title: 'Извне × Агентство Насилия',    category: 'Клип',                    year: '2026', aspect: '16:9', src: '/videos/izvne.mp4',            poster: '/videos/izvne.jpg' },
  { id: 'friendly-kizaru',  title: 'Friendly Thug × Kizaru',       category: 'Клип',                    year: '2026', aspect: '16:9', src: '/videos/friendly-kizaru.mp4',  poster: '/videos/friendly-kizaru.jpg' },
  { id: 'roman-meredith',   title: 'Роман Каграманов — «Мередит»', category: 'Брендированный контент',  year: '2026', aspect: '16:9', src: '/videos/roman-meredith.mp4',   poster: '/videos/roman-meredith.jpg' },
  { id: 'fresh-halloween',  title: 'Fresh — Хэллоуин',             category: 'Брендированный контент',  year: '2025', aspect: '9:16', src: '/videos/fresh-halloween.mp4',  poster: '/videos/fresh-halloween.jpg' },
  { id: 'fresh-migal',      title: 'Fresh — Денис Мигаль',         category: 'Брендированный контент',  year: '2025', aspect: '9:16', src: '/videos/fresh-migal.mp4',      poster: '/videos/fresh-migal.jpg' },
  { id: 'ai-clip-1',        title: 'GoChamp Energy',               category: 'ИИ-реклама',              year: '2026', aspect: '16:9', src: '/videos/ai-clip-1.mp4',        poster: '/videos/ai-clip-1.jpg' },
  { id: 'ai-clip-2',        title: 'Feastables',                   category: 'ИИ-реклама',              year: '2026', aspect: '16:9', src: '/videos/ai-clip-2.mp4',        poster: '/videos/ai-clip-2.jpg' },
  { id: 'ai-clip-3',        title: 'Сериал «Клуб Детективов»',     category: 'Кинематограф',            year: '2026', aspect: '9:16', src: '/videos/ai-clip-3.mp4',        poster: '/videos/ai-clip-3.jpg' },
  { id: 'nu-pogodi',        title: 'Ну, ИИ, погоди!',              category: 'Анимация',                year: '2026', aspect: '16:9', src: '/videos/nu-pogodi.mp4',        poster: '/videos/nu-pogodi.jpg' },
  { id: 'soyuzmultfilm',    title: 'Юбилей Союзмультфильма',       category: 'Кинематограф',            year: '2026', aspect: '16:9', src: '/videos/soyuzmultfilm.mp4',    poster: '/videos/soyuzmultfilm.jpg' },
  { id: 'mnd-movie',        title: 'mnd. movie',                   category: 'Кинематограф',            year: '2026', aspect: '16:9', src: '/videos/mnd-movie.mp4',        poster: '/videos/mnd-movie.jpg' },
  { id: 'mozi-jewelry',     title: 'Mozi Jewelry',                 category: 'Fashion',                 year: '2026', aspect: '9:16', src: '/videos/mozi-jewelry.mp4',     poster: '/videos/mozi-jewelry.jpg' },
  { id: 'velos-reels',      title: 'VELOS',                        category: 'ИИ-реклама',              year: '2025', aspect: '9:16', src: '/videos/velos-reels.mp4',      poster: '/videos/velos-reels.jpg' },
  { id: 'velos-building',   title: 'VELOS — графика',              category: 'ИИ-реклама',              year: '2025', aspect: '16:9', src: '/videos/velos-building.mp4',   poster: '/videos/velos-building.jpg' },
]

/** paths resolved against BASE_URL so they work at root or under a subpath */
export const projects: Project[] = rawProjects.map((p) => ({
  ...p,
  src: asset(p.src),
  poster: asset(p.poster),
}))
