import { useRef } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

const reasons = [
  {
    statement: 'Cinematic thinking, not template execution.',
    detail: 'Every project starts with visual intent — the aesthetic is never accidental.',
  },
  {
    statement: 'AI fluency + production discipline.',
    detail: 'We know how to get the best from generative tools and how to finish the work properly.',
  },
  {
    statement: 'Polished output, every time.',
    detail: "Mikhail's production background means no rough edges, no 'good enough'.",
  },
  {
    statement: 'Faster where it counts.',
    detail: 'For campaign content and concept visuals, we move at the speed modern brands need.',
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
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 md:mb-16"
        >
          <motion.p variants={fadeUp} className="label mb-3">
            Why mnd.team
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display italic font-light"
            >
              What sets us apart
            </motion.h2>
          </div>
        </motion.div>

        {/* Reasons */}
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
              className="group flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 py-7 border-b border-[var(--color-border)] last:border-b-0"
            >
              {/* Number */}
              <span className="label text-[var(--color-dim)] w-8 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* Statement */}
              <h3 className="font-display text-xl-fluid italic font-light text-[var(--color-white)] md:w-[55%] leading-snug">
                {reason.statement}
              </h3>
              {/* Detail */}
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
