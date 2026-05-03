import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { stagger, fadeUp, maskReveal } from '@lib/motion'

const categories = ['AI Ролики', 'Фэшн-видео', 'Брендовый контент', 'Кино-нарративы']

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentY   = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const overlayOp  = useTransform(scrollYProgress, [0, 1], [0.55, 0.82])

  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact  = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: '#06080f' }}
    >
      {/* Background video — autoplay loop, parallax on scroll */}
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          src="/videos/hero-loop.webm"
          autoPlay muted loop playsInline preload="auto"
        />
      </motion.div>

      {/* Scanlines overlay — alien HUD texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(6,8,15,0.06) 3px, rgba(6,8,15,0.06) 4px)',
        }}
      />

      {/* Dark gradient overlay — intensifies on scroll */}
      <motion.div
        className="absolute inset-0 z-[2]"
        style={{
          opacity: overlayOp,
          background: 'linear-gradient(to bottom, rgba(6,8,15,0.3) 0%, rgba(6,8,15,0.65) 60%, rgba(6,8,15,1) 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 container-x w-full flex flex-col items-center text-center pb-16 md:pb-0"
        style={{ y: contentY }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Category tags — monospace pill labels */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <motion.span
                key={cat}
                whileHover={{ borderColor: 'rgba(74,158,255,0.8)', color: '#4a9eff', backgroundColor: 'rgba(74,158,255,0.07)' }}
                transition={{ duration: 0.18 }}
                className="label border border-white/15 text-white/40 px-3.5 py-1.5 rounded-full"
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              variants={maskReveal}
              className="font-display font-bold leading-[0.9] text-white"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
            >
              Мы создаём
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              variants={maskReveal}
              className="font-display font-bold leading-[0.9]"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', color: 'rgba(74,158,255,0.9)' }}
            >
              миры.
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            className="label text-white/35 mb-10 tracking-widest"
          >
            AI CINEMATIC PRODUCTION — SOFIA + MIKHAIL
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={scrollToProjects}
              whileHover={{ borderColor: 'rgba(74,158,255,0.7)', color: '#4a9eff', scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="label border border-white/20 text-white/55 px-8 py-3.5 rounded-full"
            >
              Наши работы
            </motion.button>
            <motion.button
              onClick={scrollToContact}
              whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(74,158,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="label px-8 py-3.5 rounded-full font-semibold"
              style={{ backgroundColor: '#4a9eff', color: '#06080f' }}
            >
              Обсудить проект
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, transparent, #06080f)' }}
      />
    </section>
  )
}
