import { motion } from 'framer-motion'
import { services } from '@data/services'
import { stagger, fadeUp } from '@lib/motion'
import TiltCard from '@components/TiltCard'

export default function Services() {
  return (
    <section id="services" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-12 md:mb-16"
      >
        <motion.p variants={fadeUp} className="label mb-3">Что мы делаем</motion.p>
        <div className="overflow-hidden">
          <motion.h2
            variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
            className="font-display text-display font-semibold"
          >
            Услуги
          </motion.h2>
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {services.map((service, i) => (
          <motion.div key={service.id} variants={fadeUp}>
            <TiltCard className="h-full group" intensity={5}>
              <div className="glass-sm p-7 cursor-default h-full">
                <p className="label mb-3 text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="font-body text-[var(--color-white)] font-semibold tracking-wide mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-300"
                  style={{ fontSize: '0.85rem', letterSpacing: '0.07em' }}
                >
                  {service.title.toUpperCase()}
                </h3>
                <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-5 h-px w-0 group-hover:w-8 bg-[var(--color-accent)] transition-all duration-400" />
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
