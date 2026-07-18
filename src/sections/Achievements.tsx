import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { achievement, numbers, offerings, socialProof } from '@data/site'

export default function Achievements() {
  return (
    <section
      id="studio"
      className="relative bg-[color:var(--color-ink)] text-[color:var(--color-bone)] py-[var(--section-y)]"
    >
      <div className="container-x">
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}
          className="u-label text-[color:var(--color-bone)]/55 mb-10"
        >
          Наши достижения
        </motion.p>

        {/* Award highlight */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-start border-t border-[color:var(--color-line)] pt-10"
        >
          <motion.div variants={fadeUp}>
            <span className="u-label-sm text-[color:var(--color-crimson)]">★ {achievement.label}</span>
            <h3 className="u-display mt-4">{achievement.title}</h3>
          </motion.div>
          <motion.p variants={fadeUp} className="u-lg text-[color:var(--color-bone)]/75 leading-snug lg:pt-2">
            {achievement.body}
          </motion.p>
        </motion.div>

        {/* Numbers */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-[color:var(--color-line)] pt-10"
        >
          {numbers.map((n) => (
            <motion.div key={n.label} variants={fadeUp}>
              <div className="u-mega text-[color:var(--color-crimson)] leading-[0.85]" style={{ fontSize: 'clamp(2.6rem,6vw,4.5rem)' }}>
                {n.value}
              </div>
              <p className="u-label-sm text-[color:var(--color-bone)]/55 mt-3">{n.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof gallery */}
        <div className="mt-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-2xl">
            <h3 className="u-xl">{socialProof.title}</h3>
            <p className="text-[color:var(--color-bone)]/60 mt-2">{socialProof.sub}</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-10"
          >
            {socialProof.shots.map((s) => (
              <ProofCard key={s.who} src={s.src} who={s.who} />
            ))}
          </motion.div>
        </div>

        {/* What we make */}
        <div className="mt-24 grid lg:grid-cols-[0.5fr_1fr] gap-8 lg:gap-14 border-t border-[color:var(--color-line)] pt-10">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="u-label text-[color:var(--color-bone)]/55">
            Что мы делаем
          </motion.p>
          <motion.ul
            variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid sm:grid-cols-2 gap-x-12"
          >
            {offerings.map((o) => (
              <motion.li key={o.title} variants={fadeUp} className="py-5 border-t border-[color:var(--color-line)]">
                <h4 className="u-xl">{o.title}</h4>
                <p className="text-[color:var(--color-bone)]/55 mt-1.5 text-[0.92rem] leading-snug">{o.line}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

function ProofCard({ src, who }: { src: string; who: string }) {
  const [ok, setOk] = useState(true)
  return (
    <motion.figure
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-ink-2)] select-none"
      style={{ aspectRatio: '9 / 16' }}
    >
      {ok ? (
        <img
          src={src}
          alt={who}
          onError={() => setOk(false)}
          draggable={false}
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-center px-3">
          <span className="u-label-sm text-[color:var(--color-bone)]/40">{who}<br /><span className="text-[color:var(--color-bone)]/25">скриншот скоро</span></span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <figcaption className="absolute left-3 bottom-3 u-label-sm text-[color:var(--color-bone)]/80">{who}</figcaption>
    </motion.figure>
  )
}
