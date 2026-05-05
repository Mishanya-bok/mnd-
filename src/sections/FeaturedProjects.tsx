import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Tracks viewport width for responsive scaling
function useWindowWidth() {
  const [width, setWidth] = useState(1280)
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return width
}
import VideoModal from '@components/VideoModal'
import { projects } from '@data/projects'
import type { Project } from '@data/projects'

const CATS = [
  { id: 'Коммерция',   label: 'Коммерция',   num: '01', color: '#F5A623', rim: '#FFD580' },
  { id: 'Реализм',     label: 'Реализм',     num: '02', color: '#00D1FF', rim: '#7FE7FF' },
  { id: 'Мультфильмы', label: 'Мультфильмы', num: '03', color: '#C471ED', rim: '#F64F59' },
  { id: 'Продукты',    label: 'Продукты',    num: '04', color: '#43B89C', rim: '#00F2C3' },
] as const

type Cat = typeof CATS[number]

const PLANET_SIZE = 560
const THUMB_W     = 320
const THUMB_H     = 180
const ORBIT_RX    = 478
const ORBIT_RY    = 190

// Resting positions for inactive planets (px offset from scene center)
const BG_SLOTS = [
  { x: -530, y: -115, scale: 0.230, opacity: 0.62, blur: 1.2 },
  { x:  510, y: -140, scale: 0.195, opacity: 0.55, blur: 1.6 },
  { x:  490, y:  112, scale: 0.215, opacity: 0.58, blur: 1.2 },
] as const

function getPlanetPos(idx: number, activeIdx: number) {
  if (idx === activeIdx) return { x: 0, y: 0, scale: 1, opacity: 1, blur: 0 }
  const slot = (idx - activeIdx + CATS.length) % CATS.length - 1
  return BG_SLOTS[slot]
}

// Compute label Y target based on planet scale and Y position
function getLabelY(pos: { y: number; scale: number }) {
  return pos.y - (PLANET_SIZE / 2) * pos.scale - 22
}

