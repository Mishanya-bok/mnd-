import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Работы', href: '#projects' },
  { label: 'О нас', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Контакт', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkColor = scrolled ? 'text-[var(--color-muted)] hover:text-[var(--color-white)]' : 'text-white/60 hover:text-white'
  const logoColor = scrolled ? 'text-[var(--color-white)]' : 'text-white'
  const barColor  = scrolled ? 'bg-[var(--color-white)]' : 'bg-white'

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(8,8,8,0.88)] backdrop-blur-md border-b border-[var(--color-border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className={`font-display text-[1.4rem] font-semibold tracking-tight transition-colors duration-300 hover:text-[var(--color-accent)] ${logoColor}`}
          >
            mnd.
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`group relative label transition-colors duration-300 py-1 ${linkColor}`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <motion.button
              onClick={() => handleNav('#contact')}
              whileHover={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
              transition={{ duration: 0.22 }}
              className={`label border px-5 py-2 rounded-full transition-colors duration-300 ${
                scrolled
                  ? 'border-[var(--color-border)] text-[var(--color-muted)]'
                  : 'border-white/25 text-white/60'
              }`}
            >
              Связаться
            </motion.button>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-[5px] p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            <span className={`block w-6 h-px transition-all duration-300 ${barColor} ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${barColor} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px transition-all duration-300 ${barColor} ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col items-center justify-center gap-8 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className="font-display text-[2.2rem] font-semibold text-[var(--color-white)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            {link.label}
          </button>
        ))}
      </motion.div>
    </>
  )
}
