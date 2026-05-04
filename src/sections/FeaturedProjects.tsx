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

// SLOTS: index 0 = active center, 1 = right bg, 2 = far top, 3 = left bg
const SLOTS = [
  { x: 0,    y: 0,    scale: 1.00, opacity: 1.00, z: 20 },
  { x: 300,  y: -20,  scale: 0.21, opacity: 0.52, z: 10 },
  { x: 50,   y: -205, scale: 0.14, opacity: 0.32, z: 8  },
  { x: -288, y: 25,   scale: 0.18, opacity: 0.44, z: 10 },
]

const ORB_RX   = 290
const ORB_RY   = 88
const PSIZE    = 480  // active planet diameter

// ── True 3D planet SVG ───────────────────────────────────────
function Planet3D({ color, size = 300 }: { color: string; size?: number }) {
  const u = `p${Math.round(size)}${color.replace(/[^0-9a-fA-F]/g, '')}`
  const c = size / 2
  const r = size * 0.43

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`B${u}`} cx="38%" cy="32%" r="72%">
          <stop offset="0%"   stopColor={color}   stopOpacity="0.75" />
          <stop offset="30%"  stopColor={color}   stopOpacity="0.35" />
          <stop offset="65%"  stopColor="#040d1a" stopOpacity="0.90" />
          <stop offset="100%" stopColor="#02040A" stopOpacity="1"    />
        </radialGradient>
        <radialGradient id={`L${u}`} cx="50%" cy="50%" r="50%">
          <stop offset="50%"  stopColor="transparent" />
          <stop offset="78%"  stopColor="#000" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.84" />
        </radialGradient>
        <radialGradient id={`S${u}`} cx="34%" cy="29%" r="36%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.28" />
          <stop offset="50%"  stopColor="#fff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0"    />
        </radialGradient>
        <radialGradient id={`AT${u}`} cx="50%" cy="50%" r="50%">
          <stop offset="72%"  stopColor="transparent" />
          <stop offset="88%"  stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </radialGradient>
        <clipPath id={`C${u}`}><circle cx={c} cy={c} r={r} /></clipPath>
        <filter id={`AF${u}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={size * 0.042} />
        </filter>
        <filter id={`GF${u}`} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation={size * 0.095} result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer glow halo */}
      <circle cx={c} cy={c} r={r * 1.28}
        fill={color} fillOpacity="0.055" filter={`url(#GF${u})`} />
      {/* Atmospheric rim */}
      <circle cx={c} cy={c} r={r * 1.09}
        fill="none" stroke={color} strokeWidth={r * 0.13}
        strokeOpacity="0.24" filter={`url(#AF${u})`} />
      {/* Planet body */}
      <circle cx={c} cy={c} r={r} fill={`url(#B${u})`} />
      {/* Surface latitude bands */}
      <g clipPath={`url(#C${u})`}>
        <ellipse cx={c} cy={c + r * 0.04} rx={r * 0.97} ry={r * 0.09}
          fill={color} fillOpacity="0.06" />
        <ellipse cx={c} cy={c}            rx={r * 0.97} ry={r * 0.26}
          fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.17" />
        <ellipse cx={c} cy={c - r * 0.26} rx={r * 0.82} ry={r * 0.17}
          fill="none" stroke={color} strokeWidth="0.7" strokeOpacity="0.11" />
        <ellipse cx={c} cy={c + r * 0.32} rx={r * 0.88} ry={r * 0.20}
          fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.10" />
        <ellipse cx={c} cy={c - r * 0.48} rx={r * 0.62} ry={r * 0.13}
          fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.08" />
        <ellipse cx={c} cy={c + r * 0.57} rx={r * 0.72} ry={r * 0.11}
          fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.055" />
      </g>
      {/* Limb darkening */}
      <circle cx={c} cy={c} r={r} fill={`url(#L${u})`} />
      {/* Specular highlight */}
      <circle cx={c} cy={c} r={r} fill={`url(#S${u})`} />
      {/* Inner atmosphere */}
      <circle cx={c} cy={c} r={r} fill={`url(#AT${u})`} />
      {/* Edge atmosphere stroke */}
      <circle cx={c} cy={c} r={r}
        fill="none" stroke={color} strokeWidth="2.8"
        strokeOpacity="0.42" filter={`url(#AF${u})`} />
    </svg>
  )
}

