import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINKS = [
  { label: 'Работы', href: '#work' },
  { label: 'Достижения', href: '#studio' },
  { label: 'Услуги', href: '#services' },
  { label: 'Контакты', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-colors duration-500"
        style={{
          background: scrolled ? 'rgba(150,15,18,0.55)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-line)' : '1px solid transparent',
        }}
      >
        <nav className="container-x flex items-center justify-between h-[68px] md:h-[80px]">
          <a href="#top" className="text-[1.15rem] font-extrabold tracking-tight">
            mnd<span className="text-[color:var(--color-bone)]/50">.team</span>
          </a>

          <ul className="hidden md:flex items-center gap-9 u-label-sm">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="relative group inline-block py-1">
                  {l.label}
                  <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[color:var(--color-bone)] transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center bg-[color:var(--color-ink)] text-[color:var(--color-bone)] u-label-sm px-5 py-2.5 rounded-full hover:bg-black transition-colors"
            >
              Связаться
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
            >
              <span className="block w-6 h-px bg-[color:var(--color-bone)]" />
              <span className="block w-6 h-px bg-[color:var(--color-bone)]" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[color:var(--color-ink)] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-x flex items-center justify-between h-[68px]">
              <span className="text-[1.15rem] font-extrabold tracking-tight">mnd.team</span>
              <button aria-label="Закрыть" onClick={() => setOpen(false)} className="p-2 -mr-2 u-label-sm">
                Закрыть
              </button>
            </div>
            <div className="flex-1 container-x flex flex-col justify-center gap-2">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="u-hero"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {l.label}.
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
