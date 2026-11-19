import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Cursor from '@components/Cursor'
import { fadeUp, stagger } from '@lib/motion'
import { animationWays, glossary, higgsfieldModels, modules, pipeline, tools, type Module, type Tool } from './data'

const STORAGE_KEY = 'mnd-course-progress'
const TOTAL_LESSONS = modules.reduce((n, m) => n + m.lessons.length, 0)

function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done))
    } catch {
      /* storage unavailable */
    }
  }, [done])
  const percent = Math.round((Object.values(done).filter(Boolean).length / TOTAL_LESSONS) * 100)
  return {
    done,
    percent,
    toggle: (id: string) => setDone((d) => ({ ...d, [id]: !d[id] })),
    reset: () => setDone({}),
  }
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

/* ── Layout bits ─────────────────────────────────── */

function SectionHead({ label, title, text, children }: { label: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div className="max-w-3xl">
        <p className="label !text-[var(--color-accent)] mb-3">{label}</p>
        <h2 className="font-display text-display font-bold leading-none tracking-tight">{title}</h2>
        {text && <p className="text-[var(--color-muted)] mt-5 text-lg">{text}</p>}
      </div>
      {children}
    </div>
  )
}

const navLinks = [
  { label: 'Инструменты', href: '#tools' },
  { label: 'Пайплайн', href: '#pipeline' },
  { label: 'Анимация', href: '#animation' },
  { label: 'Программа', href: '#program' },
]

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[rgba(2,4,10,0.82)] backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="container-x flex items-center justify-between h-16">
        <a href="#top" className="font-display text-[1.3rem] font-semibold tracking-tight hover:text-[var(--color-accent)] transition-colors">
          mnd.<span className="text-[var(--color-accent)]">school</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="label hover:!text-[var(--color-white)] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#enroll" className="label !text-[var(--color-bg)] bg-[var(--color-accent)] px-4 py-2 rounded-full hover:bg-[var(--color-accent-2)] transition-colors">
          Записаться
        </a>
      </div>
    </header>
  )
}

/* ── Hero ────────────────────────────────────────── */

const roadmap = ['GPT и Claude', 'Фото', 'Видео', 'Монтаж', 'Ценник и клиенты']

