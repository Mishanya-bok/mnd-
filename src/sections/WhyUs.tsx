import { useRef } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

const reasons = [
  {
    statement: 'Кинематографическое мышление, а не шаблонное исполнение.',
    detail: 'Каждый проект начинается с визуального намерения — эстетика никогда не случайна.',
  },
  {
    statement: 'AI-флюентность + продакшен-дисциплина.',
    detail: 'Мы знаем, как выжать максимум из генеративных инструментов и как довести работу до конца.',
  },
  {
    statement: 'Полировка на каждом шаге.',
    detail: 'Продакшен-бэкграунд Михаила означает: никаких шероховатостей, никакого «и так сойдёт».',
  },
  {
    statement: 'Быстро там, где это важно.',
    detail: 'Для кампейн-контента и концептуальных визуалов мы движемся со скоростью, которая нужна современным брендам.',
  },
]

export default function WhyUs() {
  const bgVideoRef = useRef<HTMLVideoElement>(null)

  return (
    <section className="section-gap relative overflow-hidden">
      {/* Ambient background video */}
      <video
        ref={bgVideoRef}
        src="/videos/ai-3.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.06 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 20%, transparent 80%, var(--color-bg) 100%)' }}
      />

      <div className="relative z-10 container-x">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 md:mb-16"
        >
          <motion.p variants={fadeUp} className="label mb-3">
            Почему mnd.team
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display font-semibold"
            >
              Чем мы отличаемся
            </motion.h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col"
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 py-7 border-b border-[var(--color-border)] last:border-b-0 cursor-default"
            >
              <span className="label text-[var(--color-dim)] w-8 shrink-0 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-xl-fluid font-semibold text-[var(--color-white)] md:w-[55%] leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-400">
                {reason.statement}
              </h3>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed md:flex-1">
                {reason.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
