import { useRef, useEffect } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { Project } from '@data/projects'

interface Props {
  project: Project
  index: number
  pos: MotionValue<number>
  active: boolean
  muted: boolean
  spacing: number
  angle: number
  depth: number
  long: number
  onToggleMute: () => void
  onOpen: () => void
}

export default function WorkCard({
  project, index, pos, active, muted, spacing, angle, depth, long, onToggleMute, onOpen,
}: Props) {
  const delta = useTransform(pos, (p) => index - p)
  const x = useTransform(delta, (d) => d * spacing)
  const rotateY = useTransform(delta, (d) => Math.max(-52, Math.min(52, d * -angle)))
  const z = useTransform(delta, (d) => -Math.min(Math.abs(d), 3.2) * depth)
  const opacity = useTransform(delta, (d) => {
    const a = Math.abs(d)
    return a > 3.4 ? 0 : a > 2.6 ? 0.35 : 1
  })
  const zIndex = useTransform(delta, (d) => 100 - Math.round(Math.abs(d) * 10))

  const isPortrait = project.aspect === '9:16'
  const w = isPortrait ? long * (9 / 16) : long
  const h = isPortrait ? long : long * (9 / 16)

  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted
    if (active) v.play().catch(() => {})
  }, [active, muted])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        x, rotateY, z, opacity, zIndex,
        width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        onClick={active ? onOpen : undefined}
        className="group relative w-full h-full rounded-2xl overflow-hidden border border-[color:var(--color-line)]"
        style={{
          cursor: active ? 'pointer' : 'default',
          boxShadow: active
            ? '0 40px 90px -30px rgba(0,0,0,0.6)'
            : '0 20px 50px -30px rgba(0,0,0,0.5)',
        }}
      >
        {active ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={project.src}
            poster={project.poster}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={project.poster}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.8) brightness(0.82)' }}
            loading="lazy"
            draggable={false}
          />
        )}

        {/* gradient + meta */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent pointer-events-none" />
        <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="u-label-sm text-[color:var(--color-bone)]/70">
              {project.category} · {project.year}
            </p>
            <h3 className="text-[color:var(--color-bone)] font-semibold text-[0.98rem] leading-tight truncate mt-1">
              {project.title}
            </h3>
          </div>

          {active && (
            <button
              aria-label={muted ? 'Unmute' : 'Mute'}
              onClick={(e) => { e.stopPropagation(); onToggleMute() }}
              className="shrink-0 grid place-items-center w-9 h-9 rounded-full bg-[color:var(--color-ink)]/80 backdrop-blur border border-white/15 hover:bg-black transition-colors"
            >
              <SpeakerIcon muted={muted} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      {muted ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a9 9 0 0 1 0 12" />
        </>
      )}
    </svg>
  )
}
