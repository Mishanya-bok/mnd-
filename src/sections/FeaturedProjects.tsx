import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import VideoModal from '@components/VideoModal'
import { projects } from '@data/projects'
import type { Project } from '@data/projects'

const CATEGORIES = [
  { id: 'Коммерция',  label: 'Коммерция',  num: '01' },
  { id: 'Реализм',    label: 'Реализм',    num: '02' },
  { id: 'Мультфильм', label: 'Мультфильм', num: '03' },
  { id: 'Предметное', label: 'Предметное', num: '04' },
]

// ── Video card ────────────────────────────────────────────────

function VideoCard({ project, onClick }: { project: Project; onClick: (p: Project) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [ready, setReady]     = useState(false)

  // Inject src when card enters viewport → shows first frame as thumbnail
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const v = videoRef.current
          if (v && !v.src) { v.preload = 'metadata'; v.src = project.videoSrc }
          obs.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [project.videoSrc])

  const handleEnter = () => {
    setHovered(true)
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }
  const handleLeave = () => {
    setHovered(false)
    videoRef.current?.pause()
  }

  return (
    <div
      ref={wrapRef}
      className="group shrink-0 cursor-pointer"
      style={{ width: 'clamp(280px, 28vw, 420px)' }}
      onClick={() => onClick(project)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Video container */}
      <motion.div
        className="relative overflow-hidden"
        style={{ aspectRatio: '16/9' }}
        animate={{
          boxShadow: hovered
            ? '0 0 0 1px rgba(74,158,255,0.5), 0 24px 48px rgba(0,0,0,0.7)'
            : '0 0 0 1px rgba(74,158,255,0.1)',
          scale: hovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Dark bg while video loads */}
        <div className="absolute inset-0" style={{ backgroundColor: '#06080f' }} />

        <video
          ref={videoRef}
          playsInline muted loop
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', opacity: ready ? (hovered ? 1 : 0.72) : 0, transition: 'opacity 0.4s' }}
          onLoadedMetadata={() => setReady(true)}
          onCanPlay={() => setReady(true)}
        />

        {/* Bottom gradient on hover */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: 'linear-gradient(to top, rgba(6,8,15,0.75) 0%, transparent 55%)' }}
        />

        {/* Play / watch indicator */}
        <motion.div
          className="absolute top-3 right-4 label text-white/80 text-[10px]"
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
          transition={{ duration: 0.25 }}
        >
          PLAY ↗
        </motion.div>

        {/* Blue accent line — slides in from left on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          animate={{ scaleX: hovered ? 1 : 0 }}
          style={{ backgroundColor: '#4a9eff', transformOrigin: 'left', boxShadow: '0 0 10px rgba(74,158,255,0.7)' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* Title row */}
      <div className="mt-3 px-0.5">
        <p className="label text-[10px] text-[var(--color-dim)] mb-1">{project.category} · {project.year}</p>
        <h3
          className="font-display font-semibold leading-tight transition-colors duration-300"
          style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)', color: hovered ? '#4a9eff' : 'var(--color-white)' }}
        >
          {project.title}
        </h3>
      </div>
    </div>
  )
}

// ── Category horizontal reel ──────────────────────────────────

function CategoryReel({
  cat,
  onOpen,
}: {
  cat: typeof CATEGORIES[0]
  onOpen: (p: Project) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const xVal       = useMotionValue(0)
  const [maxShift, setMaxShift] = useState(0)

  const catProjects = projects.filter(p => p.category === cat.id)

  // Calculate how far to slide based on track width vs viewport
  useLayoutEffect(() => {
    const compute = () => {
      if (!trackRef.current) return
      const trackW = trackRef.current.scrollWidth
      const vw     = window.innerWidth
      const pad    = Math.max(20, vw * 0.05)
      setMaxShift(Math.max(0, trackW - vw + pad))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [catProjects.length])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Drive the motion value directly from scroll
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      xVal.set(-v * maxShift)
    })
  }, [scrollYProgress, maxShift, xVal])

  const headerOp = useTransform(scrollYProgress, [0, 0.06], [0, 1])
  const headerY  = useTransform(scrollYProgress, [0, 0.06], [20, 0])

  // Give each section enough height: 200vh base + extra per card
  const sectionH = `${200 + catProjects.length * 40}vh`

  return (
    <section
      ref={sectionRef}
      id={`cat-${cat.id.toLowerCase()}`}
      style={{ height: sectionH }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-8 md:gap-10">

        {/* Category header */}
        <motion.div
          className="container-x flex items-baseline gap-4 md:gap-6"
          style={{ opacity: headerOp, y: headerY }}
        >
          <span className="font-mono text-[11px] text-[var(--color-accent)] tracking-widest">{cat.num} _</span>
          <h2
            className="font-display font-bold text-[var(--color-white)]"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}
          >
            {cat.label}
          </h2>
          <span className="ml-auto font-mono text-[11px] text-[var(--color-dim)]">
            {catProjects.length.toString().padStart(2, '0')} видео
          </span>
        </motion.div>

        {/* Horizontal track */}
        <div className="overflow-visible" style={{ paddingLeft: 'var(--container-x)' }}>
          <motion.div
            ref={trackRef}
            style={{ x: xVal }}
            className="flex gap-5 md:gap-6 will-change-transform"
          >
            {catProjects.map(project => (
              <VideoCard key={project.id} project={project} onClick={onOpen} />
            ))}
          </motion.div>
        </div>

        {/* Scroll progress indicator */}
        <div className="container-x">
          <div className="h-px w-full bg-[rgba(74,158,255,0.1)] relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{
                scaleX: scrollYProgress,
                transformOrigin: 'left',
                backgroundColor: '#4a9eff',
                boxShadow: '0 0 6px rgba(74,158,255,0.6)',
              }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}

// ── Main section ──────────────────────────────────────────────

export default function FeaturedProjects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <>
      {/* Section title */}
      <div id="projects" className="container-x pt-24 pb-12 md:pt-32 md:pb-16">
        <p className="label text-[var(--color-muted)] mb-4">Избранное</p>
        <h2
          className="font-display font-bold text-[var(--color-white)]"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
        >
          Наши работы
        </h2>
      </div>

      {CATEGORIES.map(cat => (
        <CategoryReel key={cat.id} cat={cat} onOpen={setActiveProject} />
      ))}

      <VideoModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
