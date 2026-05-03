import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'
import TiltCard from '@components/TiltCard'

const team = [
  {
    name: 'Михаил',
    role: 'Монтажёр / Руководитель продакшена',
    telegram: '@mishanya_bok',
    path: 'Образование бухгалтера и аудитора — но всю жизнь создавал видео.',
    description: '5 лет монтажа и владение пакетом Adobe + DaVinci Resolve. Работал с крупными блогерами. Теперь создаёт кинематографический визуал с помощью ИИ.',
  },
  {
    name: 'София',
    role: 'AI-Креатор / Визуальный директор',
    telegram: '@alienlale',
    path: 'Образование логиста. Разочаровалась. Вела блог. Взяла в руки ИИ — и всё изменилось.',
    description: 'Лицензированный AI-креатор. Отвечает за визуальную концепцию и общую эстетику. Создаёт видео для крупных коммерческих компаний.',
  },
]

const statsData = [
  { target: 10, suffix: 'M+', label: 'зрителей', sub: 'суммарный охват работ' },
  { target: 10,  suffix: '',   label: 'экранов Москвы', sub: 'крупнейших билбордов города' },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 1600
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(ease * target))
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, target])

  return (
    <span ref={ref} className="font-display font-semibold text-[var(--color-accent)] leading-none shrink-0" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
      {count}{suffix}
    </span>
  )
}

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div variants={fadeUp}>
      <TiltCard className="h-full" intensity={6}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="glass rounded-2xl p-8 cursor-default relative overflow-hidden h-full"
          style={{
            transition: 'box-shadow 0.35s ease',
            boxShadow: hovered
              ? '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,209,255,0.3)'
              : '0 2px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,209,255,0.06)',
          }}
        >
          {/* Decorative large index */}
          <span
            className="absolute top-4 right-6 font-display font-semibold leading-none select-none pointer-events-none"
            style={{
              fontSize: '6rem',
              color: hovered ? 'rgba(0,209,255,0.07)' : 'rgba(255,255,255,0.03)',
              transition: 'color 0.5s',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Cyan accent bar */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            animate={{ scaleY: hovered ? 1 : 0.15, opacity: hovered ? 1 : 0 }}
            style={{ backgroundColor: '#00D1FF', transformOrigin: 'center', boxShadow: '2px 0 8px rgba(0,209,255,0.4)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          <p className="label text-[var(--color-accent)] mb-2">{member.role}</p>

          <p className="text-xs text-[var(--color-muted)] font-light italic mb-4 leading-relaxed max-w-[28ch]">
            {member.path}
          </p>

          <h3
            className="font-display font-semibold leading-none mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: hovered ? '#00D1FF' : 'var(--color-white)',
              transition: 'color 0.3s',
            }}
          >
            {member.name}
          </h3>

          <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
            {member.description}
          </p>

          <motion.div
            className="mt-5 flex items-center gap-2"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.3 }}
          >
            <span className="w-4 h-px bg-[var(--color-accent)]" />
            <span className="label text-[var(--color-accent)]">{member.telegram}</span>
          </motion.div>
        </div>
      </TiltCard>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          className="glass rounded-2xl grid grid-cols-2 divide-x divide-[rgba(0,209,255,0.08)]"
        >
          {statsData.map((stat, i) => (
            <div key={i} className="px-8 py-7 flex items-center gap-5">
              <AnimatedCounter target={stat.target} suffix={stat.suffix} />
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
