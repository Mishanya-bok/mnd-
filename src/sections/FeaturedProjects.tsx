import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoModal from '@components/VideoModal'
import { projects } from '@data/projects'
import type { Project } from '@data/projects'

const CATS = [
  { id: 'Коммерция',   label: 'Коммерция',   num: '01', color: '#00D1FF' },
  { id: 'Реализм',     label: 'Реализм',     num: '02', color: '#7FE7FF' },
  { id: 'Мультфильмы', label: 'Мультфильмы', num: '03', color: '#C9D3DC' },
  { id: 'Продукты',    label: 'Продукты',    num: '04', color: '#5BB8D4' },
] as const

type Cat = typeof CATS[number]

const slideVariants = {
  enter: (d: number) => ({ x: d >= 0 ? '32%' : '-32%', opacity: 0, scale: 0.88 }),
  center: { x: 0, opacity: 1, scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit: (d: number) => ({ x: d >= 0 ? '-32%' : '32%', opacity: 0, scale: 0.9,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }),
}

// ── True 3D planet SVG ───────────────────────────────────────
// Limb darkening + specular highlight + atmospheric rim + clipped bands
function Planet3D({ color, size = 300 }: { color: string; size?: number }) {
  const u = `${Math.round(size)}${color.replace(/[^0-9a-fA-F]/g, '')}`
  const c = size / 2
  const r = size * 0.43

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <defs>
        {/* Base colour — bright top-left, dark limb */}
        <radialGradient id={`B${u}`} cx="38%" cy="32%" r="72%">
          <stop offset="0%"   stopColor={color}    stopOpacity="0.70" />
          <stop offset="28%"  stopColor={color}    stopOpacity="0.30" />
          <stop offset="62%"  stopColor="#040d1a"  stopOpacity="0.88" />
          <stop offset="100%" stopColor="#02040A"  stopOpacity="1"    />
        </radialGradient>

        {/* Limb darkening — darkens sphere edges */}
        <radialGradient id={`L${u}`} cx="50%" cy="50%" r="50%">
          <stop offset="52%"  stopColor="transparent" />
          <stop offset="80%"  stopColor="#000" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.80" />
        </radialGradient>

        {/* Specular — bright spot upper-left */}
        <radialGradient id={`S${u}`} cx="35%" cy="30%" r="38%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.22" />
          <stop offset="55%"  stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0"    />
        </radialGradient>

        {/* Clip surface bands to sphere */}
        <clipPath id={`C${u}`}><circle cx={c} cy={c} r={r} /></clipPath>

        {/* Soft atmosphere blur */}
        <filter id={`A${u}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={size * 0.044} />
        </filter>

        {/* Deep glow */}
        <filter id={`G${u}`} x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation={size * 0.072} result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer deep glow halo */}
      <circle cx={c} cy={c} r={r * 1.24}
        fill={color} fillOpacity="0.045" filter={`url(#G${u})`} />

      {/* Atmospheric rim */}
      <circle cx={c} cy={c} r={r * 1.07}
        fill="none" stroke={color} strokeWidth={r * 0.12}
        strokeOpacity="0.22" filter={`url(#A${u})`} />

      {/* Planet body */}
      <circle cx={c} cy={c} r={r} fill={`url(#B${u})`} />

      {/* Surface latitude bands — clipped to sphere */}
      <g clipPath={`url(#C${u})`}>
        {/* Bright equatorial belt */}
        <ellipse cx={c} cy={c + r * 0.04} rx={r * 0.97} ry={r * 0.09}
          fill={color} fillOpacity="0.055" />
        {/* Main bands */}
        <ellipse cx={c} cy={c}            rx={r * 0.97} ry={r * 0.26}
          fill="none" stroke={color} strokeWidth="1.0" strokeOpacity="0.15" />
        <ellipse cx={c} cy={c - r * 0.26} rx={r * 0.82} ry={r * 0.17}
          fill="none" stroke={color} strokeWidth="0.6" strokeOpacity="0.10" />
        <ellipse cx={c} cy={c + r * 0.32} rx={r * 0.88} ry={r * 0.20}
          fill="none" stroke={color} strokeWidth="0.7" strokeOpacity="0.09" />
        <ellipse cx={c} cy={c - r * 0.48} rx={r * 0.62} ry={r * 0.13}
          fill="none" stroke={color} strokeWidth="0.45" strokeOpacity="0.07" />
        <ellipse cx={c} cy={c + r * 0.57} rx={r * 0.72} ry={r * 0.11}
          fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.055" />
      </g>

      {/* Limb darkening overlay */}
      <circle cx={c} cy={c} r={r} fill={`url(#L${u})`} />

      {/* Specular highlight */}
      <circle cx={c} cy={c} r={r} fill={`url(#S${u})`} />

      {/* Edge atmosphere halo */}
      <circle cx={c} cy={c} r={r}
        fill="none" stroke={color} strokeWidth="2.5"
        strokeOpacity="0.38" filter={`url(#A${u})`} />
    </svg>
  )
}

// ── Mini planet selector ─────────────────────────────────────
function PlanetBtn({ cat, active, onClick }: { cat: Cat; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 shrink-0"
      whileTap={{ scale: 0.88 }}
    >
      <motion.div
        animate={{ scale: active ? 1 : 0.65, opacity: active ? 1 : 0.40 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative' }}
      >
        <Planet3D color={cat.color} size={76} />
        {active && (
          <motion.div
            style={{
              position: 'absolute', inset: -10, borderRadius: '50%',
              border: `1px solid ${cat.color}28`, pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.38, 1], opacity: [0.65, 0.07, 0.65] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
      <span
        className="label text-[9px] text-center leading-tight"
        style={{ color: active ? cat.color : 'rgba(255,255,255,0.28)', transition: 'color 0.4s', maxWidth: 68 }}
      >
        {cat.num} / {cat.label.toUpperCase()}
      </span>
    </motion.button>
  )
}

// ── Arrow button ─────────────────────────────────────────────
function ArrowBtn({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center justify-center shrink-0"
      whileHover={{ borderColor: 'rgba(0,209,255,0.75)', color: '#00D1FF',
        boxShadow: '0 0 18px rgba(0,209,255,0.28)' }}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 54, height: 54, borderRadius: '50%',
        border: '1px solid rgba(0,209,255,0.2)',
        background: 'rgba(7,27,43,0.65)',
        backdropFilter: 'blur(14px)',
        color: 'rgba(255,255,255,0.42)',
        fontSize: 20,
        transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
      }}
    >
      {dir === 'left' ? '←' : '→'}
    </motion.button>
  )
}

// ── Single orbiting video thumbnail ─────────────────────────
function OrbThumb({ project, color, setRef, onPause, onClick }: {
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
      style={{ width: 232, height: 130, marginLeft: -116, marginTop: -65 }}
    >
      <div style={{
        width: '100%', height: '100%', borderRadius: 5, overflow: 'hidden',
        border: `1px solid ${hovered ? color + 'cc' : 'rgba(0,209,255,0.14)'}`,
        boxShadow: hovered
          ? `0 0 28px ${color}58, 0 10px 36px rgba(0,0,0,0.78)`
          : '0 5px 22px rgba(0,0,0,0.65)',
        backgroundColor: '#071B2B',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        position: 'relative',
      }}>
        <video
          ref={videoRef}
          playsInline muted loop
          style={{ width: '100%', height: '100%', objectFit: 'cover',
            opacity: ready ? (hovered ? 1 : 0.80) : 0.4, transition: 'opacity 0.4s' }}
          onLoadedMetadata={() => setReady(true)}
          onCanPlay={() => setReady(true)}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,4,10,0.9) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.25s',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '7px 10px',
        }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
            color: '#E4EEF4', textTransform: 'uppercase', lineHeight: 1.4, maxWidth: 210 }}>
            {project.title}
          </p>
        </div>
        {hovered && (
          <span style={{ position: 'absolute', top: 6, right: 9, fontFamily: 'Space Mono, monospace',
            fontSize: 9, color, letterSpacing: '0.06em' }}>
            PLAY ↗
          </span>
        )}
      </div>
    </div>
  )
}

// ── Orbital system — desktop ─────────────────────────────────
// Each instance gets fresh RAF loop; AnimatePresence key remounts on category change
function OrbitalSystem({ cat, direction, onOpen }: {
  cat: Cat; direction: number; onOpen: (p: Project) => void
}) {
  const catProjects = projects.filter(p => p.category === cat.id)
  const n = catProjects.length
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map())
  const timeRef  = useRef(0)
  const pauseRef = useRef(false)
  const rx = 315 + n * 6
  const ry = 122

  useEffect(() => {
    let rafId: number
    let last: number | null = null
    const tick = (ts: number) => {
      if (last !== null && !pauseRef.current) timeRef.current += (ts - last) * 0.00022
      last = ts
      catProjects.forEach((proj, i) => {
        const angle = (2 * Math.PI * i / n) + timeRef.current
        const x     = Math.cos(angle) * rx
        const y     = Math.sin(angle) * ry
        const depth = Math.sin(angle)
        const el    = cardEls.current.get(proj.id)
        if (el) {
          el.style.transform = `translate(${x}px, ${y}px) scale(${+(0.68 + (depth + 1) * 0.16).toFixed(3)})`
          el.style.opacity   = String(+(0.40 + (depth + 1) * 0.30).toFixed(2))
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
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="relative hidden md:flex items-center justify-center flex-1"
      style={{ height: 590 }}
    >
      {/* Orbit guide ellipse */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }} aria-hidden>
        <ellipse cx="50%" cy="50%" rx={rx} ry={ry}
          fill="none" stroke={cat.color} strokeWidth="1"
          strokeOpacity="0.10" strokeDasharray="6 10" />
      </svg>

      {/* 3D planet + breathing glow */}
      <div style={{ position: 'relative', zIndex: 20, pointerEvents: 'none' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        >
          <Planet3D color={cat.color} size={308} />
        </motion.div>
        <motion.div
          style={{
            position: 'absolute', inset: '-38%', borderRadius: '50%',
            background: `radial-gradient(circle, ${cat.color}12 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Thumbnails — fade in after first RAF tick positions them */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

// ── Mobile card ──────────────────────────────────────────────
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
      style={{ width: 226, height: 127, borderRadius: 5, border: `1px solid ${color}22`, backgroundColor: '#071B2B' }}
      onClick={() => onOpen(project)}
    >
      <video
        ref={videoRef}
        playsInline muted loop
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: ready ? 0.82 : 0.4, transition: 'opacity 0.4s' }}
        onLoadedMetadata={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px',
        background: 'linear-gradient(to top, rgba(2,4,10,0.82) 0%, transparent 100%)' }}>
        <p className="label text-[9px] text-white/70">{project.title}</p>
      </div>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────
export default function FeaturedProjects() {
  const [[activeIdx, direction], setState] = useState<[number, number]>([0, 0])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const cat = CATS[activeIdx]
  const catProjects = projects.filter(p => p.category === cat.id)

  const goNext = () =>
    setState(([i]) => [(i + 1) % CATS.length, 1] as [number, number])
  const goPrev = () =>
    setState(([i]) => [(i + CATS.length - 1) % CATS.length, -1] as [number, number])

  return (
    <>
      <section id="projects" className="section-gap overflow-hidden">

        {/* Header */}
        <div className="container-x mb-10">
          <p className="label text-[var(--color-muted)] mb-4">Избранное</p>
          <h2 className="font-display font-bold text-[var(--color-white)]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
            Наши работы
          </h2>
        </div>

        {/* Mini 3D planet selectors */}
        <div className="container-x flex items-start gap-6 sm:gap-10 mb-4 overflow-x-auto pb-2">
          {CATS.map((c, i) => (
            <PlanetBtn
              key={c.id}
              cat={c}
              active={i === activeIdx}
              onClick={() => setState(([cur]) => [i, i > cur ? 1 : -1] as [number, number])}
            />
          ))}
        </div>

        {/* Orbital display + arrows (desktop) */}
        <div className="relative">
          <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
            <ArrowBtn dir="left" onClick={goPrev} />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <OrbitalSystem
              key={cat.id}
              cat={cat}
              direction={direction}
              onOpen={setActiveProject}
            />
          </AnimatePresence>

          <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
            <ArrowBtn dir="right" onClick={goNext} />
          </div>
        </div>

        {/* Mobile card row */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-4"
          style={{ paddingLeft: 'var(--container-x)', paddingRight: 'var(--container-x)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id + '-mob'}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="flex gap-3"
            >
              {catProjects.map(proj => (
                <MobileCard key={proj.id} project={proj} color={cat.color} onOpen={setActiveProject} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile arrows */}
        <div className="md:hidden container-x flex items-center justify-between mt-5">
          <button onClick={goPrev} className="label text-white/40 px-3 py-2">← Назад</button>
          <span className="label text-[var(--color-muted)]">{activeIdx + 1} / {CATS.length}</span>
          <button onClick={goNext} className="label text-white/40 px-3 py-2">Далее →</button>
        </div>

        {/* Active category label */}
        <div className="container-x mt-6 md:mt-3 flex items-baseline justify-between">
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
