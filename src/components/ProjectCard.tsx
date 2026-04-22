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
    if (!v.src) v.src = project.videoSrc
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

  const isWide = index === 0

  return (
    <motion.div
      variants={scaleIn}
      className="group cursor-pointer"
      onClick={() => onClick(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Video container — shows video fully (object-contain), no crop */}
      <div
        className="relative overflow-hidden border border-[var(--color-border)] transition-colors duration-500"
        style={{
          aspectRatio: isWide ? '16/9' : '4/5',
          borderColor: hovered ? 'rgba(201,168,108,0.4)' : undefined,
        }}
      >
        {/* Static gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#222] to-[#111]" />

        {/* Video — object-contain so it's fully visible */}
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          preload="none"
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            videoLoaded && hovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit: 'contain' }}
          onCanPlay={() => setVideoLoaded(true)}
        />

        {/* Index number */}
        <span
          className="absolute top-5 left-5 font-display italic font-light leading-none select-none pointer-events-none transition-opacity duration-500"
          style={{
            fontSize: isWide ? '5rem' : '4rem',
            color: hovered ? 'rgba(201,168,108,0.12)' : 'rgba(240,237,230,0.07)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title overlay — always visible at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="flex items-center gap-3 mb-1.5">
            <span
              className="label transition-colors duration-300"
              style={{ color: hovered ? 'rgba(201,168,108,0.9)' : 'rgba(240,237,230,0.5)' }}
            >
              {project.category}
            </span>
            <span className="label" style={{ color: 'rgba(240,237,230,0.25)' }}>
              {project.year}
            </span>
          </div>
          <p
            className="font-display italic font-light leading-tight transition-colors duration-300"
            style={{
              fontSize: isWide ? '1.7rem' : '1.3rem',
              color: hovered ? '#c9a86c' : '#f0ede6',
            }}
          >
            {project.title}
          </p>
        </div>

        {/* Play indicator */}
        <div
          className={`absolute top-5 right-5 flex items-center gap-2 transition-all duration-300 ${
            hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <span className="label text-[var(--color-white)]">Смотреть</span>
          <span className="w-5 h-px bg-[var(--color-white)]" />
        </div>

        {/* Thin accent left border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500"
          style={{ background: hovered ? 'var(--color-accent)' : 'rgba(240,237,230,0.08)' }}
        />
      </div>

      <div className="pb-2" />
    </motion.div>
  )
}
