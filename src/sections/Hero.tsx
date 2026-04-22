import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { stagger, fadeUp, maskReveal } from '@lib/motion'

const categories = ['AI Ролики', 'Фэшн-видео', 'Брендовый контент', 'Кино-нарративы']

export default function Hero() {
  const [showArrow, setShowArrow] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setShowArrow(false), 4000)
    return () => clearTimeout(t)
  }, [])

  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact  = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const contentX = useSpring(rawX, { stiffness: 80, damping: 20 })
  const contentY = useSpring(rawY, { stiffness: 80, damping: 20 })
  const bgX = useTransform(contentX, v => -v * 0.4)
  const bgY = useTransform(contentY, v => -v * 0.4)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 22)
    rawY.set(((e.clientY - rect.top - rect.height / 2) / rect.height) * 14)
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#080808' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0) }}
    >
      {/* Background video */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY, scale: 1.04 }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-loop.webm"
          autoPlay muted loop playsInline preload="auto"
        />
      </motion.div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.5) 60%, rgba(8,8,8,0.92) 100%)' }}
      />

      {/* Content */}
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
          {/* Tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
            {categories.map((cat) => (
              <motion.span
                key={cat}
                whileHover={{ scale: 1.08, borderColor: 'rgba(201,168,108,0.9)', color: '#ffffff', backgroundColor: 'rgba(201,168,108,0.1)' }}
                transition={{ duration: 0.2 }}
                className="label border border-white/20 text-white/55 px-3 py-1.5 rounded-full cursor-default backdrop-blur-sm"
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-1">
            <motion.h1 variants={maskReveal} className="font-display text-hero font-semibold leading-[0.92] text-white">
              Мы создаём миры
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8 md:mb-10">
            <motion.h1 variants={maskReveal} className="font-display text-hero font-semibold leading-[0.92] text-white/80">
              кадр за кадром.
            </motion.h1>
          </div>

          <motion.p variants={fadeUp} className="text-sm md:text-base text-white/45 font-light tracking-wide mb-8 md:mb-10">
            Кинематографический AI-продакшен.{' '}
            <span className="text-white/30">София + Михаил — mnd.team</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={scrollToProjects}
              whileHover={{ borderColor: 'rgba(255,255,255,0.8)', color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="label border border-white/25 text-white/70 px-8 py-3.5 rounded-full backdrop-blur-sm"
            >
              Наши работы
            </motion.button>
            <motion.button
              onClick={scrollToContact}
              whileHover={{ backgroundColor: '#fff', color: '#080808', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="label bg-[#c9a86c] text-[#080808] px-8 py-3.5 rounded-full"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="label text-white/25">Скролл</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>

      {/* Gradient fade to dark background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #080808)' }}
      />
    </section>
  )
}
