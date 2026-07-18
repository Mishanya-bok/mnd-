import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { contacts } from '@data/site'

const PEOPLE = [contacts.sofia, contacts.mikhail]
const tg = (h: string) => `https://t.me/${h.replace('@', '')}`

export default function Contact() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    window.open(tg(contacts.mikhail.telegram), '_blank', 'noopener')
  }

  return (
    <section id="contact" className="relative py-[var(--section-y)]">
      <div className="container-x">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-3xl">
          <motion.p variants={fadeUp} className="u-label text-[color:var(--color-bone)]/60 mb-5">Контакты</motion.p>
          <motion.h2 variants={fadeUp} className="u-hero">Давайте что-нибудь создадим.</motion.h2>
          <motion.p variants={fadeUp} className="u-lg text-[color:var(--color-bone)]/75 mt-6 max-w-md">
            Расскажите о проекте — ответим в течение 24 часов.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 mt-14">
          {/* contact cards */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid sm:grid-cols-2 gap-5 content-start">
            {PEOPLE.map((p) => (
              <motion.a
                key={p.telegram}
                variants={fadeUp}
                href={tg(p.telegram)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-ink)]/55 backdrop-blur p-6 flex flex-col justify-between min-h-[190px]"
              >
                <div className="flex items-center justify-between">
                  <span className="u-label-sm text-[color:var(--color-bone)]/50">{p.role}</span>
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-[color:var(--color-bone)]/10 group-hover:bg-[color:var(--color-bone)] group-hover:text-[color:var(--color-ink)] transition-colors">
                    <TgIcon />
                  </span>
                </div>
                <div>
                  <h3 className="text-[clamp(1.8rem,3.2vw,2.4rem)] font-extrabold tracking-tight leading-none">{p.name}</h3>
                  <p className="mt-3 font-medium text-[color:var(--color-bone)]/80 group-hover:text-[color:var(--color-bone)] transition-colors">{p.telegram}</p>
                </div>
                <span className="pointer-events-none absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[color:var(--color-crimson)]/25 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}
          </motion.div>

          {/* form */}
          <motion.form
            onSubmit={onSubmit}
            variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="flex flex-col gap-8"
          >
            {[
              { name: 'name', label: 'Имя', ph: 'Ваше имя' },
              { name: 'contact', label: 'Telegram или почта', ph: '@ник или email' },
            ].map((f) => (
              <motion.label key={f.name} variants={fadeUp} className="block">
                <span className="u-label-sm text-[color:var(--color-bone)]/55">{f.label}</span>
                <input
                  required
                  type="text"
                  name={f.name}
                  placeholder={f.ph}
                  className="w-full mt-3 bg-transparent border-b border-[color:var(--color-line)] pb-3 text-[color:var(--color-bone)] placeholder:text-[color:var(--color-bone)]/35 focus:border-[color:var(--color-bone)] outline-none transition-colors"
                />
              </motion.label>
            ))}
            <motion.label variants={fadeUp} className="block">
              <span className="u-label-sm text-[color:var(--color-bone)]/55">О проекте</span>
              <textarea
                required
                name="brief"
                rows={4}
                placeholder="Пара строк о том, что хотите сделать…"
                className="w-full mt-3 bg-transparent border-b border-[color:var(--color-line)] pb-3 text-[color:var(--color-bone)] placeholder:text-[color:var(--color-bone)]/35 focus:border-[color:var(--color-bone)] outline-none transition-colors resize-none"
              />
            </motion.label>
            <motion.button
              variants={fadeUp}
              type="submit"
              className="w-full bg-[color:var(--color-bone)] text-[color:var(--color-ink)] u-label py-4 rounded-full hover:bg-white transition-colors"
            >
              {sent ? 'Открываю Telegram…' : 'Отправить'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function TgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.9 4.3 18.9 19c-.2 1-.8 1.2-1.6.75l-4.5-3.3-2.2 2.1c-.24.24-.44.44-.9.44l.32-4.6L18.7 6.2c.36-.32-.08-.5-.56-.18L7.9 12.5l-4.5-1.4c-.98-.3-1-1 .2-1.45l17.6-6.8c.8-.3 1.5.2 1.24 1.45Z" />
    </svg>
  )
}
