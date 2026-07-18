import { asset } from '@lib/asset'

/** Brands shown in the minimal monochrome "trusted by" ticker.
 *  Each wordmark gets a distinct typographic treatment to read like a logo.
 *  Drop real SVG logos into /public/brands and swap `text` for <img> later. */
import type { CSSProperties } from 'react'

export const brands: { text: string; font: CSSProperties }[] = [
  { text: 'P&G',                   font: { fontFamily: 'Georgia, serif', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.02em' } },
  { text: 'РОЛЬФ',                 font: { fontFamily: '"Arial Narrow", Inter, sans-serif', fontWeight: 800, letterSpacing: '0.14em' } },
  { text: 'Fresh Auto',            font: { fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '-0.04em' } },
  { text: 'Positive Technologies', font: { fontFamily: '"Courier New", monospace', fontWeight: 700, letterSpacing: '-0.03em' } },
  { text: 'Яндекс',                font: { fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' } },
  { text: 'Т—Банк',               font: { fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '0.01em' } },
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
