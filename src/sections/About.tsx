import { useState } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

const team = [
  {
    name: 'София',
    role: 'AI-Креатор / Визуальный директор',
    telegram: '@alienlale',
    description: 'Отвечает за визуальную концепцию, AI-режиссуру и общую эстетику. Тот вкус, к которому возвращаются клиенты.',
  },
  {
    name: 'Михаил',
    role: 'Монтажёр / Руководитель продакшена',
    telegram: '@mishanya_bok',
    description: 'Монтаж, финальная сборка и коммерческая точность — то, что отличает сырой материал от готового продукта.',
  },
]

const stats = [
  { number: '10M+', label: 'зрителей', sub: 'суммарный охват работ' },
  { number: '10', label: 'экранов Москвы', sub: 'крупнейших билбордов города' },
]

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -6 : 0,
        boxShadow: hovered
          ? '0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(201,168,108,0.3)'
          : '0 2px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.06)',
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-8 cursor-default relative overflow-hidden"
    >
      {/* Decorative large initial */}
      <span
        className="absolute top-4 right-6 font-display font-semibold leading-none select-none pointer-events-none transition-all duration-500"
        style={{
          fontSize: '6rem',
          color: hovered ? 'rgba(201,168,108,0.08)' : 'rgba(0,0,0,0.04)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Gold accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
        animate={{ scaleY: hovered ? 1 : 0.2, opacity: hovered ? 1 : 0 }}
        style={{ backgroundColor: '#c9a86c', transformOrigin: 'center' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      <p className="label text-[var(--color-accent)] mb-3">{member.role}</p>
      <h3
        className="font-display font-semibold leading-none mb-4 transition-colors duration-300"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: hovered ? '#c9a86c' : 'var(--color-white)',
        }}
      >
        {member.name}
      </h3>
      <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
        {member.description}
      </p>

      {/* Telegram handle */}
      <motion.div
        className="mt-5 flex items-center gap-2"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.3 }}
      >
        <span className="w-4 h-px bg-[var(--color-accent)]" />
        <span className="label text-[var(--color-accent)]">{member.telegram}</span>
      </motion.div>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <motion.p variants={fadeUp} className="label mb-4">О студии</motion.p>
          <div className="overflow-hidden mb-6">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display font-semibold leading-[1.05]"
            >
              Два ума.
              <br />
              <span style={{ color: 'var(--color-accent)' }}>Одно видение.</span>
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-[var(--color-muted)] font-light leading-relaxed max-w-lg">
            Мы создаём кинематографичные AI-визуалы для брендов, артистов и кампаний — с точностью бутиковой студии и гибкостью современной команды.
          </motion.p>
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          className="glass rounded-2xl grid grid-cols-2 divide-x divide-[rgba(0,0,0,0.07)]"
        >
          {stats.map((stat, i) => (
            <div key={i} className="px-8 py-7 flex items-center gap-5">
              <span
                className="font-display font-semibold text-[var(--color-accent)] leading-none shrink-0"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
              >
                {stat.number}
              </span>
              <div>
                <p className="text-[var(--color-white)] font-medium text-sm">{stat.label}</p>
                <p className="text-[var(--color-dim)] font-light text-xs mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
