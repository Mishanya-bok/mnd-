export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="container-x border-t border-[var(--color-border)] py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Logo */}
        <span className="font-display text-[1.3rem] italic font-light text-[var(--color-white)]">
          mnd.
        </span>

        {/* Copyright */}
        <p className="label text-[var(--color-dim)] order-last md:order-none">
          © {year} mnd.team
        </p>

        {/* Contacts / socials */}
        <div className="flex items-center gap-6">
          <a
            href="https://t.me/alienlale"
            target="_blank"
            rel="noopener noreferrer"
            className="label text-[var(--color-muted)] hover:text-[var(--color-white)] transition-colors duration-300"
          >
            Telegram
          </a>
          <a
            href="https://www.behance.net/gallery/242981013/mndteam-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="label text-[var(--color-muted)] hover:text-[var(--color-white)] transition-colors duration-300"
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  )
}
