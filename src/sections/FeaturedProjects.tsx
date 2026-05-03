import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoModal from '@components/VideoModal'
import { projects } from '@data/projects'
import type { Project } from '@data/projects'

// ── Constants ────────────────────────────────────────────────
const CATS = [
  { id: 'Коммерция',   label: 'Коммерция',   num: '01', color: '#00D1FF' },
  { id: 'Реализм',     label: 'Реализм',     num: '02', color: '#7FE7FF' },
  { id: 'Мультфильмы', label: 'Мультфильмы', num: '03', color: '#C9D3DC' },
  { id: 'Продукты',    label: 'Продукты',    num: '04', color: '#5BB8D4' },
] as const

type Cat = typeof CATS[number]

// ── Planet SVG ───────────────────────────────────────────────
function Planet({ color, size = 190 }: { color: string; size?: number }) {
  const id = color.replace('#', 'c')
  return (
    <svg width={size} height={size} viewBox="0 0 190 190" aria-hidden>
      <defs>
        <radialGradient id={`g${id}`} cx="38%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.5" />
          <stop offset="45%"  stopColor={color} stopOpacity="0.14" />
          <stop offset="100%" stopColor="#02040A" stopOpacity="1" />
        </radialGradient>
        <filter id={`f${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Glow ring */}
      <circle cx="95" cy="95" r="93" fill="none" stroke={color} strokeWidth="0.8"
        strokeOpacity="0.2" filter={`url(#f${id})`} />
      {/* Planet body */}
      <circle cx="95" cy="95" r="78" fill={`url(#g${id})`}
        stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Latitude lines */}
      <ellipse cx="95" cy="95"  rx="76" ry="23" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.10" />
      <ellipse cx="95" cy="78"  rx="55" ry="14" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.07" />
      <ellipse cx="95" cy="112" rx="65" ry="18" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.05" />
      {/* Highlight spot */}
      <ellipse cx="70" cy="65" rx="18" ry="12" fill={color} fillOpacity="0.06" />
    </svg>
  )
}

// ── Mini planet selector button ──────────────────────────────
function PlanetBtn({ cat, active, onClick }: { cat: Cat; active: boolean; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} className="flex flex-col items-center gap-2.5 shrink-0" whileTap={{ scale: 0.9 }}>
      <motion.div
        animate={{
          width: active ? 50 : 34,
          height: active ? 50 : 34,
          boxShadow: active
            ? `0 0 24px ${cat.color}55, 0 0 48px ${cat.color}18`
            : 'none',
          borderColor: active ? cat.color : cat.color + '40',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: '50%',
          border: '1px solid',
          background: `radial-gradient(circle at 38% 35%, ${cat.color}2a 0%, ${cat.color}08 60%, transparent 100%)`,
          position: 'relative',
        }}
      >
        {active && (
          <motion.div
            style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              border: `1px solid ${cat.color}20`, pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0.08, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
      <span
        className="label text-[9px] text-center leading-tight"
        style={{ color: active ? cat.color : 'rgba(255,255,255,0.28)', transition: 'color 0.4s', maxWidth: 60 }}
      >
        {cat.num} / {cat.label.toUpperCase()}
      </span>
    </motion.button>
  )
}

// ── Single orbiting thumbnail ────────────────────────────────
function OrbThumb({
  project, color, setRef, onPause, onClick,
}: {
  project: Project
  color: string
  setRef: (el: HTMLDivElement | null) => void
  onPause: (v: boolean) => void
  onClick: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (v && !v.src) { v.preload = 'metadata'; v.src = project.videoSrc }
  }, [project.videoSrc])

  const enter = () => { setHovered(true); onPause(true); videoRef.current?.play().catch(() => {}) }
  const leave = () => { setHovered(false); onPause(false); videoRef.current?.pause() }

  return (
    <div
      ref={setRef}
      onClick={onClick}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="cursor-pointer absolute"
      style={{ width: 156, height: 88, marginLeft: -78, marginTop: -44 }}
    >
      <div
        style={{
          width: '100%', height: '100%', borderRadius: 4, overflow: 'hidden',
          border: `1px solid ${hovered ? color + 'bb' : 'rgba(0,209,255,0.12)'}`,
          boxShadow: hovered
            ? `0 0 22px ${color}55, 0 8px 28px rgba(0,0,0,0.7)`
            : '0 4px 18px rgba(0,0,0,0.6)',
          backgroundColor: '#071B2B',
          transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          playsInline muted loop
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: ready ? (hovered ? 1 : 0.78) : 0.4,
            transition: 'opacity 0.4s',
          }}
          onLoadedMetadata={() => setReady(true)}
          onCanPlay={() => setReady(true)}
        />
        {/* Title overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(2,4,10,0.88) 0%, transparent 55%)',
            opacity: hovered ? 1 : 0, transition: 'opacity 0.25s',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', padding: '5px 7px',
          }}
        >
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, letterSpacing: '0.08em', color: '#E4EEF4', textTransform: 'uppercase', lineHeight: 1.4 }}>
            {project.title}
          </p>
        </div>
        {hovered && (
          <span style={{ position: 'absolute', top: 5, right: 7, fontFamily: 'Space Mono, monospace', fontSize: 8, color, letterSpacing: '0.06em' }}>
            PLAY ↗
          </span>
        )}
      </div>
    </div>
  )
}

// ── Orbital system — desktop ─────────────────────────────────
// Remounts (via key) on each category change, fresh RAF per instance
function OrbitalSystem({ cat, onOpen }: { cat: Cat; onOpen: (p: Project) => void }) {
  const catProjects = projects.filter(p => p.category === cat.id)
  const n = catProjects.length
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map())
  const timeRef  = useRef(0)
  const pauseRef = useRef(false)

  // Orbit geometry
  const rx = 270 + n * 8   // x-radius scales with number of videos
  const ry = 98            // y-radius: just enough to clear the planet

  useEffect(() => {
    let rafId: number
    let last: number | null = null

    const tick = (ts: number) => {
      if (last !== null && !pauseRef.current) {
        timeRef.current += (ts - last) * 0.00022   // slow rotation
      }
      last = ts

      catProjects.forEach((proj, i) => {
        const angle  = (2 * Math.PI * i / n) + timeRef.current
        const x      = Math.cos(angle) * rx
        const y      = Math.sin(angle) * ry
        const depth  = Math.sin(angle)             // -1 (back) → 1 (front)
        const scale  = 0.68 + (depth + 1) * 0.16  // 0.68 → 1.00
        const opacity = 0.4 + (depth + 1) * 0.30  // 0.40 → 1.00
        const el = cardEls.current.get(proj.id)
        if (el) {
          el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
          el.style.opacity   = String(+opacity.toFixed(2))
          el.style.zIndex    = String(Math.round(depth * 10 + 15))
        }
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative hidden md:flex items-center justify-center"
      style={{ height: 500 }}
    >
      {/* Orbit ellipse guide */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
        aria-hidden
      >
        <ellipse
          cx="50%" cy="50%"
          rx={rx} ry={ry}
          fill="none"
          stroke={cat.color}
          strokeWidth="1"
          strokeOpacity="0.09"
          strokeDasharray="5 9"
        />
      </svg>

      {/* Planet + breathing glow */}
      <div style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <Planet color={cat.color} />
        </motion.div>
        <motion.div
          style={{
            position: 'absolute', inset: '-35%', borderRadius: '50%',
            background: `radial-gradient(circle, ${cat.color}14 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Thumbnails — fade in slightly delayed so RAF can position them first */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {catProjects.map(proj => (
          <OrbThumb
            key={proj.id}
            project={proj}
            color={cat.color}
            setRef={el => el ? cardEls.current.set(proj.id, el) : cardEls.current.delete(proj.id)}
            onPause={v => { pauseRef.current = v }}
            onClick={() => onOpen(proj)}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

// ── Mobile card row ──────────────────────────────────────────
function MobileCard({ project, color, onOpen }: { project: Project; color: string; onOpen: (p: Project) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const v = videoRef.current
        if (v && !v.src) { v.preload = 'metadata'; v.src = project.videoSrc }
        obs.disconnect()
      }
    }, { threshold: 0.1, rootMargin: '80px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [project.videoSrc])

  return (
    <div
      ref={wrapRef}
      className="shrink-0 cursor-pointer relative overflow-hidden"
      style={{ width: 220, height: 124, borderRadius: 5, border: `1px solid ${color}22`, backgroundColor: '#071B2B' }}
      onClick={() => onOpen(project)}
    >
      <video
        ref={videoRef}
        playsInline muted loop
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: ready ? 0.82 : 0.4, transition: 'opacity 0.4s' }}
        onLoadedMetadata={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(2,4,10,0.82) 0%, transparent 100%)', padding: '6px 8px' }}>
        <p className="label text-[9px] text-white/70">{project.title}</p>
      </div>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────
export default function FeaturedProjects() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const cat = CATS[activeIdx]
  const catProjects = projects.filter(p => p.category === cat.id)

  return (
    <>
      <section id="projects" className="section-gap overflow-hidden">

        {/* Section header */}
        <div className="container-x mb-10">
          <p className="label text-[var(--color-muted)] mb-4">Избранное</p>
          <h2
            className="font-display font-bold text-[var(--color-white)]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
          >
            Наши работы
          </h2>
        </div>

        {/* Planet category selectors */}
        <div className="container-x flex items-start gap-6 sm:gap-10 mb-6 overflow-x-auto pb-2">
          {CATS.map((c, i) => (
            <PlanetBtn
              key={c.id}
              cat={c}
              active={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>

        {/* Orbital display — desktop */}
        <AnimatePresence mode="wait">
          <OrbitalSystem key={cat.id} cat={cat} onOpen={setActiveProject} />
        </AnimatePresence>

        {/* Card row — mobile */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-4" style={{ paddingLeft: 'var(--container-x)', paddingRight: 'var(--container-x)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id + '-mob'}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3"
            >
              {catProjects.map(proj => (
                <MobileCard key={proj.id} project={proj} color={cat.color} onOpen={setActiveProject} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Active category label */}
        <div className="container-x mt-6 md:mt-2 flex items-baseline justify-between">
          <AnimatePresence mode="wait">
            <motion.h3
              key={cat.id + '-lbl'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: cat.color }}
            >
              {cat.label}
            </motion.h3>
          </AnimatePresence>
          <span className="label text-[var(--color-dim)]">
            {catProjects.length.toString().padStart(2, '0')} видео
          </span>
        </div>

      </section>

      <VideoModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
