import { useState } from 'react'
import { motion } from 'framer-motion'
import { processSteps } from '@data/process'
import { stagger, fadeUp } from '@lib/motion'

function ProcessRow({ step, index }: { step: typeof processSteps[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        backgroundColor: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        boxShadow: hovered ? '0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,158,255,0.18)' : 'none',
        scale: hovered ? 1.015 : 1,
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-start gap-6 md:gap-10 py-7 px-4 md:px-6 rounded-xl cursor-default border-b border-[var(--color-border)] last:border-b-0"
      style={{ backdropFilter: hovered ? 'blur(12px)' : 'none' }}
    >
      {/* Gold left accent bar */}
      <motion.div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        style={{ backgroundColor: '#4a9eff', transformOrigin: 'center' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Step number */}
      <motion.span
        className="font-display font-semibold leading-none shrink-0 transition-colors duration-300 pt-1"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: hovered ? '#4a9eff' : 'var(--color-border)',
          minWidth: '3.5rem',
        }}
      >
        {step.number}
      </motion.span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-display font-semibold mb-1 transition-colors duration-300"
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: hovered ? 'var(--color-white)' : 'var(--color-white)',
          }}
        >
          {step.title}
        </h3>
        <motion.p
          className="text-sm text-[var(--color-muted)] font-light leading-relaxed"
          animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {step.description}
        </motion.p>
      </div>

      {/* Step index tag — right side */}
      <motion.div
        className="shrink-0 hidden md:flex items-center gap-2 self-center"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
        transition={{ duration: 0.3 }}
      >
        <span className="w-6 h-px bg-[var(--color-accent)]" />
        <span className="label text-[var(--color-accent)]">Шаг {index + 1}</span>
      </motion.div>
    </motion.div>
  )
}

export default function Process() {
  return (
    <section id="process" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.p variants={fadeUp} className="label mb-3">Как мы работаем</motion.p>
            <div className="overflow-hidden">
              <motion.h2
                variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
                className="font-display text-display font-semibold"
              >
                Процесс
              </motion.h2>
            </div>
          </div>
          <motion.p variants={fadeUp} className="text-sm text-[var(--color-muted)] font-light max-w-xs leading-relaxed">
            Четыре этапа — от идеи до финального ролика.
          </motion.p>
        </div>

        <div className="flex flex-col">
          {processSteps.map((step, i) => (
            <ProcessRow key={step.number} step={step} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
