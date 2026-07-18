import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { offerings, numbers, testimonials } from '@data/site'

export default function Studio() {
  return (
    <section
      id="studio"
      className="relative bg-[color:var(--color-ink)] text-[color:var(--color-bone)] py-[var(--section-y)]"
    >
      <div className="container-x grid lg:grid-cols-3 gap-14 lg:gap-12">
        {/* Offerings */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}>
          <motion.p variants={fadeUp} className="u-label text-[color:var(--color-bone)]/50 mb-8">What We Make</motion.p>
          <ul className="flex flex-col">
            {offerings.map((o) => (
              <motion.li
                key={o.title}
                variants={fadeUp}
                className="py-5 border-t border-[color:var(--color-line)] last:border-b"
              >
                <h3 className="u-xl">{o.title}</h3>
                <p className="text-[color:var(--color-bone)]/60 mt-1.5 text-[0.95rem] leading-snug">{o.line}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Numbers */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}>
          <motion.p variants={fadeUp} className="u-label text-[color:var(--color-bone)]/50 mb-8">By The Numbers</motion.p>
          <div className="flex flex-col gap-10">
            {numbers.map((n) => (
              <motion.div key={n.label} variants={fadeUp}>
                <div className="u-mega leading-[0.85] text-[color:var(--color-crimson)]" style={{ fontSize: 'clamp(3rem,7vw,5.5rem)' }}>
                  {n.value}
                </div>
                <p className="u-label-sm text-[color:var(--color-bone)]/55 mt-3">{n.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Voices */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}>
          <motion.p variants={fadeUp} className="u-label text-[color:var(--color-bone)]/50 mb-8">What Clients Say</motion.p>
          <div className="flex flex-col gap-10">
            {testimonials.map((t) => (
              <motion.figure key={t.who} variants={fadeUp} className="border-t border-[color:var(--color-line)] pt-6">
                <blockquote className="u-lg font-medium leading-snug">“{t.quote}”</blockquote>
                <figcaption className="u-label-sm text-[color:var(--color-bone)]/55 mt-4">
                  {t.who} <span className="text-[color:var(--color-bone)]/35">/ {t.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