// ── Sci-fi decorative layer (zero-size SVG at scene center) ──
function SciFiDecor({ color }: { color: string }) {
  const nodes = [0, 60, 120, 180, 240, 300]

  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', zIndex: 14, pointerEvents: 'none' }}>
      <svg width="0" height="0" style={{ overflow: 'visible' }} aria-hidden>
        {/* Primary orbit ring */}
        <ellipse cx="0" cy="0" rx={ORB_RX} ry={ORB_RY}
          fill="none" stroke={color} strokeWidth="0.8"
          strokeOpacity="0.24" strokeDasharray="8 14" />

        {/* Tilted decorative ring 1 */}
        <ellipse cx="0" cy="0" rx={ORB_RX * 0.76} ry={ORB_RY * 0.36}
          fill="none" stroke={color} strokeWidth="0.5"
          strokeOpacity="0.10" strokeDasharray="4 18"
          transform="rotate(-22)" />

        {/* Tilted decorative ring 2 */}
        <ellipse cx="0" cy="0" rx={ORB_RX * 0.88} ry={ORB_RY * 0.18}
          fill="none" stroke={color} strokeWidth="0.4"
          strokeOpacity="0.08" strokeDasharray="3 22"
          transform="rotate(66)" />

        {/* Equatorial ring around active planet */}
        <ellipse cx="0" cy="0" rx={PSIZE * 0.54} ry={PSIZE * 0.08}
          fill="none" stroke={color} strokeWidth="1.0" strokeOpacity="0.28" />
        <ellipse cx="0" cy="3" rx={PSIZE * 0.54} ry={PSIZE * 0.08}
          fill="none" stroke="#000" strokeWidth="1.2" strokeOpacity="0.20" />

        {/* HUD corner bracket — top-left */}
        <path d={`M ${-ORB_RX * 0.82} ${-ORB_RY * 1.95} l 0 -18 l 14 0`}
          fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.48" strokeLinecap="square" />
        <path d={`M ${-ORB_RX * 0.82 + 26} ${-ORB_RY * 1.95 - 18} l 10 0 l 0 8`}
          fill="none" stroke={color} strokeWidth="0.6" strokeOpacity="0.22" strokeLinecap="square" />

        {/* HUD corner bracket — top-right */}
        <path d={`M ${ORB_RX * 0.82} ${-ORB_RY * 1.95} l 0 -18 l -14 0`}
          fill="none" stroke={color} strokeWidth="1.2" strokeOpacity="0.48" strokeLinecap="square" />
        <path d={`M ${ORB_RX * 0.82 - 26} ${-ORB_RY * 1.95 - 18} l -10 0 l 0 8`}
          fill="none" stroke={color} strokeWidth="0.6" strokeOpacity="0.22" strokeLinecap="square" />

        {/* HUD corner bracket — bottom-left */}
        <path d={`M ${-ORB_RX * 0.60} ${ORB_RY * 2.15} l 0 14 l 12 0`}
          fill="none" stroke={color} strokeWidth="1.0" strokeOpacity="0.36" strokeLinecap="square" />

        {/* HUD corner bracket — bottom-right */}
        <path d={`M ${ORB_RX * 0.60} ${ORB_RY * 2.15} l 0 14 l -12 0`}
          fill="none" stroke={color} strokeWidth="1.0" strokeOpacity="0.36" strokeLinecap="square" />

        {/* Crosshair lines */}
        <line x1="0" y1={-ORB_RY * 3.0} x2="0" y2={ORB_RY * 3.0}
          stroke={color} strokeWidth="0.4" strokeOpacity="0.05" strokeDasharray="2 12" />
        <line x1={-ORB_RX * 1.45} y1="0" x2={ORB_RX * 1.45} y2="0"
          stroke={color} strokeWidth="0.4" strokeOpacity="0.05" strokeDasharray="2 12" />

        {/* Diamond accent — left */}
        <polygon
          points={`${-ORB_RX - 28},0 ${-ORB_RX - 18},-7 ${-ORB_RX - 8},0 ${-ORB_RX - 18},7`}
          fill={color} fillOpacity="0.32"
          stroke={color} strokeWidth="0.7" strokeOpacity="0.60" />

        {/* Diamond accent — right */}
        <polygon
          points={`${ORB_RX + 28},0 ${ORB_RX + 18},-7 ${ORB_RX + 8},0 ${ORB_RX + 18},7`}
          fill={color} fillOpacity="0.32"
          stroke={color} strokeWidth="0.7" strokeOpacity="0.60" />

        {/* Pulsing data nodes on orbit */}
        {nodes.map(deg => {
          const rad = (deg * Math.PI) / 180
          const nx = Math.cos(rad) * ORB_RX
          const ny = Math.sin(rad) * ORB_RY
          return (
            <motion.circle
              key={deg}
              cx={nx} cy={ny}
              r={deg === 0 || deg === 180 ? 3.5 : 2.0}
              fill={color}
              animate={{ opacity: [0.45, 1.0, 0.45] }}
              transition={{
                duration: 2.4 + deg * 0.006,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: deg * 0.008,
              }}
            />
          )
        })}

        {/* Technical readout labels */}
        <text
          x={ORB_RX * 0.68} y={-ORB_RY * 1.82}
          fontFamily="Space Mono, monospace" fontSize="8.5"
          fill={color} fillOpacity="0.40" letterSpacing="0.08em"
        >
          ORBIT / ACTIVE
        </text>
        <text
          x={ORB_RX * 0.68} y={-ORB_RY * 1.82 + 13}
          fontFamily="Space Mono, monospace" fontSize="7"
          fill={color} fillOpacity="0.22" letterSpacing="0.06em"
        >
          SYS:MND-PORTFOLIO
        </text>
        <text
          x={-ORB_RX * 1.10} y={ORB_RY * 2.35}
          fontFamily="Space Mono, monospace" fontSize="7.5"
          fill={color} fillOpacity="0.28" letterSpacing="0.07em"
        >
          2026·v2
        </text>

        {/* Scanning line */}
        <motion.g
          animate={{ translateY: [ORB_RY * -2.6, ORB_RY * 2.6] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', delay: 2.5 }}
        >
          <motion.line
            x1={-ORB_RX * 1.2} y1="0" x2={ORB_RX * 1.2} y2="0"
            stroke={color} strokeWidth="0.6"
            animate={{ strokeOpacity: [0, 0.16, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', delay: 2.5 }}
          />
        </motion.g>
      </svg>
    </div>
  )
}

// ── Arrow button ─────────────────────────────────────────────
function ArrowBtn({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center justify-center"
      whileHover={{ borderColor: 'rgba(0,209,255,0.75)', color: '#00D1FF',
        boxShadow: '0 0 20px rgba(0,209,255,0.32)' }}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 52, height: 52, borderRadius: '50%',
        border: '1px solid rgba(0,209,255,0.22)',
        background: 'rgba(7,27,43,0.60)',
        backdropFilter: 'blur(16px)',
        color: 'rgba(255,255,255,0.42)',
        fontSize: 20,
        cursor: 'pointer',
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

  const enter = () => { setHovered(true); onPause(true);  videoRef.current?.play().catch(() => {}) }
  const leave = () => { setHovered(false); onPause(false); videoRef.current?.pause() }

  return (
    <div
      ref={setRef}
      onClick={onClick}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="cursor-pointer absolute"
      style={{ width: 240, height: 135, marginLeft: -120, marginTop: -67 }}
    >
      <div style={{
        width: '100%', height: '100%', borderRadius: 5, overflow: 'hidden',
        border: `1px solid ${hovered ? color + 'cc' : 'rgba(0,209,255,0.16)'}`,
        boxShadow: hovered
          ? `0 0 32px ${color}50, 0 12px 40px rgba(0,0,0,0.82)`
          : '0 5px 24px rgba(0,0,0,0.72)',
        backgroundColor: '#071B2B',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
        position: 'relative',
      }}>
        <video
          ref={videoRef}
          playsInline muted loop
          onLoadedMetadata={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover',
            opacity: ready ? (hovered ? 1 : 0.80) : 0.4, transition: 'opacity 0.4s' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,4,10,0.90) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.25s',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '7px 10px',
        }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.08em',
            color: '#E4EEF4', textTransform: 'uppercase', lineHeight: 1.4, maxWidth: 220 }}>
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

// ── Orbital system (thumbnails only) ────────────────────────
function OrbitalSystem({ cat, onOpen }: { cat: Cat; onOpen: (p: Project) => void }) {
  const catProjects = projects.filter(p => p.category === cat.id)
  const n = catProjects.length
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map())
  const timeRef  = useRef(0)
  const pauseRef = useRef(false)

  useEffect(() => {
    let rafId: number
    let last: number | null = null

    const tick = (ts: number) => {
      if (last !== null && !pauseRef.current) timeRef.current += (ts - last) * 0.00022
      last = ts
      catProjects.forEach((proj, i) => {
        const angle = (2 * Math.PI * i / n) + timeRef.current
        const x     = Math.cos(angle) * ORB_RX
        const y     = Math.sin(angle) * ORB_RY
        const depth = Math.sin(angle)
        const scale = 0.72 + (depth + 1) * 0.14
        const el    = cardEls.current.get(proj.id)
        if (el) {
          el.style.transform = `translate(${x}px, ${y}px) scale(${scale.toFixed(3)})`
          el.style.opacity   = (0.42 + (depth + 1) * 0.29).toFixed(2)
          el.style.zIndex    = String(Math.round(depth * 10 + 18))
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
  )
}

// ── Mobile card ──────────────────────────────────────────────
function MobileCard({ project, color, onOpen }: {
  project: Project; color: string; onOpen: (p: Project) => void
}) {
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
      style={{ width: 226, height: 127, borderRadius: 5,
        border: `1px solid ${color}22`, backgroundColor: '#071B2B' }}
      onClick={() => onOpen(project)}
    >
      <video
        ref={videoRef}
        playsInline muted loop
        onLoadedMetadata={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover',
          opacity: ready ? 0.82 : 0.4, transition: 'opacity 0.4s' }}
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
  const [activeIdx, setActiveIdx] = useState(0)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const cat = CATS[activeIdx]
  const catProjects = projects.filter(p => p.category === cat.id)

  const goNext = () => setActiveIdx(i => (i + 1) % CATS.length)
  const goPrev = () => setActiveIdx(i => (i + CATS.length - 1) % CATS.length)

  const handlePlanetClick = (planetIdx: number) => {
    if (planetIdx !== activeIdx) setActiveIdx(planetIdx)
  }

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

        {/* ── Desktop: planetary scene ────────────────────────── */}
        <div
          className="relative hidden md:block overflow-hidden"
          style={{ height: 640 }}
        >
          {/* Deep ambient glow tied to active category color */}
          <motion.div
            key={`glow-${cat.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 920, height: 520, borderRadius: '50%',
              background: `radial-gradient(ellipse, ${cat.color}09 0%, transparent 68%)`,
              pointerEvents: 'none', zIndex: 0,
            }}
          />

          {/* Sci-fi decorations — crossfade on category change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`decor-${cat.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
            >
              <SciFiDecor color={cat.color} />
            </motion.div>
          </AnimatePresence>

          {/* All 4 planets — SLOTS layout */}
          {CATS.map((c, i) => {
            const slot = (i - activeIdx + CATS.length) % CATS.length
            const pos  = SLOTS[slot]
            const isActive = slot === 0

            return (
              <motion.div
                key={c.id}
                style={{
                  position: 'absolute', left: '50%', top: '50%',
                  translateX: '-50%', translateY: '-50%',
                  cursor: isActive ? 'default' : 'pointer',
                  zIndex: pos.z,
                }}
                animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handlePlanetClick(i)}
              >
                <Planet3D color={c.color} size={PSIZE} />
              </motion.div>
            )
          })}

          {/* Background planet labels — positioned in scene space */}
          {CATS.map((c, i) => {
            const slot = (i - activeIdx + CATS.length) % CATS.length
            if (slot === 0) return null
            const pos = SLOTS[slot]
            const labelX = pos.x
            const labelY = pos.y + (PSIZE * pos.scale / 2) + 10

            return (
              <motion.div
                key={`lbl-${c.id}`}
                style={{
                  position: 'absolute', left: '50%', top: '50%',
                  translateX: '-50%',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 9.5,
                  letterSpacing: '0.10em',
                  color: c.color,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: pos.z + 1,
                }}
                animate={{ x: labelX, y: labelY, opacity: pos.opacity * 0.82 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              >
                {c.num} {c.label}
              </motion.div>
            )
          })}

          {/* Active planet breathing glow */}
          <motion.div
            style={{
              position: 'absolute', left: '50%', top: '50%',
              marginLeft: -(PSIZE * 0.75),
              marginTop:  -(PSIZE * 0.75),
              width:  PSIZE * 1.5,
              height: PSIZE * 1.5,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${cat.color}0d 0%, transparent 68%)`,
              pointerEvents: 'none', zIndex: 2,
            }}
            animate={{ scale: [1, 1.14, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Orbiting thumbnails — remount on category change to reset RAF */}
          <AnimatePresence>
            <OrbitalSystem key={activeIdx} cat={cat} onOpen={setActiveProject} />
          </AnimatePresence>

          {/* Arrow buttons */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40">
            <ArrowBtn dir="left" onClick={goPrev} />
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40">
            <ArrowBtn dir="right" onClick={goNext} />
          </div>
        </div>

        {/* ── Mobile: card row ─────────────────────────────────── */}
        <div
          className="md:hidden flex gap-3 overflow-x-auto pb-4"
          style={{ paddingLeft: 'var(--container-x)', paddingRight: 'var(--container-x)' }}
        >
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

        {/* Mobile navigation */}
        <div className="md:hidden container-x flex items-center justify-between mt-5">
          <button onClick={goPrev} className="label text-white/40 px-3 py-2">← Назад</button>
          <span className="label text-[var(--color-muted)]">{activeIdx + 1} / {CATS.length}</span>
          <button onClick={goNext} className="label text-white/40 px-3 py-2">Далее →</button>
        </div>

        {/* Active category label + count */}
        <div className="container-x mt-6 md:mt-4 flex items-baseline justify-between">
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
          <span className="label text-[var(--color-muted)]">
            {catProjects.length.toString().padStart(2, '0')} видео
          </span>
        </div>

      </section>

      <VideoModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
