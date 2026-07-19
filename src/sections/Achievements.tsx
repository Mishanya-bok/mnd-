import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { achievements, offerings, socialProof } from '@data/site'

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

        {/* Award highlights */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="flex flex-col"
        >
          {achievements.map((a) => (
            <motion.div
              key={a.title}
              variants={fadeUp}
              className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-start border-t border-[color:var(--color-line)] py-10 last:border-b"
            >
              <div>
                <span className="u-label-sm text-[color:var(--color-crimson)]">★ {a.label}</span>
                <h3 className="u-display mt-4">{a.title}</h3>
              </div>
              <p className="u-lg text-[color:var(--color-bone)]/75 leading-snug lg:pt-2">
                {a.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof gallery */}
        <div className="mt-24 border-t border-[color:var(--color-line)] pt-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-2xl">
            <h3 className="u-xl">{socialProof.title}</h3>
            <p className="text-[color:var(--color-bone)]/60 mt-2">{socialProof.sub}</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-10 items-start"
          >
            {/* two portrait stories — full, uncropped, staggered */}
            <StoryCard src={socialProof.stories[0].src} who={socialProof.stories[0].who} />
            <StoryCard src={socialProof.stories[1].src} who={socialProof.stories[1].who} className="lg:mt-14" />
            {/* two wide "liked your reel" notifications */}
            <div className="col-span-2 flex flex-col gap-4 lg:gap-6 lg:pt-6">
              <LikeCard src={socialProof.likes[0].src} who={socialProof.likes[0].who} />
              <LikeCard src={socialProof.likes[1].src} who={socialProof.likes[1].who} className="lg:ml-10" />
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

function StoryCard({ src, who, className = '' }: { src: string; who: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <motion.figure
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-ink-2)] select-none ${className}`}
    >
      {ok ? (
        <img src={src} alt={who} onError={() => setOk(false)} draggable={false}
          className="block w-full h-auto pointer-events-none" />
      ) : (
        <div className="aspect-[9/16] grid place-items-center text-center px-3">
          <span className="u-label-sm text-[color:var(--color-bone)]/40">{who}<br /><span className="text-[color:var(--color-bone)]/25">скриншот скоро</span></span>
        </div>
      )}
    </motion.figure>
  )
}

function LikeCard({ src, who, className = '' }: { src: string; who: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <motion.figure
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-white/[0.04] select-none p-2 ${className}`}
    >
      {ok ? (
        <img src={src} alt={who} onError={() => setOk(false)} draggable={false}
          className="block w-full h-auto rounded-lg pointer-events-none" />
      ) : (
        <div className="h-20 grid place-items-center text-center">
          <span className="u-label-sm text-[color:var(--color-bone)]/40">{who} · скриншот скоро</span>
        </div>
      )}
    </motion.figure>
  )
}
