import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { fadeUp } from '@lib/motion'
import { projects } from '@data/projects'
import WorkCard from '@components/WorkCard'
import Lightbox from '@components/Lightbox'

function useIsDesktop() {
  const [d, setD] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setD(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return d
}

const N = projects.length

export default function SelectedWork() {
  const isDesktop = useIsDesktop()
  const pos = useMotionValue(0)
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const SPACING = 300
  const ANGLE = 20
  const DEPTH = 220
  const LONG = 360

  const wrap = (i: number) => ((i % N) + N) % N

  useMotionValueEvent(pos, 'change', (v) => {
    const i = wrap(Math.round(v))
    setActive((prev) => {
      if (prev !== i) { setMuted(true); return i }
      return prev
    })
  })

  const snapTo = (target: number) => animate(pos, target, { type: 'spring', stiffness: 190, damping: 30 })

  // auto-advance — infinite loop, paused on hover / drag / lightbox
  useEffect(() => {
    if (!isDesktop || paused || lightbox != null) return
    const t = setTimeout(() => snapTo(Math.round(pos.get()) + 1), 3800)
    return () => clearTimeout(t)
  }, [active, paused, lightbox, isDesktop])

  // pointer drag
  const drag = useRef<{ x: number; start: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isDesktop) return
    setPaused(true)
    drag.current = { x: e.clientX, start: pos.get() }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    pos.set(drag.current.start - (e.clientX - drag.current.x) / SPACING)
  }
  const onPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    snapTo(Math.round(pos.get()))
    setTimeout(() => setPaused(false), 400)
  }

  const step = (dir: number) => { setPaused(true); snapTo(Math.round(pos.get()) + dir); setTimeout(() => setPaused(false), 600) }

  return (
    <section id="work" className="relative py-[var(--section-y)] overflow-hidden">
      <div className="container-x flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-4">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="u-label text-[color:var(--color-bone)]/60 mb-4">Избранные работы</p>
          <h2 className="u-hero max-w-[12ch]">Проекты<br />в движении.</h2>
        </motion.div>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="u-lg text-[color:var(--color-bone)]/70 max-w-sm md:text-right"
        >
          Лента крутится сама. Наведи, чтобы остановить, тяни или жми стрелки — клик открывает полный ролик со звуком.
        </motion.p>
      </div>

      {isDesktop ? (
        <>
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative h-[460px] outline-none select-none"
            style={{ perspective: 1800, cursor: 'grab', touchAction: 'pan-y' }}
          >
            {projects.map((p, i) => (
              <WorkCard
                key={p.id}
                project={p}
                index={i}
                count={N}
                pos={pos}
                active={i === active}
                muted={muted}
                spacing={SPACING}
                angle={ANGLE}
                depth={DEPTH}
                long={LONG}
                onToggleMute={() => setMuted((m) => !m)}
                onOpen={() => setLightbox(i)}
              />
            ))}
          </div>

          <div className="container-x flex items-center justify-center gap-6 mt-8">
            <button onClick={() => step(-1)} aria-label="Назад" className="w-11 h-11 grid place-items-center rounded-full border border-[color:var(--color-line)] hover:bg-[color:var(--color-ink)] transition-colors">←</button>
            <span className="u-label-sm text-[color:var(--color-bone)]/55 tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </span>
            <button onClick={() => step(1)} aria-label="Вперёд" className="w-11 h-11 grid place-items-center rounded-full border border-[color:var(--color-line)] hover:bg-[color:var(--color-ink)] transition-colors">→</button>
          </div>
        </>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[var(--container-x)] pb-2">
          {projects.map((p, i) => {
            const portrait = p.aspect === '9:16'
            return (
              <button
                key={p.id}
                onClick={() => setLightbox(i)}
                className="snap-center shrink-0 relative rounded-2xl overflow-hidden border border-[color:var(--color-line)]"
                style={{ width: portrait ? '58vw' : '80vw', aspectRatio: portrait ? '9/16' : '16/9' }}
              >
                <img src={p.poster} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute left-3 right-3 bottom-3 text-left">
                  <p className="u-label-sm text-[color:var(--color-bone)]/70">{p.category} · {p.year}</p>
                  <h3 className="font-semibold text-sm mt-1 truncate">{p.title}</h3>
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Lightbox
        project={lightbox != null ? projects[lightbox] : null}
        onClose={() => setLightbox(null)}
        onPrev={() => setLightbox((v) => (v == null ? v : wrap(v - 1)))}
        onNext={() => setLightbox((v) => (v == null ? v : wrap(v + 1)))}
      />
    </section>
  )
}
