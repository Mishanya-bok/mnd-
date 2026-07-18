import { useRef, useEffect } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { Project } from '@data/projects'

interface Props {
  project: Project
  index: number
  count: number
  pos: MotionValue<number>
  active: boolean
  muted: boolean
  spacing: number
  cardW: number
  cardH: number
  onToggleMute: () => void
  onOpen: () => void
}

export default function WorkCard({
  project, index, count, pos, active, muted, spacing, cardW, cardH, onToggleMute, onOpen,
}: Props) {
  // wrapped delta → cards recycle for an infinite loop
  const delta = useTransform(pos, (p) => {
    let d = ((((index - p) % count) + count) % count)
    if (d > count / 2) d -= count
    return d
  })
  const x = useTransform(delta, (d) => d * spacing)
  const rotateY = useTransform(delta, (d) => Math.max(-44, Math.min(44, d * -17)))
  const z = useTransform(delta, (d) => -Math.min(Math.abs(d), 3) * 90)
  const scale = useTransform(delta, (d) => Math.max(0.62, 1 - Math.abs(d) * 0.12))
  const opacity = useTransform(delta, (d) => {
    const a = Math.abs(d)
    return a > 3.4 ? 0 : a > 2.6 ? 0.4 : 1
  })
  const zIndex = useTransform(delta, (d) => 100 - Math.round(Math.abs(d) * 10))

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
        x, rotateY, z, scale, opacity, zIndex,
        width: cardW, height: cardH,
        marginLeft: -cardW / 2, marginTop: -cardH / 2,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        onClick={onOpen}
        className="group relative w-full h-full rounded-2xl overflow-hidden border border-[color:var(--color-line)] cursor-pointer"
        style={{
          boxShadow: active
            ? '0 50px 100px -30px rgba(0,0,0,0.65)'
            : '0 24px 60px -30px rgba(0,0,0,0.5)',
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
            style={{ filter: 'saturate(0.82) brightness(0.8)' }}
            loading="lazy"
            draggable={false}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent pointer-events-none" />
        <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="u-label-sm text-[color:var(--color-bone)]/70">
              {project.category} · {project.year}
            </p>
            <h3 className="text-[color:var(--color-bone)] font-semibold text-[1rem] leading-tight truncate mt-1">
              {project.title}
            </h3>
          </div>

          {active && (
            <button
              aria-label={muted ? 'Включить звук' : 'Выключить звук'}
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
