import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn } from '@lib/motion'

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
            v.src = '/videos/showreel.webm'
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
    /* Sticky scroll container: 2x viewport height */
    <div ref={sectionRef} className="relative" style={{ height: '200vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          preload="none"
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.35) 50%, rgba(8,8,8,0.65) 100%)' }}
        />

        {/* Play button */}
        <AnimatePresence>
          {!playing && (
            <motion.button
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              onClick={handlePlay}
              aria-label="Play showreel"
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10"
            >
              {/* Circle + triangle */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border border-[var(--color-white)]/50 flex items-center justify-center hover:border-[var(--color-white)] transition-colors duration-300">
                <svg
                  width="18"
                  height="22"
                  viewBox="0 0 18 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path d="M1 1L17 11L1 21V1Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="label text-[var(--color-white)]/60">Смотреть шоурил</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute bottom-8 left-0 right-0 container-x flex items-end justify-between z-10">
          <span className="label text-[var(--color-white)]/40">
            mnd. — Трейлер 2025
          </span>
          {playing && (
            <button
              onClick={() => {
                const v = videoRef.current
                if (v) { v.pause(); v.currentTime = 0 }
                setPlaying(false)
              }}
              className="label text-[var(--color-white)]/40 hover:text-[var(--color-white)] transition-colors duration-200"
            >
              Стоп
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
