import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp, maskReveal } from '@lib/motion'

const categories = [
  'AI Commercials',
  'Fashion Visuals',
  'Branded Content',
  'Cinematic Storytelling',
]

export default function Hero() {
  const [showArrow, setShowArrow] = useState(true)

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

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col justify-end overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-loop.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.5) 50%, rgba(8,8,8,0.85) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-x pb-16 md:pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          transition={{ delayChildren: 0.5 }}
        >
          {/* Category tags */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-3 md:gap-4 mb-8 md:mb-10"
          >
            {categories.map((cat) => (
              <span
                key={cat}
                className="label border border-[rgba(240,237,230,0.2)] text-[var(--color-white)]/60 px-3 py-1"
              >
                {cat}
              </span>
            ))}
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              variants={maskReveal}
              className="font-display text-hero italic font-light leading-[0.92] text-[var(--color-white)]"
            >
              We build worlds
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8 md:mb-10">
            <motion.h1
              variants={maskReveal}
              className="font-display text-hero italic font-light leading-[0.92] text-[var(--color-white)]"
            >
              frame by frame.
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-[var(--text-sm)] md:text-base text-[var(--color-muted)] font-light tracking-wide mb-8 md:mb-10 max-w-sm"
          >
            AI-powered cinematic production studio.
            <br className="hidden md:block" />
            Sofia + Mikhail — mnd.team
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={scrollToProjects}
              className="label border border-[var(--color-white)]/30 hover:border-[var(--color-white)] text-[var(--color-white)] px-8 py-3.5 transition-all duration-300 text-center"
            >
              View Work
            </button>
            <button
              onClick={scrollToContact}
              className="label bg-[var(--color-accent)] hover:bg-[var(--color-white)] text-[var(--color-bg)] px-8 py-3.5 transition-all duration-300 text-center"
            >
              Discuss a Project
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: showArrow ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-6 right-6 md:right-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="label text-[var(--color-white)]/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[var(--color-white)]/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