// ── Volumetric 3D planet SVG ──────────────────────────────────
// memo: prevents re-render of heavy SVG when activeIdx changes
// simple=true skips all feGaussianBlur filters — used for background planets to save GPU
const Planet3D = memo(function Planet3D({ color, rim, size = 300, simple = false }: { color: string; rim: string; size?: number; simple?: boolean }) {
  const uid = `p${Math.round(size)}${color.replace(/[^a-fA-F0-9]/g, '')}`
  const c = size / 2
  const r = size * 0.43

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible', display: 'block' }} aria-hidden>
      <defs>
        {/* Day-side base: bright spot top-left fading to near-black */}
        <radialGradient id={`B${uid}`} cx="34%" cy="28%" r="78%">
          <stop offset="0%"   stopColor="#fff"    stopOpacity="0.20" />
          <stop offset="12%"  stopColor={color}   stopOpacity="0.88" />
          <stop offset="42%"  stopColor={color}   stopOpacity="0.38" />
          <stop offset="68%"  stopColor="#050d1e" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#020309" stopOpacity="1"    />
        </radialGradient>
        {/* Subsurface scatter — warm inner halo on lit side */}
        <radialGradient id={`SS${uid}`} cx="36%" cy="32%" r="48%">
          <stop offset="0%"   stopColor={color}   stopOpacity="0.20" />
          <stop offset="70%"  stopColor={color}   stopOpacity="0.04" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        {/* Limb darkening — crushes sphere edges to black */}
        <radialGradient id={`L${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="50%"  stopColor="transparent" />
          <stop offset="76%"  stopColor="#000" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.92" />
        </radialGradient>
        {/* Specular highlight — tight bright spot */}
        <radialGradient id={`S${uid}`} cx="30%" cy="24%" r="32%">
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.55" />
          <stop offset="35%"  stopColor="#fff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0"    />
        </radialGradient>
        {/* Rim backlight — opposite side secondary color bleed */}
        <radialGradient id={`R${uid}`} cx="70%" cy="72%" r="44%">
          <stop offset="0%"   stopColor={rim}  stopOpacity="0.26" />
          <stop offset="60%"  stopColor={rim}  stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`C${uid}`}><circle cx={c} cy={c} r={r} /></clipPath>
        {!simple && <filter id={`Atm${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={size * 0.055} />
        </filter>}
        {!simple && <filter id={`Glo${uid}`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation={size * 0.13} />
        </filter>}
      </defs>

      {/* Deep outer corona — skip on background planets */}
      {!simple && <circle cx={c} cy={c} r={r * 1.72} fill={color} fillOpacity="0.024" filter={`url(#Glo${uid})`} />}
      {/* Atmospheric rim glow */}
      {!simple && <circle cx={c} cy={c} r={r * 1.11} fill="none" stroke={color}
        strokeWidth={r * 0.17} strokeOpacity="0.36" filter={`url(#Atm${uid})`} />}
      {/* Planet sphere */}
      <circle cx={c} cy={c} r={r} fill={`url(#B${uid})`} />

      {/* Surface detail — all clipped to sphere */}
      <g clipPath={`url(#C${uid})`}>
        <ellipse cx={c} cy={c + r * 0.04} rx={r * 0.96} ry={r * 0.08}
          fill={color} fillOpacity="0.09" />
        <ellipse cx={c} cy={c}            rx={r * 0.96} ry={r * 0.24}
          fill="none" stroke={color} strokeWidth="1.4" strokeOpacity="0.22" />
        <ellipse cx={c} cy={c - r * 0.24} rx={r * 0.80} ry={r * 0.15}
          fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.14" />
        <ellipse cx={c} cy={c + r * 0.30} rx={r * 0.86} ry={r * 0.18}
          fill="none" stroke={color} strokeWidth="0.9" strokeOpacity="0.12" />
        <ellipse cx={c} cy={c - r * 0.45} rx={r * 0.60} ry={r * 0.12}
          fill="none" stroke={color} strokeWidth="0.55" strokeOpacity="0.09" />
        <ellipse cx={c} cy={c + r * 0.54} rx={r * 0.70} ry={r * 0.10}
          fill="none" stroke={color} strokeWidth="0.45" strokeOpacity="0.07" />
        {/* Cloud wisps */}
        <ellipse cx={c + r * 0.18} cy={c - r * 0.12} rx={r * 0.32} ry={r * 0.055}
          fill={color} fillOpacity="0.07"
          transform={`rotate(10, ${c}, ${c})`} />
        <ellipse cx={c - r * 0.14} cy={c + r * 0.22} rx={r * 0.26} ry={r * 0.045}
          fill={color} fillOpacity="0.055"
          transform={`rotate(-7, ${c}, ${c})`} />
      </g>

      {/* Volumetric layers — subsurface/rim skipped on background planets */}
      {!simple && <circle cx={c} cy={c} r={r} fill={`url(#SS${uid})`} />}
      <circle cx={c} cy={c} r={r} fill={`url(#L${uid})`} />
      <circle cx={c} cy={c} r={r} fill={`url(#S${uid})`} />
      {!simple && <circle cx={c} cy={c} r={r} fill={`url(#R${uid})`} />}
      {/* Crisp atmospheric edge — filter only on active planet */}
      {!simple && <circle cx={c} cy={c} r={r} fill="none" stroke={color}
        strokeWidth="3.5" strokeOpacity="0.55" filter={`url(#Atm${uid})`} />}
      {simple && <circle cx={c} cy={c} r={r} fill="none" stroke={color}
        strokeWidth="2" strokeOpacity="0.35" />}
    </svg>
  )
})

// ── Orbital rings + sci-fi decorations ────────────────────────
function OrbitalRings({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }} aria-hidden>
      {/* Main orbit */}
      <ellipse cx="50%" cy="50%" rx={ORBIT_RX} ry={ORBIT_RY}
        fill="none" stroke={color} strokeWidth="0.9"
        strokeOpacity="0.14" strokeDasharray="8 14" />
      {/* Tilted ring A */}
      <g style={{ transform: 'rotate(-30deg)', transformOrigin: '50% 50%' }}>
        <ellipse cx="50%" cy="50%" rx={ORBIT_RX * 0.77} ry={ORBIT_RY * 1.65}
          fill="none" stroke={color} strokeWidth="0.5"
          strokeOpacity="0.07" strokeDasharray="4 20" />
      </g>
      {/* Tilted ring B */}
      <g style={{ transform: 'rotate(46deg)', transformOrigin: '50% 50%' }}>
        <ellipse cx="50%" cy="50%" rx={ORBIT_RX * 1.14} ry={ORBIT_RY * 0.50}
          fill="none" stroke={color} strokeWidth="0.5"
          strokeOpacity="0.07" strokeDasharray="3 24" />
      </g>
      {/* Inner rings */}
      <ellipse cx="50%" cy="50%" rx={ORBIT_RX * 0.38} ry={ORBIT_RY * 0.38}
        fill="none" stroke={color} strokeWidth="0.4"
        strokeOpacity="0.13" strokeDasharray="2 9" />
      <ellipse cx="50%" cy="50%" rx={ORBIT_RX * 0.55} ry={ORBIT_RY * 0.55}
        fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.07" />
      {/* Outer ring */}
      <ellipse cx="50%" cy="50%" rx={ORBIT_RX * 1.30} ry={ORBIT_RY * 1.30}
        fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.05" />
      {/* Tick marks on main orbit at 4 cardinal points (approximate) */}
      {/* right */}
      <line x1={`calc(50% + ${ORBIT_RX - 6}px)`} y1="50%"
            x2={`calc(50% + ${ORBIT_RX + 6}px)`} y2="50%"
        stroke={color} strokeWidth="1" strokeOpacity="0.30" />
      {/* left */}
      <line x1={`calc(50% - ${ORBIT_RX - 6}px)`} y1="50%"
            x2={`calc(50% - ${ORBIT_RX + 6}px)`} y2="50%"
        stroke={color} strokeWidth="1" strokeOpacity="0.30" />
    </svg>
  )
}

