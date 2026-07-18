import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { achievement, offerings, socialProof } from '@data/site'

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

        {/* Social proof gallery */}
        <div className="mt-24 border-t border-[color:var(--color-line)] pt-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-2xl">
            <h3 className="u-xl">{socialProof.title}</h3>
            <p className="text-[color:var(--color-bone)]/60 mt-2">{socialProof.sub}</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid md:grid-cols-2 gap-6 lg:gap-10 mt-10 items-stretch"
          >
            {/* two portrait stories */}
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {socialProof.stories.map((s) => (
                <StoryCard key={s.who} src={s.src} who={s.who} />
              ))}
            </div>
            {/* two wide "liked your reel" notifications */}
            <div className="flex flex-col justify-center gap-4 md:gap-5">
              {socialProof.likes.map((s) => (
                <LikeCard key={s.who} src={s.src} who={s.who} />
              ))}
            </div>
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

function StoryCard({ src, who }: { src: string; who: string }) {
  const [ok, setOk] = useState(true)
  return (
    <motion.figure
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-ink-2)] select-none"
      style={{ aspectRatio: '9 / 16' }}
    >
      {ok ? (
        <img src={src} alt={who} onError={() => setOk(false)} draggable={false}
          className="w-full h-full object-cover pointer-events-none" />
      ) : (
        <div className="w-full h-full grid place-items-center text-center px-3">
          <span className="u-label-sm text-[color:var(--color-bone)]/40">{who}<br /><span className="text-[color:var(--color-bone)]/25">скриншот скоро</span></span>
        </div>
      )}
      <figcaption className="absolute left-3 bottom-3 u-label-sm text-[color:var(--color-bone)]/85 mix-blend-difference">{who}</figcaption>
    </motion.figure>
  )
}

function LikeCard({ src, who }: { src: string; who: string }) {
  const [ok, setOk] = useState(true)
  return (
    <motion.figure
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-white/[0.04] select-none p-2"
    >
      {ok ? (
        <img src={src} alt={who} onError={() => setOk(false)} draggable={false}
          className="w-full h-auto rounded-lg pointer-events-none" />
      ) : (
        <div className="h-20 grid place-items-center text-center">
          <span className="u-label-sm text-[color:var(--color-bone)]/40">{who} · скриншот скоро</span>
        </div>
      )}
    </motion.figure>
  )
}
