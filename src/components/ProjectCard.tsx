import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  onClick: (project: Project) => void
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const videoRef     = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [hovered, setHovered]       = useState(false)
  const isWide = index === 0

  // Inject src when card enters viewport → loads first frame as thumbnail
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const v = videoRef.current
          if (v && !v.src) {
            v.preload = 'metadata'
            v.src = project.videoSrc
          }
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [project.videoSrc])

  const handleMouseEnter = () => {
    setHovered(true)
    const v = videoRef.current
    if (!v) return
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
    v.muted = true
    v.play().catch(() => {})
  }

  return (
    <motion.div
      ref={containerRef}
      className="group cursor-pointer"
      onClick={() => onClick(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: isWide ? '16/9' : '4/5' }}
        animate={{
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,209,255,0.35)'
            : '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Dark video bg */}
        <div className="absolute inset-0 bg-[#02040A]" />

        {/* Video — thumbnail at 65% opacity, full on hover */}
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          className="absolute inset-0 w-full h-full transition-opacity duration-500"
          style={{
            objectFit: 'contain',
            opacity: videoReady ? (hovered ? 1 : 0.65) : 0,
          }}
          onLoadedMetadata={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.3) 100%)' }}
        />

        {/* Bottom frosted title overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 z-10 transition-all duration-400"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 65%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="label transition-colors duration-300" style={{ color: hovered ? '#00D1FF' : 'rgba(255,255,255,0.5)' }}>
              {project.category}
            </span>
            <span className="label" style={{ color: 'rgba(255,255,255,0.22)' }}>{project.year}</span>
          </div>
          <p
            className="font-display font-semibold leading-tight transition-colors duration-300"
            style={{ fontSize: isWide ? '1.6rem' : '1.25rem', color: hovered ? '#00D1FF' : '#fff' }}
          >
            {project.title}
          </p>
          <motion.p
            className="text-xs text-white/65 font-light leading-relaxed mt-2"
            style={{ maxWidth: '38ch' }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.description}
          </motion.p>
        </div>

        {/* Play indicator */}
        <motion.div
          className="absolute top-5 right-5 flex items-center gap-2 z-10"
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="label text-white/80">Смотреть</span>
          <span className="w-5 h-px bg-white/80" />
        </motion.div>

        {/* Decorative index */}
        <span
          className="absolute top-5 left-5 font-display font-semibold leading-none select-none pointer-events-none transition-all duration-500"
          style={{
            fontSize: isWide ? '4.5rem' : '3.5rem',
            color: hovered ? 'rgba(0,209,255,0.12)' : 'rgba(255,255,255,0.05)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Gold accent left bar */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
          animate={{ opacity: hovered ? 1 : 0, scaleY: hovered ? 1 : 0.2 }}
          style={{ backgroundColor: '#00D1FF', transformOrigin: 'center' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
      <div className="pb-1" />
    </motion.div>
  )
}
