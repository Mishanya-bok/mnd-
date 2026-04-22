import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

export default function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)

  /* Lazy-load: inject src when section enters viewport */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loaded) {
          const v = videoRef.current
          if (v && !v.src) {
            v.src = '/videos/mnd-movie.webm'
            v.load()
          }
          setLoaded(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [loaded])

  const handlePlay = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
    setPlaying(true)
  }

  return (
    <section ref={sectionRef} id="showreel" className="section-gap container-x">
      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <motion.p variants={fadeUp} className="label mb-3">
            Трейлер
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display italic font-light"
            >
              mnd. — Фильм
            </motion.h2>
          </div>
        </div>
        <motion.p
          variants={fadeUp}
          className="text-sm text-[var(--color-muted)] font-light max-w-xs leading-relaxed"
        >
          Трейлер к полнометражному кинематографическому проекту студии.
        </motion.p>
      </motion.div>

      {/* Video container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative overflow-hidden border border-[var(--color-border)] hover:border-[rgba(201,168,108,0.3)] transition-colors duration-500"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />

        <video
          ref={videoRef}
          preload="none"
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />

        {/* Overlay gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${playing ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.5) 100%)' }}
        />

        {/* Play button */}
        <AnimatePresence>
          {!playing && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
              onClick={handlePlay}
              aria-label="Смотреть трейлер"
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
            >
              <motion.div
                whileHover={{ scale: 1.1, borderColor: 'rgba(201,168,108,0.9)' }}
                transition={{ duration: 0.25 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[var(--color-white)]/40 flex items-center justify-center"
              >
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                  <path d="M1 1L17 11L1 21V1Z" fill="white" fillOpacity="0.9" />
                </svg>
              </motion.div>
              <span className="label text-[var(--color-white)]/50">Смотреть трейлер</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Stop button when playing */}
        {playing && (
          <button
            onClick={() => {
              const v = videoRef.current
              if (v) { v.pause(); v.currentTime = 0 }
              setPlaying(false)
            }}
            className="absolute bottom-5 right-5 label text-[var(--color-white)]/40 hover:text-[var(--color-white)] transition-colors duration-200 z-10"
          >
            Стоп
          </button>
        )}

        {/* Corner label */}
        <span className="absolute bottom-5 left-5 label text-[var(--color-white)]/30 z-10">
          mnd. — 2025
        </span>

        {/* Thin accent left border on hover */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500 group-hover:bg-[var(--color-accent)] bg-transparent"
        />
      </motion.div>
    </section>
  )
}
