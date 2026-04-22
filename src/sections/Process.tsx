import { motion } from 'framer-motion'
import { processSteps } from '@data/process'
import { stagger, fadeUp } from '@lib/motion'

export default function Process() {
  return (
    <section id="process" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-12 md:mb-16"
      >
        <motion.p variants={fadeUp} className="label mb-3">
          Как мы работаем
        </motion.p>
        <div className="overflow-hidden">
          <motion.h2
            variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
            className="font-display text-display italic font-light"
          >
            Процесс
          </motion.h2>
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-0"
      >
        {processSteps.map((step, i) => (
          <motion.div
            key={step.number}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative pt-8 md:pt-0 md:pr-8 cursor-default group"
          >
            {/* Connecting line */}
            {i < processSteps.length - 1 && (
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="hidden md:block absolute top-[2.4rem] left-[3rem] right-0 h-px bg-[var(--color-border)] origin-left"
              />
            )}

            {/* Number */}
            <span className="font-display text-[3rem] italic font-light text-[var(--color-accent)] leading-none block mb-4 group-hover:text-[var(--color-white)] transition-colors duration-300">
              {step.number}
            </span>

            {/* Vertical line mobile */}
            {i < processSteps.length - 1 && (
              <div className="md:hidden absolute left-[1.5rem] top-[5.5rem] bottom-0 w-px bg-[var(--color-border)]" />
            )}

            <h3
              className="font-body font-medium text-[var(--color-white)] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300"
              style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {step.title}
            </h3>
            <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
