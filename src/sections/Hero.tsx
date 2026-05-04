import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { stagger, fadeUp, maskReveal } from '@lib/motion'
import WireCluster from '@components/WireCluster'

const categories = ['AI Ролики', 'Фэшн-видео', 'Брендовый контент', 'Кино-нарративы']

function MagneticButton({
  children,
  className,
  style,
  onClick,
  radius = 70,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  radius?: number
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const bx = useMotionValue(0)
  const by = useMotionValue(0)
  const sx = useSpring(bx, { stiffness: 300, damping: 22 })
  const sy = useSpring(by, { stiffness: 300, damping: 22 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.45
        bx.set(dx * pull)
        by.set(dy * pull)
      } else {
        bx.set(0)
        by.set(0)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [bx, by, radius])

  return (
    <motion.button
      ref={ref}
      style={{ ...style, x: sx, y: sy }}
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [showScroll, setShowScroll] = useState(true)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const overlayOp  = useTransform(scrollYProgress, [0, 1], [0.55, 0.82])

  useEffect(() => {
    const t = setTimeout(() => setShowScroll(false), 3500)
    return () => clearTimeout(t)
  }, [])

  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact  = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: '#02040A' }}
    >
      {/* Background video */}
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          src="/videos/main screen2.webm"
          autoPlay muted loop playsInline preload="auto"
        />
      </motion.div>

      {/* Scanlines HUD */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(2,4,10,0.08) 3px, rgba(2,4,10,0.08) 4px)',
        }}
      />

      {/* Scan-x sweep */}
      <motion.div
        className="absolute inset-y-0 w-px pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,209,255,0.15), transparent)' }}
        animate={{ x: ['-5vw', '105vw'] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 14, ease: 'linear' }}
      />

      {/* Breathing glow */}
      <motion.div
        className="absolute pointer-events-none z-[2]"
        style={{
          left: '50%', top: '45%',
          width: '70vw', height: '70vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,209,255,0.07) 0%, transparent 70%)',
          transform: 'translate(-50%,-50%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dark gradient overlay */}
      <motion.div
        className="absolute inset-0 z-[3]"
        style={{
          opacity: overlayOp,
          background: 'linear-gradient(to bottom, rgba(2,4,10,0.25) 0%, rgba(2,4,10,0.6) 60%, rgba(2,4,10,1) 100%)',
        }}
      />

      {/* Wire clusters — desktop only (2 RAF loops + heavy SVG filters) */}
      <div className="absolute inset-0 z-[4] pointer-events-none hidden md:block">
        <WireCluster side="bottomLeft" className="bottom-0 left-0" />
        <WireCluster side="topRight"   className="top-0 right-0" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container-x w-full flex flex-col items-center text-center pb-8 md:pb-0"
        style={{ y: contentY }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Category tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-6 md:mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className="label border border-white/10 text-white/35 px-3.5 py-1.5 rounded-sm"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,209,255,0.02)' }}
              >
                {cat}
              </span>
            ))}
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              variants={maskReveal}
              className="font-display font-bold leading-[0.9] text-[var(--color-white)]"
              style={{ fontSize: 'clamp(2.6rem, 9vw, 8rem)' }}
            >
              Мы создаём
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6 md:mb-10">
            <motion.h1
              variants={maskReveal}
              className="font-display font-bold leading-[0.9]"
              style={{ fontSize: 'clamp(2.6rem, 9vw, 8rem)', color: 'rgba(0,209,255,0.9)' }}
            >
              миры.
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            className="label text-[var(--color-muted)] mb-6 md:mb-10 tracking-widest"
          >
            AI CINEMATIC PRODUCTION — SOFIA + MIKHAIL
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <MagneticButton
              onClick={scrollToProjects}
              className="label border border-white/18 text-white/50 px-8 py-3.5 rounded-sm"
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(0,209,255,0.04)',
              }}
            >
              Наши работы
            </MagneticButton>

            <MagneticButton
              onClick={scrollToContact}
              className="label px-8 py-3.5 rounded-sm font-semibold"
              style={{
                backgroundColor: '#00D1FF',
                color: '#02040A',
                boxShadow: '0 0 24px rgba(0,209,255,0.35)',
              }}
            >
              Обсудить проект
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ opacity: showScroll ? 1 : 0, y: showScroll ? 0 : 8 }}
        transition={{ duration: 0.6 }}
      >
        <span className="label text-white/25 text-[9px] tracking-[0.2em]">SCROLL</span>
        <motion.div
          className="w-px h-8 origin-top"
          style={{ background: 'linear-gradient(to bottom, rgba(0,209,255,0.6), transparent)' }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #02040A)' }}
      />
    </section>
  )
}
