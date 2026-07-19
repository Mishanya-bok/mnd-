import { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { motion } from 'framer-motion'
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
  const [lightbox, setLightbox] = useState<number | null>(null)

  const SPACING = 300
  const CARD_W = 356
  const CARD_H = 452
  const SPEED = 0.26 // index units / second (right → left drift)

  const wrap = (i: number) => ((i % N) + N) % N

  // refs the rAF loop reads without re-subscribing
  const hoverRef = useRef(false)
  const dragRef = useRef<{ x: number; start: number } | null>(null)
  const movedRef = useRef(false)
  const manualUntil = useRef(0)
  const lightboxRef = useRef<number | null>(null)
  lightboxRef.current = lightbox

  useMotionValueEvent(pos, 'change', (v) => {
    const i = wrap(Math.round(v))
    setActive((prev) => {
      if (prev !== i) { setMuted(true); return i }
      return prev
    })
  })

  // continuous smooth drift
  useEffect(() => {
    if (!isDesktop) return
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      const blocked = hoverRef.current || dragRef.current || lightboxRef.current != null || t < manualUntil.current
      if (!blocked) {
        let v = pos.get() + SPEED * dt
        if (v > N) v -= N
        pos.set(v)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isDesktop])

  const nudge = (dir: number) => {
    manualUntil.current = performance.now() + 650
    animate(pos, Math.round(pos.get()) + dir, { duration: 0.55, ease: [0.22, 1, 0.36, 1] })
  }

  // pointer drag + click guard
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isDesktop) return
    movedRef.current = false
    dragRef.current = { x: e.clientX, start: pos.get() }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.x
    if (Math.abs(dx) > 5) movedRef.current = true
    pos.set(dragRef.current.start - dx / SPACING)
  }
  const onPointerUp = () => {
    if (!dragRef.current) return
    dragRef.current = null
    manualUntil.current = performance.now() + 300 // brief settle before drift resumes
  }

  const openCard = (i: number) => { if (!movedRef.current) setLightbox(i) }

  return (
    <section id="work" className="relative py-[var(--section-y)] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(56% 52% at 50% 68%, rgba(208,36,38,1) 0%, rgba(150,20,22,0.45) 46%, transparent 72%), linear-gradient(180deg, #150409 0%, #1d060b 100%)',
        }}
      />
      <div className="relative container-x flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="u-label text-[color:var(--color-bone)]/60 mb-4">Избранное</p>
          <h2 className="u-hero max-w-[12ch]">Наши работы.</h2>
        </motion.div>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="u-lg text-[color:var(--color-bone)]/70 max-w-sm md:text-right"
        >
          Свайп для просмотра
        </motion.p>
      </div>

      {isDesktop ? (
        <div className="relative">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onMouseEnter={() => (hoverRef.current = true)}
            onMouseLeave={() => (hoverRef.current = false)}
            className="relative h-[560px] outline-none select-none"
            style={{ perspective: 2200, cursor: 'grab', touchAction: 'pan-y' }}
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
                cardW={CARD_W}
                cardH={CARD_H}
                onToggleMute={() => setMuted((m) => !m)}
                onOpen={() => openCard(i)}
              />
            ))}
          </div>

          {/* side arrows */}
          <button
            onClick={() => nudge(-1)} aria-label="Назад"
            className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-[120] w-12 h-12 grid place-items-center rounded-full bg-[color:var(--color-ink)]/70 backdrop-blur border border-white/15 hover:bg-[color:var(--color-ink)] transition-colors"
          >←</button>
          <button
            onClick={() => nudge(1)} aria-label="Вперёд"
            className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-[120] w-12 h-12 grid place-items-center rounded-full bg-[color:var(--color-ink)]/70 backdrop-blur border border-white/15 hover:bg-[color:var(--color-ink)] transition-colors"
          >→</button>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[var(--container-x)] pb-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setLightbox(i)}
              className="snap-center shrink-0 relative rounded-2xl overflow-hidden border border-[color:var(--color-line)]"
              style={{ width: '72vw', aspectRatio: '4 / 5' }}
            >
              <img src={p.poster} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute left-3 right-3 bottom-3 text-left">
                <p className="u-label-sm text-[color:var(--color-bone)]/70">{p.category} · {p.year}</p>
                <h3 className="font-semibold text-sm mt-1 truncate">{p.title}</h3>
              </div>
            </button>
          ))}
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
