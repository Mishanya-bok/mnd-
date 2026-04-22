import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  {
    number: '10M+',
    label: 'зрителей',
    detail: 'суммарный охват работ студии',
  },
  {
    number: '10',
    label: 'крупнейших экранов Москвы',
    detail: 'городской масштаб — коммерческая кампания Rolf',
  },
]

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  return (
    <div className="overflow-hidden">
      <motion.span
        className="font-display font-semibold text-[var(--color-accent)] leading-none block"
        style={{ fontSize: 'clamp(4.5rem, 11vw, 9rem)' }}
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : { y: '110%' }}
        transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
      >
        {value}
      </motion.span>
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      className="container-x border-t border-b border-[var(--color-border)]"
      style={{ paddingTop: 'clamp(60px, 8vw, 100px)', paddingBottom: 'clamp(60px, 8vw, 100px)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex flex-col gap-4 ${
              i === 0
                ? 'pb-12 md:pb-0 md:pr-16 border-b md:border-b-0 md:border-r border-[var(--color-border)]'
                : 'pt-12 md:pt-0 md:pl-16'
            }`}
          >
            <AnimatedNumber value={stat.number} inView={inView} />
            <div>
              <motion.p
                className="text-[var(--color-white)] font-light text-lg leading-snug"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {stat.label}
              </motion.p>
              <motion.p
                className="text-sm text-[var(--color-muted)] font-light mt-1"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }}
              >
                {stat.detail}
              </motion.p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
