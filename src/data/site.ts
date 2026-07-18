import { asset } from '@lib/asset'

/** Brands shown in the animated "trusted by" ticker.
 *  `color` tints the wordmark toward each brand's identity.
 *  Drop real SVG logos into /public/brands and swap `text` for <img> later. */
export const brands = [
  { text: 'P&G', color: '#4aa3df', weight: 800, style: 'italic' as const },
  { text: 'РОЛЬФ', color: '#ffffff', weight: 800, style: 'normal' as const },
  { text: 'Fresh Auto', color: '#7ed957', weight: 700, style: 'normal' as const },
  { text: 'Positive Technologies', color: '#ff2d6f', weight: 700, style: 'normal' as const },
  { text: 'Яндекс', color: '#ffcc33', weight: 700, style: 'normal' as const },
  { text: 'Т-Банк', color: '#ffdd2d', weight: 800, style: 'normal' as const },
]

export const offerings = [
  { title: 'ИИ-реклама', line: 'Продуктовые и имиджевые ролики на скорости ИИ, с финишем как в кино.' },
  { title: 'Fashion & Beauty', line: 'Визуалы, где всё решают свет, фактура и настроение.' },
  { title: 'Контент для соцсетей', line: 'Вертикальные ролики, которые останавливают ленту.' },
  { title: 'Клипы', line: 'Миры для артистов — ритм, герой и монтаж как единое целое.' },
  { title: 'Концепты и кампании', line: 'Идея превращается в кадр ещё до съёмочного дня.' },
  { title: 'Сторителлинг', line: 'Короткий метр с режиссёрским взглядом в каждом кадре.' },
]

export const numbers = [
  { value: '50+', label: 'Проектов реализовано' },
  { value: '12', label: 'Стран охвачено' },
  { value: '100%', label: 'Собственное производство' },
  { value: 'ИИ', label: 'Сертифицированный подход' },
]

export const achievement = {
  label: 'Награда',
  title: '«Ну, ИИ, погоди!»',
  body:
    'Призёры всероссийского семейного конкурса анимации к 90-летию киностудии «Союзмультфильм» — совместно со Сбером и «Школой 21».',
}

/** Social proof — reposts & mentions from big creators and brands.
 *  Non-clickable. Upload the 4 screenshots to /public/social/ as
 *  proof-1.jpg … proof-4.jpg (portrait). Until then these show a placeholder. */
export const socialProof = {
  title: 'Наши ролики смотрят и репостят',
  sub: 'Крупные блогеры и бренды забирают наши работы к себе.',
  shots: [
    { src: asset('/social/proof-1.jpg'), who: 'julia.gavrilina' },
    { src: asset('/social/proof-2.jpg'), who: 'an1kv · visofi.ai' },
    { src: asset('/social/proof-3.jpg'), who: 'gochampenergy' },
    { src: asset('/social/proof-4.jpg'), who: 'mozi_j' },
  ],
}

export const contacts = {
  sofia:   { name: 'София',  role: 'ИИ-креатор и визуальный директор', telegram: '@alienlale' },
  mikhail: { name: 'Михаил', role: 'Монтаж и финальная сборка',        telegram: '@mishanya_bok' },
}

export const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'Telegram',  href: 'https://t.me/mishanya_bok' },
  { label: 'Behance',   href: '#' },
]
