import { useState } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

const reasons = [
  {
    statement: 'Кинематографическое мышление, а не шаблонное исполнение.',
    detail: 'Каждый проект начинается с визуального намерения — эстетика никогда не случайна.',
    tag: '01',
  },
  {
    statement: 'AI-флюентность + продакшен-дисциплина.',
    detail: 'Мы знаем, как выжать максимум из генеративных инструментов и как довести работу до конца.',
    tag: '02',
  },
  {
    statement: 'Полировка на каждом шаге.',
    detail: 'Продакшен-бэкграунд Михаила означает: никаких шероховатостей, никакого «и так сойдёт».',
    tag: '03',
  },
  {
    statement: 'Быстро там, где это важно.',
    detail: 'Для кампейн-контента и концептуальных визуалов мы движемся со скоростью, которая нужна современным брендам.',
    tag: '04',
  },
]

function ReasonRow({ reason }: { reason: typeof reasons[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        backgroundColor: hovered ? 'rgba(201,168,108,0.07)' : 'rgba(255,255,255,0)',
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-10 py-8 px-5 rounded-xl cursor-default border-b border-white/10 last:border-b-0 relative"
    >
      {/* Gold accent left bar */}
      <motion.div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        style={{ backgroundColor: '#c9a86c', transformOrigin: 'center' }}
        transition={{ duration: 0.3 }}
      />

      <span className="label text-white/25 w-8 shrink-0 group-hover:text-[#c9a86c] transition-colors duration-300">
        {reason.tag}
      </span>

      <motion.h3
        className="font-display font-semibold md:w-[55%] leading-snug transition-colors duration-300"
        style={{
          fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
          color: hovered ? '#c9a86c' : 'rgba(255,255,255,0.92)',
        }}
      >
        {reason.statement}
      </motion.h3>

      <motion.p
        className="text-sm font-light leading-relaxed md:flex-1"
        animate={{ opacity: hovered ? 0.8 : 0.45, y: hovered ? 0 : 3 }}
        style={{ color: 'rgba(255,255,255,0.55)' }}
        transition={{ duration: 0.3 }}
      >
        {reason.detail}
      </motion.p>
    </motion.div>
  )
}

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#111113' }}>
      <div className="section-gap container-x">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="mb-12 md:mb-16">
            <motion.p variants={fadeUp} className="label mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Почему mnd.team
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
                className="font-display text-display font-semibold"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                Чем мы отличаемся
              </motion.h2>
            </div>
          </div>

          <div className="flex flex-col">
            {reasons.map((reason) => (
              <ReasonRow key={reason.tag} reason={reason} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gradient fade to dark at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #080808)' }}
      />
    </section>
  )
}
