import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { stagger, fadeUp, maskReveal } from '@lib/motion'

const categories = [
  'AI Ролики',
  'Фэшн-видео',
  'Брендовый контент',
  'Кино-нарративы',
]

export default function Hero() {
  const [showArrow, setShowArrow] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Mouse parallax
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const contentX = useSpring(rawX, { stiffness: 80, damping: 20 })
  const contentY = useSpring(rawY, { stiffness: 80, damping: 20 })
  const bgX = useTransform(contentX, v => -v * 0.4)
  const bgY = useTransform(contentY, v => -v * 0.4)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    rawX.set(x * 22)
    rawY.set(y * 14)
  }
  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background video — moves opposite to cursor */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bgX, y: bgY, scale: 1.04 }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-loop.webm"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.15) 0%, rgba(8,8,8,0.45) 50%, rgba(8,8,8,0.8) 100%)',
        }}
      />

      {/* Centered content — moves toward cursor */}
      <motion.div
        className="relative z-10 container-x w-full flex flex-col items-center text-center"
        style={{ x: contentX, y: contentY }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Category tags */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10"
          >
            {categories.map((cat) => (
              <motion.span
                key={cat}
                whileHover={{ scale: 1.08, borderColor: 'rgba(201,168,108,0.9)', color: '#f0ede6', backgroundColor: 'rgba(201,168,108,0.08)' }}
                transition={{ duration: 0.22 }}
                className="label border border-[rgba(240,237,230,0.2)] text-[var(--color-white)]/60 px-3 py-1 cursor-default"
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              variants={maskReveal}
              className="font-display text-hero italic font-light leading-[0.92] text-[var(--color-white)]"
            >
              Мы создаём миры
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8 md:mb-10">
            <motion.h1
              variants={maskReveal}
              className="font-display text-hero italic font-light leading-[0.92] text-[var(--color-white)]"
            >
              кадр за кадром.
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-[var(--text-sm)] md:text-base text-[var(--color-muted)] font-light tracking-wide mb-8 md:mb-10"
          >
            Кинематографический AI-продакшен.{' '}
            <span className="text-[var(--color-white)]/40">София + Михаил — mnd.team</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={scrollToProjects}
              whileHover={{ borderColor: 'rgba(240,237,230,1)', color: '#f0ede6', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="label border border-[var(--color-white)]/30 text-[var(--color-white)] px-8 py-3.5 text-center"
            >
              Наши работы
            </motion.button>
            <motion.button
              onClick={scrollToContact}
              whileHover={{ backgroundColor: '#f0ede6', color: '#080808', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="label bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3.5 text-center"
            >
              Обсудить проект
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: showArrow ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="label text-[var(--color-white)]/30">Скролл</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[var(--color-white)]/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}
