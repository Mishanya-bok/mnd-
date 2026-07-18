import { socials } from '@data/site'

export default function Footer() {
  return (
    <footer className="container-x border-t border-[color:var(--color-line)] py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-[1.05rem] font-extrabold tracking-tight">mnd.team</span>
      <span className="u-label-sm text-[color:var(--color-bone)]/45 order-last sm:order-none">© 2026</span>
      <nav className="flex items-center gap-6 u-label-sm">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--color-bone)]/60 transition-colors">
            {s.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
