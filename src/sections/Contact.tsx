import { useState } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

const contacts = [
  {
    name: 'София',
    role: 'AI-Креатор / Визуальный директор',
    handle: '@alienlale',
    href: 'https://t.me/alienlale',
  },
  {
    name: 'Михаил',
    role: 'Монтажёр / Руководитель продакшена',
    handle: '@mishanya_bok',
    href: 'https://t.me/mishanya_bok',
  },
]

function ContactCard({ c }: { c: typeof contacts[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -6 : 0,
        scale: hovered ? 1.02 : 1,
        boxShadow: hovered
          ? '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,209,255,0.3)'
          : '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group glass p-8 md:p-10 flex flex-col gap-4 relative overflow-hidden cursor-pointer"
    >
      {/* Gold accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
        animate={{ scaleY: hovered ? 1 : 0.15, opacity: hovered ? 1 : 0 }}
        style={{ backgroundColor: '#00D1FF', transformOrigin: 'center' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      <p className="label text-[var(--color-accent)]">{c.role}</p>

      <h3
        className="font-display font-semibold leading-none transition-colors duration-300"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: hovered ? '#00D1FF' : 'var(--color-white)',
        }}
      >
        {c.name}
      </h3>

      <div className="flex items-center gap-3 mt-1">
        <span className="w-6 h-px bg-[var(--color-accent)]" />
        <motion.span
          className="label transition-colors duration-300"
          style={{ color: hovered ? '#00D1FF' : 'rgba(255,255,255,0.6)' }}
        >
          {c.handle}
        </motion.span>
        <span
          className="ml-auto text-xl transition-colors duration-300"
          style={{ color: hovered ? '#00D1FF' : 'rgba(255,255,255,0.2)' }}
        >
          ↗
        </span>
      </div>
    </motion.a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="mb-12 md:mb-16 max-w-2xl">
          <motion.p variants={fadeUp} className="label mb-4">Начать проект</motion.p>
          <div className="overflow-hidden mb-6">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display font-semibold leading-[1.05]"
            >
              Давайте создадим
              <br />
              что-то вместе.
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-sm text-[var(--color-muted)] font-light leading-relaxed max-w-sm">
            Напишите нам напрямую в Telegram — расскажите о проекте, и мы ответим в течение дня.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <ContactCard key={c.href} c={c} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
