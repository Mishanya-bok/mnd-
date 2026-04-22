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
      {/* Video / thumbnail container */}
      <div
        className="relative overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/30 transition-colors duration-500"
        style={{ aspectRatio: isWide ? '16/9' : '4/5' }}
      >
        {/* Static gradient background — always visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#222] to-[#111]" />

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '256px',
          }}
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

        {/* Dark scrim over video when playing */}
        <div
          className={`absolute inset-0 bg-[var(--color-bg)]/20 transition-opacity duration-500 ${
            videoLoaded && hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Index number — always visible, large and dim */}
        <span
          className="absolute top-5 left-5 font-display italic font-light leading-none select-none pointer-events-none transition-opacity duration-500"
          style={{
            fontSize: isWide ? '5rem' : '4rem',
            color: hovered ? 'rgba(201,168,108,0.15)' : 'rgba(240,237,230,0.07)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Project title + meta — always visible bottom */}
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

        {/* Play indicator — appears on hover */}
        <div
          className={`absolute bottom-5 right-5 flex items-center gap-2 transition-all duration-400 ${
            hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <span className="label text-[var(--color-white)]">Play</span>
          <span className="w-5 h-px bg-[var(--color-white)]" />
        </div>

        {/* Thin accent left border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500"
          style={{
            background: hovered
              ? 'var(--color-accent)'
              : 'rgba(240,237,230,0.08)',
          }}
        />
      </div>

      {/* Bottom space */}
      <div className="pb-2" />
    </motion.div>
  )
}
