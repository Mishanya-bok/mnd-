import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@lib/motion'
import { contacts } from '@data/site'

const PEOPLE = [contacts.sofia, contacts.mikhail]

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    window.open(`https://t.me/${contacts.mikhail.telegram.replace('@', '')}`, '_blank', 'noopener')
  }

  return (
    <section id="contact" className="relative py-[var(--section-y)]">
      <div className="container-x grid lg:grid-cols-2 gap-14 lg:gap-20">
        {/* left */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}>
          <motion.h2 variants={fadeUp} className="u-hero max-w-[14ch]">Let’s Build Something.</motion.h2>
          <motion.p variants={fadeUp} className="u-lg text-[color:var(--color-bone)]/75 mt-6 max-w-md">
            Tell us about the project. We reply within 24 hours.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-12 flex flex-col">
            {PEOPLE.map((p) => (
              <a
                key={p.telegram}
                href={`https://t.me/${p.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-6 border-t border-[color:var(--color-line)] last:border-b flex items-baseline justify-between gap-4"
              >
                <span className="u-display">{p.name}.</span>
                <span className="text-right">
                  <span className="block u-label-sm text-[color:var(--color-bone)]/55">{p.role}</span>
                  <span className="relative inline-block font-medium mt-1">
                    {p.telegram}
                    <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[color:var(--color-bone)] transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* right — form */}
        <motion.form
          onSubmit={onSubmit}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col gap-8 lg:pt-4"
        >
          {[
            { name: 'name', label: 'Name', type: 'text', ph: 'Your name' },
            { name: 'contact', label: 'Email or Telegram', type: 'text', ph: '@handle or email' },
          ].map((f) => (
            <motion.label key={f.name} variants={fadeUp} className="block">
              <span className="u-label-sm text-[color:var(--color-bone)]/55">{f.label}</span>
              <input
                required
                type={f.type}
                name={f.name}
                placeholder={f.ph}
                className="w-full mt-3 bg-transparent border-b border-[color:var(--color-line)] pb-3 text-[color:var(--color-bone)] placeholder:text-[color:var(--color-bone)]/35 focus:border-[color:var(--color-bone)] outline-none transition-colors"
              />
            </motion.label>
          ))}

          <motion.label variants={fadeUp} className="block">
            <span className="u-label-sm text-[color:var(--color-bone)]/55">Project brief</span>
            <textarea
              required
              name="brief"
              rows={4}
              placeholder="A few lines about what you want to make…"
              className="w-full mt-3 bg-transparent border-b border-[color:var(--color-line)] pb-3 text-[color:var(--color-bone)] placeholder:text-[color:var(--color-bone)]/35 focus:border-[color:var(--color-bone)] outline-none transition-colors resize-none"
            />
          </motion.label>

          <motion.button
            variants={fadeUp}
            type="submit"
            className="w-full bg-[color:var(--color-ink)] text-[color:var(--color-bone)] u-label py-4 rounded-full hover:bg-black transition-colors"
          >
            {sent ? 'Opening Telegram…' : 'Send'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
