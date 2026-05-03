import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { stagger, fadeUp, maskReveal } from '@lib/motion'

const categories = ['AI Ролики', 'Фэшн-видео', 'Брендовый контент', 'Кино-нарративы']

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Scrub video playback with scroll position
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    return scrollYProgress.on('change', (v) => {
      if (video.duration > 0) video.currentTime = v * video.duration
    })
  }, [scrollYProgress])

  const contentOpacity    = useTransform(scrollYProgress, [0, 0.2, 0.75, 0.95], [1, 1, 0.4, 0])
  const contentY          = useTransform(scrollYProgress, [0, 1], [0, -80])
  const progressBarWidth  = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const arrowOpacity      = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  const scrollToProjects = () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact  = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    // Tall section gives scroll space for video scrubbing
    <section ref={sectionRef} style={{ height: '300vh' }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-end md:justify-center"
        style={{ backgroundColor: '#06080f' }}
      >
        {/* Background video — frame controlled by scroll */}
        <video
          ref={videoRef}
          src="/videos/hero-loop.webm"
          preload="auto"
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Mobile overlay — clear at top so video is visible */}
        <div
          className="absolute inset-0 md:hidden pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(6,8,15,0.05) 0%, rgba(6,8,15,0.1) 35%, rgba(6,8,15,0.88) 60%, rgba(6,8,15,0.97) 100%)' }}
        />
        {/* Desktop overlay */}
        <div
          className="absolute inset-0 hidden md:block pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(6,8,15,0.2) 0%, rgba(6,8,15,0.55) 60%, rgba(6,8,15,0.95) 100%)' }}
        />

        {/* Content fades and moves up as scroll progresses */}
        <motion.div
          className="relative z-10 container-x w-full flex flex-col items-center text-center pb-20 md:pb-0"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Category tags */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
              {categories.map((cat) => (
                <motion.span
                  key={cat}
                  whileHover={{ scale: 1.08, borderColor: 'rgba(74,158,255,0.9)', color: '#fff', backgroundColor: 'rgba(74,158,255,0.1)' }}
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
                whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(74,158,255,0.45)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="label px-8 py-3.5 rounded-full"
                style={{ backgroundColor: '#4a9eff', color: '#06080f' }}
              >
                Обсудить проект
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator — fades out after first scroll */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: arrowOpacity }}
        >
          <span className="label text-white/25">Скролл</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
          />
        </motion.div>

        {/* Electric blue scroll progress bar at bottom edge */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] z-30"
          style={{
            width: progressBarWidth,
            backgroundColor: '#4a9eff',
            boxShadow: '0 0 10px rgba(74,158,255,0.7)',
          }}
        />

        {/* Fade to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to bottom, transparent, #06080f)' }}
        />
      </div>
    </section>
  )
}
