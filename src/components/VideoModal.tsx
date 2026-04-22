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
            <div className="pt-5 pb-2 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="label">{project.category}</span>
                  <span className="label text-[var(--color-dim)]">·</span>
                  <span className="label text-[var(--color-dim)]">{project.year}</span>
                </div>
                <h2 className="font-display text-[1.6rem] italic font-light">{project.title}</h2>
              </div>
              <p className="text-[var(--text-sm)] text-[var(--color-muted)] font-light leading-relaxed max-w-md">
                {project.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--color-border)]">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="label border border-[var(--color-border)] px-3 py-1 text-[var(--color-dim)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