function Hero({ percent }: { percent: number }) {
  return (
    <section id="top" className="relative min-h-[92vh] flex items-center overflow-hidden pt-16">
      <video src="/videos/main screen2.webm" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-[var(--color-bg)]/70 to-[var(--color-bg)]" />
      <motion.div variants={stagger} initial="hidden" animate="visible" className="container-x relative z-10 w-full">
        <motion.p variants={fadeUp} className="label !text-[var(--color-accent)] mb-6">
          Курс от AI-кураторов mnd.team
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-display text-hero font-bold leading-[0.95] tracking-tight mb-8 max-w-5xl">
          Профессия есть такая —
          <br />
          <span className="text-[var(--color-accent)]">картинки делать</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-[var(--color-muted)] text-lg max-w-2xl mb-10">
          Учим генерировать фото и видео в нейросетях: от первого промпта в ChatGPT до готового ролика, ценника и первых клиентов.
        </motion.p>
        <motion.ol variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
          {roadmap.map((r, i) => (
            <li key={r} className="glass-sm px-4 py-2 flex items-center gap-2 text-sm">
              <span className="font-mono text-xs text-[var(--color-accent)]">0{i + 1}</span>
              {r}
            </li>
          ))}
        </motion.ol>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-5 items-center">
          <a href="#program" className="font-display font-semibold bg-[var(--color-accent)] text-[var(--color-bg)] px-7 py-4 rounded-full hover:bg-[var(--color-accent-2)] transition-colors">
            Смотреть программу
          </a>
          {percent > 0 && (
            <span className="label">
              Твой прогресс: <span className="!text-[var(--color-accent)]">{percent}%</span>
            </span>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ── Tools ───────────────────────────────────────── */

const groups: Tool['group'][] = ['Текст', 'Фото', 'Видео', 'Звук']

function Tools() {
  const [group, setGroup] = useState<Tool['group'] | 'Все'>('Все')
  const list = group === 'Все' ? tools : tools.filter((t) => t.group === group)
  return (
    <section id="tools" className="container-x section-gap scroll-mt-16">
      <SectionHead label="Арсенал" title="Нейросети, с которыми работаем" text="Что умеет каждая, сколько стоит и когда её открывать.">
        <div className="flex flex-wrap gap-2">
          {(['Все', ...groups] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`label px-4 py-2 rounded-full border transition-colors ${
                group === g ? '!text-[var(--color-bg)] bg-[var(--color-accent)] border-[var(--color-accent)]' : 'border-[var(--color-border)] hover:!text-[var(--color-white)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </SectionHead>
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {list.map((t) => (
            <motion.div
              key={t.name}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="glass p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="label mb-1">{t.group}</p>
                  <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
                </div>
                {t.badge && (
                  <span className="font-mono text-[0.65rem] px-2 py-1 rounded-full border border-[var(--color-accent)]/40 text-[var(--color-accent)] whitespace-nowrap">{t.badge}</span>
                )}
              </div>
              <p className="text-[var(--color-chrome)] mb-4">{t.role}</p>
              {t.details && (
                <ul className="space-y-1.5 mb-4">
                  {t.details.map((d) => (
                    <li key={d} className="text-sm text-[var(--color-muted)] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-[var(--color-accent)]">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              {t.price && (
                <p className="mt-auto pt-4 border-t border-[var(--color-border)] font-mono text-sm">
                  <span className="text-[var(--color-muted)]">Подписка: </span>
                  {t.price}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/* ── Glossary + Higgsfield ───────────────────────── */

function Glossary() {
  return (
    <section className="container-x section-gap">
      <SectionHead label="Словарь" title="Говорим на одном языке" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {glossary.map((g, i) => (
          <motion.div key={g.term} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="glass-sm p-6">
            <h3 className="font-display text-xl font-semibold text-[var(--color-accent)] mb-2">{g.term}</h3>
            <p className="text-sm text-[var(--color-muted)]">{g.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div {...reveal} className="glass p-6 md:p-10 grid md:grid-cols-[1fr_1.4fr] gap-8 items-center">
        <div>
          <p className="label !text-[var(--color-accent)] mb-3">Важно запомнить</p>
          <h3 className="font-display text-xl-fluid font-bold leading-tight mb-3">Higgsfield не пишет промпты</h3>
          <p className="text-[var(--color-muted)]">Он делает картинки, видео и всё, что связано с визуалом. Промпт приносишь готовым из ChatGPT или Claude.</p>
        </div>
        <div>
          <p className="label mb-3">Внутри Higgsfield</p>
          <div className="flex flex-wrap gap-2">
            {higgsfieldModels.map((m) => (
              <span key={m} className="px-4 py-2 rounded-full border border-[var(--color-border)] text-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ── Pipeline ────────────────────────────────────── */

function Thumb({ src, label }: { src: string; label: string }) {
  return (
    <figure className="flex flex-col gap-2 min-w-0">
      <img src={src} alt={label} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white" />
      <figcaption className="label">{label}</figcaption>
    </figure>
  )
}

function Pipeline() {
  const [step, setStep] = useState(0)
  const s = pipeline[step]
  return (
    <section id="pipeline" className="container-x section-gap scroll-mt-16">
      <SectionHead label="Структура работы" title="Пайплайн: от фото до видео" text="Разбираем на реальном примере: рекламный ролик машины на белой циклораме, 12 секунд." />
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        {pipeline.map((p, i) => (
          <button
            key={p.where}
            onClick={() => setStep(i)}
            className={`text-left p-4 md:p-5 rounded-[var(--radius-lg)] border transition-colors ${
              step === i ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/40'
            }`}
          >
            <span className="font-mono text-xs text-[var(--color-accent)]">Шаг {i + 1}</span>
            <p className="font-display text-base md:text-2xl font-semibold mt-1">{p.where}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="glass p-6 md:p-10">
          <h3 className="font-display text-xl-fluid font-bold mb-8">{s.goal}</h3>
          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className={`grid gap-4 ${s.inputs.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {s.inputs.map((inp) =>
                inp.img ? (
                  <Thumb key={inp.label} src={inp.img} label={inp.label} />
                ) : (
                  <div key={inp.label} className="flex flex-col gap-2">
                    <p className="glass-sm p-4 text-sm text-[var(--color-chrome)] aspect-auto sm:aspect-[4/3] overflow-auto">{inp.text}</p>
                    <span className="label">{inp.label}</span>
                  </div>
                ),
              )}
            </div>
            <span className="font-display text-4xl text-[var(--color-accent)] text-center rotate-90 lg:rotate-0">=</span>
            <div>
              <Thumb src={s.output.img} label={s.output.label} />
            </div>
          </div>
          {s.prompt && (
            <details className="mt-8 group">
              <summary className="label !text-[var(--color-accent)] list-none">Показать фрагмент промпта ↓</summary>
              <p className="mt-4 font-mono text-xs leading-relaxed text-[var(--color-muted)] glass-sm p-5">{s.prompt}</p>
            </details>
          )}
          <div className="flex justify-between mt-8">
            <button disabled={step === 0} onClick={() => setStep(step - 1)} className="label disabled:opacity-30 hover:!text-[var(--color-white)]">
              ← Назад
            </button>
            <button disabled={step === pipeline.length - 1} onClick={() => setStep(step + 1)} className="label disabled:opacity-30 hover:!text-[var(--color-white)]">
              Дальше →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

/* ── Animation ways ──────────────────────────────── */

function Animation() {
  return (
    <section id="animation" className="container-x section-gap scroll-mt-16">
      <SectionHead label="Анимация" title="Два способа оживить картинку" />
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {animationWays.map((w, i) => (
          <motion.div key={w.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className="glass overflow-hidden flex flex-col">
            <img src={w.img} alt={w.title} loading="lazy" className="w-full aspect-video object-cover" />
            <div className="p-6 md:p-8 flex flex-col gap-4 flex-1">
              <div>
                <span className="font-mono text-xs text-[var(--color-accent)]">Способ {i + 1}</span>
                <h3 className="font-display text-2xl font-semibold">{w.title}</h3>
                <p className="text-[var(--color-muted)]">{w.subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {w.flow.map((f, k) => (
                  <span key={f} className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full border border-[var(--color-border)]">{f}</span>
                    {k < w.flow.length - 1 && <span className="text-[var(--color-accent)]">→</span>}
                  </span>
                ))}
              </div>
              <p className="glass-sm p-4 text-sm text-[var(--color-chrome)]">«{w.request}»</p>
              <p className="text-sm text-[var(--color-muted)] mt-auto">{w.note}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...reveal} className="glass p-6 md:p-10">
        <p className="label !text-[var(--color-accent)] mb-3">Kling 3.0 · start frame → end frame</p>
        <h3 className="font-display text-xl-fluid font-bold mb-8">Даёшь первый и последний кадр — нейросеть делает переход</h3>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 items-center">
          <Thumb src="/course/box-start.jpg" label="Start frame" />
          <div className="text-center">
            <span className="label block mb-1">промпт</span>
            <span className="font-display text-3xl text-[var(--color-accent)]">→</span>
          </div>
          <Thumb src="/course/box-end.jpg" label="End frame" />
        </div>
        <p className="text-[var(--color-muted)] mt-6 text-sm">
          Белая коробка «прокрашивается» в фирменный цвет, проявляются логотип, лейбл, ® и светящийся контур. Так за 7 секунд получается анимация товарного знака.
        </p>
      </motion.div>
    </section>
  )
}

/* ── Program ─────────────────────────────────────── */

function ModuleCard({ m, open, onToggle, done, toggleLesson }: { m: Module; open: boolean; onToggle: () => void; done: Record<string, boolean>; toggleLesson: (id: string) => void }) {
  const completed = m.lessons.filter((l) => done[l.id]).length
  return (
    <div className={`glass overflow-hidden transition-colors ${open ? '!border-[var(--color-accent)]/40' : ''}`}>
      <button onClick={onToggle} className="w-full text-left p-6 md:p-8 flex gap-5 md:gap-8 items-start">
        <span className="font-display text-4xl md:text-6xl font-bold text-[var(--color-accent)]/80 leading-none">{m.num}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl md:text-3xl font-semibold leading-tight mb-2">{m.title}</h3>
          <p className="text-[var(--color-muted)] mb-4">{m.tagline}</p>
          <div className="flex flex-wrap gap-2 items-center">
            {m.tools.map((t) => (
              <span key={t} className="font-mono text-[0.68rem] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-chrome)]">
                {t}
              </span>
            ))}
            <span className="label ml-auto">
              {completed}/{m.lessons.length} уроков
            </span>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-3xl text-[var(--color-accent)] leading-none shrink-0" aria-hidden>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <div className="px-6 md:px-8 pb-8 md:pl-[7.5rem]">
              <ol className="space-y-3 mb-6">
                {m.lessons.map((l, i) => (
                  <li key={l.id} className="glass-sm p-5">
                    <label className="flex gap-4 items-start">
                      <input
                        type="checkbox"
                        checked={!!done[l.id]}
                        onChange={() => toggleLesson(l.id)}
                        aria-label={`Урок пройден: ${l.title}`}
                        className="mt-1 w-5 h-5 shrink-0 appearance-none rounded border border-[var(--color-accent)]/50 checked:bg-[var(--color-accent)] relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[var(--color-bg)] checked:after:text-xs checked:after:font-bold"
                      />
                      <div>
                        <p className={`font-display font-semibold text-lg mb-2 ${done[l.id] ? 'text-[var(--color-muted)] line-through' : ''}`}>
                          <span className="font-mono text-xs text-[var(--color-accent)] mr-2">
                            {m.num}.{i + 1}
                          </span>
                          {l.title}
                        </p>
                        <ul className="space-y-1.5">
                          {l.points.map((p) => (
                            <li key={p} className="text-sm text-[var(--color-muted)] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-[var(--color-accent)]">
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  </li>
                ))}
              </ol>
              <div className="rounded-[var(--radius-md)] p-5 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                <p className="label !text-[var(--color-accent)] mb-2">Практика</p>
                <p className="text-sm">{m.practice}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Program({ done, toggle, reset, percent }: ReturnType<typeof useProgress>) {
  const [open, setOpen] = useState<string | null>(modules[0].id)
  return (
    <section id="program" className="container-x section-gap scroll-mt-16">
      <SectionHead label="Программа" title="5 модулей курса" text="Отмечай пройденные уроки — прогресс сохранится в браузере.">
        <div className="min-w-[220px]">
          <div className="flex justify-between label mb-2">
            <span>Прогресс</span>
            <span className="!text-[var(--color-accent)]">{percent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
            <motion.div className="h-full bg-[var(--color-accent)]" animate={{ width: `${percent}%` }} transition={{ duration: 0.5 }} />
          </div>
          {percent > 0 && (
            <button onClick={reset} className="label mt-2 hover:!text-[var(--color-white)]">
              Сбросить
            </button>
          )}
        </div>
      </SectionHead>
      <div className="space-y-4">
        {modules.map((m) => (
          <ModuleCard key={m.id} m={m} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} done={done} toggleLesson={toggle} />
        ))}
      </div>
    </section>
  )
}

/* ── Enroll ──────────────────────────────────────── */

function Enroll() {
  return (
    <section id="enroll" className="container-x section-gap scroll-mt-16">
      <div className="glass p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <p className="label !text-[var(--color-accent)] mb-4 relative">Помаленьку — и до первых клиентов</p>
        <h2 className="font-display text-display font-bold leading-none tracking-tight mb-6 relative">Готов делать AI-визуалы?</h2>
        <p className="text-[var(--color-muted)] max-w-xl mx-auto mb-10 relative">Оставь заявку — расскажем о формате и ближайшем потоке.</p>
        <a href="/#contact" className="relative inline-block font-display font-semibold bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-4 rounded-full hover:bg-[var(--color-accent-2)] transition-colors">
          Оставить заявку
        </a>
      </div>
    </section>
  )
}

export default function CourseApp() {
  const progress = useProgress()
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero percent={progress.percent} />
        <Tools />
        <Glossary />
        <Pipeline />
        <Animation />
        <Program {...progress} />
        <Enroll />
      </main>
      <footer className="container-x py-10 border-t border-[var(--color-border)] flex justify-between label">
        <span>mnd.school</span>
        <a href="/" className="hover:!text-[var(--color-white)]">mnd.team →</a>
      </footer>
    </>
  )
}
