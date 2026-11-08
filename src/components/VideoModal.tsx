import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Project } from '@data/projects'
import { modalBackdrop, modalPanel } from '@lib/motion'

interface VideoModalProps {
  project: Project | null
  onClose: () => void
}

export default function VideoModal({ project, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-5xl z-10"
            variants={modalPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-[var(--color-muted)] hover:text-[var(--color-white)] transition-colors duration-200 flex items-center gap-2"
              aria-label="Закрыть"
            >
              <span className="label">Закрыть</span>
              <X size={16} strokeWidth={1.5} />
            </button>

            {/* Video — full size, not cropped */}
            <div className="relative w-full bg-black overflow-hidden">
              <video
                ref={videoRef}
                src={project.videoSrc}
                controls
                autoPlay
                playsInline
                className="w-full h-auto max-h-[72vh] object-contain"
              />
            </div>

            {/* Meta */}
            <div className="pt-5 pb-4 bg-black/60 px-5 rounded-b-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="label text-[var(--color-accent)]">{project.category}</span>
                <span className="label text-white/20">·</span>
                <span className="label text-white/35">{project.year}</span>
              </div>
              <h2 className="font-display text-[1.6rem] font-semibold text-[var(--color-white)] mb-3">{project.title}</h2>
              <p className="text-sm text-white/60 font-light leading-relaxed max-w-2xl">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/08">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="label border border-white/12 px-3 py-1 rounded-full text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
