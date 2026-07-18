import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '@data/projects'

interface Props {
  project: Project | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ project, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose, onNext, onPrev])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-[color:var(--color-ink)]/92 backdrop-blur-sm" onClick={onClose} />

          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-11 h-11 grid place-items-center rounded-full border border-white/15 hover:bg-white/10 transition-colors u-label-sm"
          >✕</button>

          <motion.div
            key={project.id}
            className="relative z-[1] w-full max-w-5xl"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative mx-auto rounded-2xl overflow-hidden border border-[color:var(--color-line)] bg-black"
              style={{ maxHeight: '74vh', aspectRatio: project.aspect === '9:16' ? '9/16' : '16/9', width: project.aspect === '9:16' ? 'min(100%, 42vh)' : '100%' }}
            >
              <video
                className="w-full h-full object-contain bg-black"
                src={project.src}
                poster={project.poster}
                autoPlay
                loop
                controls
                playsInline
              />
            </div>

            <div className="flex items-center justify-between gap-6 mt-5">
              <div>
                <p className="u-label-sm text-[color:var(--color-bone)]/60">{project.category} · {project.year}</p>
                <h3 className="u-xl mt-2">{project.title}</h3>
              </div>
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <button onClick={onPrev} aria-label="Назад" className="w-11 h-11 grid place-items-center rounded-full border border-white/15 hover:bg-white/10 transition-colors">←</button>
                <button onClick={onNext} aria-label="Вперёд" className="w-11 h-11 grid place-items-center rounded-full border border-white/15 hover:bg-white/10 transition-colors">→</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
