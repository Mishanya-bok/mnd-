import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { stagger, fadeUp } from '@lib/motion'

interface FormData {
  name: string
  contact: string
  message: string
}

const quickContacts = [
  { label: 'Telegram (София)', href: 'https://t.me/alienlale', handle: '@alienlale' },
  { label: 'Telegram (Михаил)', href: 'https://t.me/mishanya_bok', handle: '@mishanya_bok' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const mailtoUrl = `mailto:hello@mnd.team?subject=Project Inquiry from ${encodeURIComponent(data.name)}&body=${encodeURIComponent(
      `Name: ${data.name}\nContact: ${data.contact}\n\n${data.message}`
    )}`
    window.location.href = mailtoUrl
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="contact" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
      >
        {/* Left: headline + quick contacts */}
        <div>
          <motion.p variants={fadeUp} className="label mb-6">
            Начать проект
          </motion.p>
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
          <motion.p
            variants={fadeUp}
            className="text-sm text-[var(--color-muted)] font-light leading-relaxed mb-10 max-w-xs"
          >
            Расскажите о проекте — что нужно, что представляете, и мы возьмём её оттуда.
          </motion.p>

          {/* Quick contacts */}
          <motion.div variants={stagger} className="flex flex-col gap-4">
            {quickContacts.map((c) => (
              <motion.a
                key={c.href}
                variants={fadeUp}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border-b border-[var(--color-border)] pb-4 hover:border-[var(--color-accent)] transition-colors duration-300"
              >
                <span className="label text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors duration-300 flex-1">
                  {c.label}
                </span>
                <span className="label text-[var(--color-white)]">{c.handle}</span>
                <span className="text-[var(--color-dim)] group-hover:text-[var(--color-accent)] transition-colors duration-300">↗</span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right: form */}
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start justify-center h-full gap-4 py-12"
              >
                <span className="font-display text-xl-fluid font-semibold text-[var(--color-accent)]">
                  Сообщение отправлено.
                </span>
                <p className="text-sm text-[var(--color-muted)] font-light">
                  Мы свяжемся с вами в ближайшее время.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-8"
              >
                {/* Имя */}
                <div className="relative">
                  <label className="label block mb-2">Имя</label>
                  <input
                    {...register('name', { required: true })}
                    type="text"
                    placeholder="Ваше имя"
                    className={`w-full pb-3 border-b text-[var(--color-white)] placeholder-[var(--color-dim)] font-light text-base focus:border-[var(--color-white)] transition-colors duration-300 bg-transparent ${
                      errors.name ? 'border-red-500' : 'border-[var(--color-border)]'
                    }`}
                  />
                </div>

                {/* Контакт */}
                <div className="relative">
                  <label className="label block mb-2">Контакт</label>
                  <input
                    {...register('contact', { required: true })}
                    type="text"
                    placeholder="Email, Telegram или телефон"
                    className={`w-full pb-3 border-b text-[var(--color-white)] placeholder-[var(--color-dim)] font-light text-base focus:border-[var(--color-white)] transition-colors duration-300 bg-transparent ${
                      errors.contact ? 'border-red-500' : 'border-[var(--color-border)]'
                    }`}
                  />
                </div>

                {/* Сообщение */}
                <div className="relative">
                  <label className="label block mb-2">Сообщение</label>
                  <textarea
                    {...register('message', { required: true })}
                    placeholder="Расскажите о вашем проекте"
                    rows={4}
                    className={`w-full pb-3 border-b text-[var(--color-white)] placeholder-[var(--color-dim)] font-light text-base focus:border-[var(--color-white)] transition-colors duration-300 bg-transparent resize-none ${
                      errors.message ? 'border-red-500' : 'border-[var(--color-border)]'
                    }`}
                  />
                </div>

                {/* Отправить */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center gap-4 self-start bg-[var(--color-accent)] hover:bg-[var(--color-white)] text-[var(--color-bg)] label px-8 py-4 transition-all duration-300 disabled:opacity-50"
                >
                  <span>Отправить</span>
                  <Send size={14} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  )
}
