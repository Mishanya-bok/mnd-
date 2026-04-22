import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { scaleIn } from '@lib/motion'
import type { Project } from '@data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  onClick: (project: Project) => void
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
    const v = videoRef.current
    if (!v) return
    if (!v.src) {
      v.src = project.videoSrc
    }
    v.muted = true
    v.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    setHovered(false)
    videoRef.current?.pause()
  }

  const handleTouchStart = () => {
    const v = videoRef.current
    if (!v) return
    if (!v.src) v.src = project.videoSrc
    v.muted = true
    v.play().catch(() => {})
  }

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      className="group cursor-pointer"
      onClick={() => onClick(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Video container */}
      <div
        className="relative overflow-hidden bg-[var(--color-surface)]"
        style={{ aspectRatio: index % 3 === 0 ? '16/9' : '4/5' }}
      >
        {/* Gradient placeholder */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] transition-opacity duration-500 ${
            videoLoaded && hovered ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoLoaded && hovered ? 'opacity-100' : 'opacity-0'
          }`}
          onCanPlay={() => setVideoLoaded(true)}
        />

        {/* Overlay on idle */}
        <div
          className={`absolute inset-0 bg-[var(--color-bg)]/40 transition-opacity duration-500 ${
            hovered ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Index number decoration */}
        <span
          className="absolute top-4 left-4 font-display text-[4rem] font-light italic leading-none select-none pointer-events-none"
          style={{ color: 'rgba(240,237,230,0.06)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Play indicator */}
        <div
          className={`absolute bottom-4 right-4 label text-[var(--color-white)] flex items-center gap-2 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span>Play</span>
          <span className="w-4 h-px bg-[var(--color-white)]" />
        </div>
      </div>

      {/* Meta */}
      <div className="pt-4 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="label">{project.category}</span>
          <span className="label text-[var(--color-dim)]">{project.year}</span>
        </div>
        <h3
          className="font-display text-[1.4rem] md:text-[1.7rem] italic font-light text-[var(--color-white)] group-hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          {project.title}
        </h3>
      </div>
    </motion.div>
  )
}
