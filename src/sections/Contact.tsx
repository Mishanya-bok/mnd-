import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { contacts } from '@data/site'

const PEOPLE = [contacts.sofia, contacts.mikhail]
const tg = (h: string) => `https://t.me/${h.replace('@', '')}`

export default function Contact() {
  return (
    <section id="contact" className="relative min-h-[100svh] flex flex-col justify-center py-[var(--section-y)]">
      <div className="container-x w-full">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-3xl mb-12">
          <motion.p variants={fadeUp} className="u-label text-[color:var(--color-bone)]/60 mb-5">Контакты</motion.p>
          <motion.h2 variants={fadeUp} className="u-hero">Давайте что-нибудь создадим.</motion.h2>
          <motion.p variants={fadeUp} className="u-lg text-[color:var(--color-bone)]/75 mt-6 max-w-md">
            Напишите напрямую — ответим в течение 24 часов.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid md:grid-cols-2 gap-5 lg:gap-6"
        >
          {PEOPLE.map((p) => (
            <motion.a
              key={p.telegram}
              variants={fadeUp}
              href={tg(p.telegram)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-ink)]/55 backdrop-blur p-8 lg:p-10 flex flex-col justify-between min-h-[340px] lg:min-h-[440px]"
            >
              <div className="flex items-start justify-between">
                <span className="u-label-sm text-[color:var(--color-bone)]/55">{p.role}</span>
                <span className="grid place-items-center w-12 h-12 rounded-full bg-[color:var(--color-bone)]/10 group-hover:bg-[color:var(--color-bone)] group-hover:text-[color:var(--color-ink)] transition-colors">
                  <TgIcon />
                </span>
              </div>

              <div>
                <h3 className="u-display leading-[0.9]">{p.name}</h3>
                <p className="mt-4 text-[1.15rem] font-medium text-[color:var(--color-bone)]/80 group-hover:text-[color:var(--color-bone)] transition-colors">
                  {p.telegram}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 u-label-sm text-[color:var(--color-bone)]/50 group-hover:text-[color:var(--color-bone)] transition-colors">
                  Написать в Telegram <span aria-hidden>→</span>
                </span>
              </div>

              <span className="pointer-events-none absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[color:var(--color-crimson)]/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.9 19c-.2 1-.8 1.2-1.6.75l-4.5-3.3-2.2 2.1c-.24.24-.44.44-.9.44l.32-4.6L18.7 6.2c.36-.32-.08-.5-.56-.18L7.9 12.5l-4.5-1.4c-.98-.3-1-1 .2-1.45l17.6-6.8c.8-.3 1.5.2 1.24 1.45Z" />
    </svg>
  )
}
