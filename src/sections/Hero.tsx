import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { maskReveal, fadeUp, stagger } from '@lib/motion'
import { asset } from '@lib/asset'

const HEAD = ['Cinematic.', 'Commercial.', 'Crafted.']
const STATS = [
  { v: '50+', l: 'Projects delivered' },
  { v: '2', l: 'Creators, one vision' },
  { v: 'AI', l: 'Certified workflow' },
]

export default function Hero() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 120, damping: 22, mass: 0.4 })
  const px = useTransform(sx, [-0.5, 0.5], [-11, 11])
  const py = useTransform(sy, [-0.5, 0.5], [-9, 9])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top) / r.height - 0.5)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center pt-28 pb-16 md:pt-24">
      <div className="container-x w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-10 items-center">
        {/* LEFT — typography */}
        <div>
          <motion.p
            className="u-label text-[color:var(--color-bone)]/70 mb-7"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            AI-Driven Visual Duo
          </motion.p>

          <h1 className="u-mega">
            {HEAD.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  variants={maskReveal}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 + i * 0.09 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-md text-[color:var(--color-bone)]/75 u-lg leading-snug"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            We build AI-driven visuals for brands and artists —
            with a director’s eye and production polish.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.7 }}
          >
            <a
              href="#work"
              className="inline-flex items-center gap-3 bg-[color:var(--color-ink)] text-[color:var(--color-bone)] u-label px-7 py-4 rounded-full hover:bg-black transition-colors"
            >
              See Our Work
              <span aria-hidden>→</span>
            </a>
            <span className="u-label-sm text-[color:var(--color-bone)]/55">AI + Production Studio</span>
          </motion.div>

          <motion.dl
            className="mt-14 grid grid-cols-3 gap-6 max-w-lg"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {STATS.map((s) => (
              <motion.div key={s.l} variants={fadeUp} className="border-t border-[color:var(--color-line)] pt-3">
                <dt className="u-display leading-none">{s.v}</dt>
                <dd className="u-label-sm text-[color:var(--color-bone)]/55 mt-2">{s.l}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* RIGHT — main video, framed */}
        <motion.div
          className="relative"
          style={{ x: px, y: py }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-[color:var(--color-line)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]">
            <video
              className="w-full aspect-[4/5] object-cover"
              src={asset('/videos/main.mp4')}
              poster={asset('/videos/main.jpg')}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </div>
          <span className="absolute -bottom-3 left-5 u-label-sm bg-[color:var(--color-ink)] px-3 py-1.5 rounded-full">
            Reel ’26
          </span>
        </motion.div>
      </div>
    </section>
  )
}