// ── HUD overlay ───────────────────────────────────────────────
function HUDOverlay({ color, catNum, count }: { color: string; catNum: string; count: number }) {
  const b = color + '55'
  const txt: React.CSSProperties = {
    fontFamily: 'Space Mono, monospace', fontSize: 9,
    letterSpacing: '0.10em', textTransform: 'uppercase',
    lineHeight: 1.7, pointerEvents: 'none',
  }
  return (
    <>
      <div style={{ position: 'absolute', top: 22, left: 22, width: 22, height: 22,
        borderTop: `1px solid ${b}`, borderLeft: `1px solid ${b}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 22, right: 22, width: 22, height: 22,
        borderTop: `1px solid ${b}`, borderRight: `1px solid ${b}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 22, left: 22, width: 22, height: 22,
        borderBottom: `1px solid ${b}`, borderLeft: `1px solid ${b}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 22, right: 22, width: 22, height: 22,
        borderBottom: `1px solid ${b}`, borderRight: `1px solid ${b}`, pointerEvents: 'none' }} />
      <div style={{ ...txt, position: 'absolute', top: 24, left: 52, color: color + '70' }}>
        <div>SYS · ORBITAL_VIEW</div>
        <div>CAT · {catNum}</div>
      </div>
      <div style={{ ...txt, position: 'absolute', top: 24, right: 52,
        color: color + '70', textAlign: 'right' }}>
        <div>{count.toString().padStart(2, '0')} OBJECTS</div>
        <div>STATUS · ACTIVE</div>
      </div>
      {/* Crosshair at center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', width: 14, height: 14, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 6, left: 0, width: '100%',
          height: 1, background: color + '28' }} />
        <div style={{ position: 'absolute', left: 6, top: 0, height: '100%',
          width: 1, background: color + '28' }} />
      </div>
    </>
  )
}

// ── Single orbiting video thumbnail ──────────────────────────
// Performance: video src is set only on first hover — not on mount.
// This prevents 18+ simultaneous network requests at page load.
function OrbThumb({ project, color, setRef, onPause, onClick }: {
  project: Project; color: string
  setRef: (el: HTMLDivElement | null) => void
  onPause: (v: boolean) => void
  onClick: () => void
}) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const loadedRef = useRef(false)
  const [ready,   setReady]   = useState(false)
  const [hovered, setHovered] = useState(false)
  const [errored, setErrored] = useState(false)

  const loadVideo = useCallback(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const v = videoRef.current
    if (!v) return
    v.preload = 'auto'
    v.src = project.videoSrc
    v.load()
  }, [project.videoSrc])

  const enter = useCallback(() => {
    setHovered(true)
    onPause(true)
    loadVideo()
    videoRef.current?.play().catch(() => {})
  }, [onPause, loadVideo])

  const leave = useCallback(() => {
    setHovered(false)
    onPause(false)
    videoRef.current?.pause()
  }, [onPause])

  // Also load when clicked (mobile tap)
  const handleClick = useCallback(() => {
    loadVideo()
    onClick()
  }, [loadVideo, onClick])

  return (
    <div ref={setRef} onClick={handleClick} onMouseEnter={enter} onMouseLeave={leave}
      className="cursor-pointer absolute"
      style={{ width: THUMB_W, height: THUMB_H,
        marginLeft: -THUMB_W / 2, marginTop: -THUMB_H / 2 }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden',
        border: `1px solid ${hovered ? color + 'cc' : 'rgba(255,255,255,0.10)'}`,
        boxShadow: hovered
          ? `0 0 32px ${color}60, 0 12px 40px rgba(0,0,0,0.85)`
          : '0 6px 24px rgba(0,0,0,0.72)',
        backgroundColor: '#060f1c',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
        position: 'relative',
      }}>
        {/* Placeholder — always visible until video ready */}
        {!ready && !errored && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${color}22 0%, #060f1c 70%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%',
              border: `1px solid ${color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, marginLeft: 3,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: `9px solid ${color}66` }} />
            </div>
          </div>
        )}
        {/* Error fallback */}
        {errored && (
          <div style={{ position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${color}18 0%, #060f1c 80%)` }} />
        )}
        <video ref={videoRef} playsInline muted loop
          style={{ width: '100%', height: '100%', objectFit: 'cover',
            opacity: ready ? (hovered ? 1 : 0.82) : 0, transition: 'opacity 0.5s' }}
          onLoadedMetadata={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={() => setErrored(true)} />
        {/* Metadata overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,4,10,0.92) 0%, transparent 52%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.25s',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '8px 12px',
        }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10,
            letterSpacing: '0.08em', color: '#E4EEF4',
            textTransform: 'uppercase', lineHeight: 1.4 }}>
            {project.title}
          </p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 8,
            color: color + 'aa', letterSpacing: '0.06em', marginTop: 2 }}>
            {project.year} · {project.tags[0]}
          </p>
        </div>
        {hovered && (
          <span style={{ position: 'absolute', top: 8, right: 10,
            fontFamily: 'Space Mono, monospace', fontSize: 9, color,
            letterSpacing: '0.06em' }}>
            PLAY ↗
          </span>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 10, height: 10,
          borderBottom: `1px solid ${color}50`, borderLeft: `1px solid ${color}50`,
          pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10,
          borderTop: `1px solid ${color}50`, borderRight: `1px solid ${color}50`,
          pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

// ── Orbital system ────────────────────────────────────────────
// NO opacity on wrapper — keeps thumbnails in parent stacking context
function OrbitalSystem({ cat, onOpen, isMobile }: {
  cat: Cat; onOpen: (p: Project) => void; isMobile: boolean
}) {
  const catProjects = projects.filter(p => p.category === cat.id)
  const n = catProjects.length
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map())
  const timeRef  = useRef(0)
  const pauseRef = useRef(false)
  // Target frame interval: ~16ms (60fps) desktop, ~33ms (30fps) mobile
  const frameMs  = isMobile ? 33 : 16

  useEffect(() => {
    let rafId: number
    let last = 0
    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick)
      // Throttle to target fps
      if (ts - last < frameMs) return
      const dt = Math.min(ts - last, 100) // cap delta to avoid jumps after tab switch
      last = ts
      if (!pauseRef.current) timeRef.current += dt * 0.00019
      catProjects.forEach((proj, i) => {
        const angle = (2 * Math.PI * i / n) + timeRef.current
        const x     = Math.cos(angle) * ORBIT_RX
        const y     = Math.sin(angle) * ORBIT_RY
        const depth = Math.sin(angle)
        const el    = cardEls.current.get(proj.id)
        if (el) {
          const sc = 0.70 + (depth + 1) * 0.152
          el.style.transform = `translate(${x}px, ${y}px) scale(${+sc.toFixed(3)})`
          el.style.opacity   = String(+(0.42 + (depth + 1) * 0.29).toFixed(2))
          el.style.zIndex    = String(Math.round(depth * 10 + 15))
        }
      })
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameMs])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {catProjects.map(proj => (
        <OrbThumb
          key={proj.id} project={proj} color={cat.color}
          setRef={el => el
            ? cardEls.current.set(proj.id, el)
            : cardEls.current.delete(proj.id)}
          onPause={v => { pauseRef.current = v }}
          onClick={() => onOpen(proj)}
        />
      ))}
    </div>
  )
}

// ── Arrow button ──────────────────────────────────────────────
function ArrowBtn({ dir, color, onClick }: { dir: 'left' | 'right'; color: string; onClick: () => void }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ borderColor: color + 'cc', color: color,
        boxShadow: `0 0 24px ${color}40` }}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 56, height: 56, borderRadius: '50%',
        border: `1px solid ${color}35`,
        background: 'rgba(4,12,24,0.80)',
        backdropFilter: 'blur(18px)',
        color: 'rgba(255,255,255,0.38)',
        fontSize: 18, cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 40,
      }}>
      {dir === 'left' ? '←' : '→'}
    </motion.button>
  )
}

// ── Mobile: single video card with IntersectionObserver lazy loading ──
function MobileVideoCard({ project, color, onPlay, onOpen }: {
  project: Project; color: string
  onPlay: (v: HTMLVideoElement) => void
  onOpen: () => void
}) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const loadedRef = useRef(false)
  const [ready,   setReady]   = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current
        if (!v) return
        if (entry.isIntersecting) {
          // Lazy-load: assign src only on first intersection
          if (!loadedRef.current) {
            loadedRef.current = true
            v.src = project.videoSrc
            v.load()
          }
          v.play().then(() => onPlay(v)).catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [project.videoSrc, onPlay])

  return (
    <div ref={wrapRef} onClick={onOpen}
      style={{
        position: 'relative', width: '100%', aspectRatio: '16 / 9',
        borderRadius: 6, overflow: 'hidden',
        border: `1px solid rgba(255,255,255,0.10)`,
        backgroundColor: '#060f1c',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.60)',
      }}>
      {/* Placeholder */}
      {!ready && !errored && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${color}22 0%, #060f1c 70%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%',
            border: `1px solid ${color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 0, height: 0, marginLeft: 4,
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: `14px solid ${color}77` }} />
          </div>
        </div>
      )}
      <video ref={videoRef} playsInline muted loop preload="none"
        style={{ width: '100%', height: '100%', objectFit: 'cover',
          opacity: ready ? 1 : 0, transition: 'opacity 0.4s',
          display: 'block' }}
        onLoadedMetadata={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onError={() => setErrored(true)} />
      {/* Bottom gradient + title */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(2,4,10,0.90) 0%, transparent 55%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '10px 14px',
      }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11,
          letterSpacing: '0.08em', color: '#E4EEF4',
          textTransform: 'uppercase', lineHeight: 1.4, margin: 0 }}>
          {project.title}
        </p>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9,
          color: color + 'aa', letterSpacing: '0.06em', marginTop: 3 }}>
          {project.year} · {project.tags[0]}
        </p>
      </div>
      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 12,
        borderTop: `1px solid ${color}55`, borderLeft: `1px solid ${color}55`,
        pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 12, height: 12,
        borderTop: `1px solid ${color}55`, borderRight: `1px solid ${color}55`,
        pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', top: 10, right: 12, pointerEvents: 'none',
        fontFamily: 'Space Mono, monospace', fontSize: 9,
        color: color + '88', letterSpacing: '0.06em' }}>
        TAP ↗
      </span>
    </div>
  )
}

// ── Mobile gallery: category tabs + vertical video feed ──────
function MobileGallery({ onOpen }: { onOpen: (p: Project) => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const currentVideoRef = useRef<HTMLVideoElement | null>(null)

  const cat         = CATS[activeTab]
  const catProjects = projects.filter(p => p.category === cat.id)

  // Pause the previous video before any new one starts
  const handlePlay = useCallback((v: HTMLVideoElement) => {
    if (currentVideoRef.current && currentVideoRef.current !== v) {
      currentVideoRef.current.pause()
    }
    currentVideoRef.current = v
  }, [])

  // Stop current video when switching category
  const switchTab = useCallback((i: number) => {
    if (currentVideoRef.current) {
      currentVideoRef.current.pause()
      currentVideoRef.current = null
    }
    setActiveTab(i)
  }, [])

  return (
    <div>
      {/* Category tabs */}
      <div className="container-x" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 16, minWidth: 'max-content' }}>
          {CATS.map((c, i) => (
            <button key={c.id} onClick={() => switchTab(i)}
              style={{
                padding: '7px 16px', borderRadius: 4, cursor: 'pointer',
                border: `1px solid ${i === activeTab ? c.color + 'bb' : 'rgba(255,255,255,0.12)'}`,
                background: i === activeTab ? c.color + '1A' : 'transparent',
                color: i === activeTab ? c.color : 'rgba(255,255,255,0.40)',
                fontFamily: 'Space Mono, monospace', fontSize: 10,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}>
              {c.num} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video feed */}
      <div className="container-x" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {catProjects.map(proj => (
          <MobileVideoCard key={proj.id} project={proj} color={cat.color}
            onPlay={handlePlay} onOpen={() => onOpen(proj)} />
        ))}
      </div>

      {/* Category count label */}
      <div className="container-x" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: cat.color + 'cc' }}>
          {cat.num} — {cat.label}
        </span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9,
          color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em' }}>
          {catProjects.length.toString().padStart(2, '0')} ВИДЕО
        </span>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function FeaturedProjects() {
  const [[activeIdx], setState] = useState<[number, number]>([0, 0])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const windowWidth  = useWindowWidth()
  const reducedMotion = useReducedMotion()

  const cat = CATS[activeIdx]
  const catProjects = projects.filter(p => p.category === cat.id)

  const goNext = useCallback(() => setState(([i]) => [(i + 1) % CATS.length, 1] as [number, number]), [])
  const goPrev = useCallback(() => setState(([i]) => [(i + CATS.length - 1) % CATS.length, -1] as [number, number]), [])

  const isMobile = windowWidth < 768
  // Scale scene to fit viewport on tablet (768–920px)
  const mobileScale = Math.max(Math.min(windowWidth / 920, 1), 0.32)
  const sceneH = Math.round(820 * mobileScale)

  // Desktop orbital scene
  const orbitalScene = (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 820,
      transform: mobileScale < 1 ? `scale(${mobileScale})` : 'none',
      transformOrigin: 'top center' }}>

      {/* Nebula background */}
      <AnimatePresence mode="wait">
        <motion.div key={cat.id + '-nebula'} className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          style={{ background: `radial-gradient(ellipse 70% 60% at 50% 52%, ${cat.color}1A 0%, transparent 70%)` }} />
      </AnimatePresence>

      {/* Orbital rings */}
      <AnimatePresence mode="wait">
        <motion.div key={cat.id + '-rings'} className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}>
          <OrbitalRings color={cat.color} />
        </motion.div>
      </AnimatePresence>

      {/* All 4 planets */}
      {CATS.map((c, i) => {
        const pos = getPlanetPos(i, activeIdx)
        const isActive = i === activeIdx
        return (
          <motion.div key={c.id}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              marginLeft: -PLANET_SIZE / 2, marginTop: -PLANET_SIZE / 2,
              zIndex: isActive ? 18 : 4,
              cursor: isActive ? 'default' : 'pointer',
              pointerEvents: isActive ? 'none' : 'auto',
            }}
            animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity,
              filter: `blur(${pos.blur}px)` }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            onClick={isActive ? undefined
              : () => setState(([cur]) => [i, i > cur ? 1 : -1] as [number, number])}
            title={isActive ? undefined : c.label}
          >
            {/* Glow: breathing only on active planet, static on background (perf) */}
            <motion.div style={{
              position: 'absolute', inset: '-46%', borderRadius: '50%',
              background: `radial-gradient(circle, ${c.color}17 0%, transparent 66%)`,
              pointerEvents: 'none',
              opacity: isActive ? undefined : 0.45,
            }}
              animate={isActive && !reducedMotion
                ? { scale: [1, 1.16, 1], opacity: [0.55, 1, 0.55] }
                : undefined}
              transition={isActive && !reducedMotion
                ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
                : undefined} />
            {/* Rotation via CSS — runs on compositor thread, no JS cost */}
            <div style={{
              animation: isActive && !reducedMotion
                ? 'planet-spin 100s linear infinite' : 'none',
            }}>
              <Planet3D color={c.color} rim={c.rim} size={PLANET_SIZE} simple={!isActive} />
            </div>
          </motion.div>
        )
      })}

      {/* Planet labels */}
      {CATS.map((c, i) => {
        const pos = getPlanetPos(i, activeIdx)
        const isActive = i === activeIdx
        const labelY = getLabelY(pos)
        return (
          <motion.div key={`${c.id}-label`}
            style={{ position: 'absolute', left: '50%', top: '50%',
              transform: 'translateX(-50%)', zIndex: isActive ? 22 : 6,
              pointerEvents: 'none', whiteSpace: 'nowrap', textAlign: 'center' }}
            animate={{ x: pos.x, y: labelY, opacity: pos.opacity }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
            <span style={{ fontFamily: 'Space Mono, monospace',
              fontSize: isActive ? 12 : 10, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isActive ? c.color + 'ee' : c.color + 'cc',
              textShadow: isActive ? `0 0 16px ${c.color}80` : 'none' }}>
              {isActive ? `${c.num} ─ ${c.label}` : c.label}
            </span>
          </motion.div>
        )
      })}

      {/* Orbiting thumbnails */}
      <OrbitalSystem key={cat.id + '-orb'} cat={cat} onOpen={setActiveProject} isMobile={false} />

      {/* HUD */}
      <AnimatePresence mode="wait">
        <motion.div key={cat.id + '-hud'} className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}>
          <HUDOverlay color={cat.color} catNum={cat.num} count={catProjects.length} />
        </motion.div>
      </AnimatePresence>

      {/* Category dots */}
      <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 40, pointerEvents: 'none' }}>
        {CATS.map((c, i) => (
          <motion.div key={c.id}
            animate={{ scale: i === activeIdx ? 1 : 0.6, opacity: i === activeIdx ? 1 : 0.35 }}
            transition={{ duration: 0.4 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: c.color }} />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40">
        <ArrowBtn dir="left" color={cat.color} onClick={goPrev} />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40">
        <ArrowBtn dir="right" color={cat.color} onClick={goNext} />
      </div>
    </div>
  )

  return (
    <>
      <section id="projects" className="section-gap" style={{ overflowX: 'hidden' }}>

        {/* Header */}
        <div className="container-x mb-8 md:mb-10">
          <p className="label text-[var(--color-muted)] mb-3 md:mb-4">Избранное</p>
          <h2 className="font-display font-bold text-[var(--color-white)]"
            style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>
            Наши работы
          </h2>
        </div>

        {isMobile ? (
          /* ── Mobile: lightweight vertical gallery ── */
          <MobileGallery onOpen={setActiveProject} />
        ) : (
          /* ── Desktop / tablet: orbital scene ── */
          <>
            <div className="relative" style={{ height: sceneH, overflow: 'hidden' }}>
              {orbitalScene}
            </div>

            {/* Active category label */}
            <div className="container-x mt-5 flex items-baseline justify-between">
              <AnimatePresence mode="wait">
                <motion.h3 key={cat.id + '-lbl'}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(1.6rem, 4vw, 3.2rem)', color: cat.color }}>
                  {cat.label}
                </motion.h3>
              </AnimatePresence>
              <span className="label text-[var(--color-dim)]">
                {catProjects.length.toString().padStart(2, '0')} видео
              </span>
            </div>
          </>
        )}

      </section>

      <VideoModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
