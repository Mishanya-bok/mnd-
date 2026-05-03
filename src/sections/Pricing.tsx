import { motion } from 'framer-motion'
import { stagger, fadeUp } from '@lib/motion'

const tiers = [
  {
    price: 'от 15 000 ₽',
    unit: null,
    title: 'Стартовый бюджет',
    description: 'Небольшие проекты, концептуальные визуалы, тестовые форматы — минимальный порог входа в работу со студией.',
  },
  {
    price: '7 000 ₽',
    unit: '/ готовый кадр',
    title: 'Создание + анимация',
    description: 'Стоимость одного финального кадра: AI-генерация, обработка и анимация включены. Именно так мы считаем объём работ.',
  },
  {
    price: 'Индивидуально',
    unit: null,
    title: 'Финальный расчёт',
    description: 'Каждый проект уникален. Финальная стоимость рассчитывается вместе с вами — после обсуждения задачи, без скрытых условий.',
  },
]

export default function Pricing() {
  const scrollToContact = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="pricing" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <motion.p variants={fadeUp} className="label mb-3">Стоимость</motion.p>
          <div className="overflow-hidden">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display font-semibold"
            >
              Прозрачно и честно
            </motion.h2>
          </div>
        </div>
        <motion.p variants={fadeUp} className="text-sm text-[var(--color-muted)] font-light max-w-xs leading-relaxed">
          Мы считаем по кадрам — вы понимаете за что платите на каждом шаге.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,158,255,0.3)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group glass p-8 cursor-default flex flex-col gap-5"
          >
            <div>
              <span
                className="font-display font-semibold text-[var(--color-accent)] leading-none block group-hover:text-[var(--color-white)] transition-colors duration-300"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }}
              >
                {tier.price}
              </span>
              {tier.unit && <span className="label text-[var(--color-muted)] mt-1.5 block">{tier.unit}</span>}
            </div>
            <div>
              <p className="text-[var(--color-white)] font-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {tier.title}
              </p>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">{tier.description}</p>
            </div>
            <div className="mt-auto h-px w-0 group-hover:w-8 bg-[var(--color-accent)] transition-all duration-400" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 pt-10 border-t border-[var(--color-border)] flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed max-w-sm">
          Объясняем каждую строку и согласовываем бюджет до старта работ. Никаких сюрпризов в финале.
        </p>
        <motion.button
          onClick={scrollToContact}
          whileHover={{ backgroundColor: '#0c1220', color: '#fff', scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="label bg-[var(--color-accent)] text-white px-8 py-4 rounded-full shrink-0"
        >
          Обсудить бюджет
        </motion.button>
      </motion.div>
    </section>
  )
}
