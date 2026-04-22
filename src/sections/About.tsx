import { motion } from 'framer-motion'
import { useVideoAutoplay } from '@hooks/useVideoAutoplay'
import { stagger, fadeUp, scaleIn } from '@lib/motion'

export default function About() {
  const ambientVideoRef = useVideoAutoplay(0.3)

  return (
    <section id="about" className="section-gap container-x">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
      >
        {/* Text column */}
        <div>
          <motion.p variants={fadeUp} className="label mb-6">
            О студии
          </motion.p>

          <div className="overflow-hidden mb-6">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display italic font-light leading-[1.05]"
            >
              Два разума.
              <br />
              Одно видение.
            </motion.h2>
          </div>

          <motion.p
            variants={fadeUp}
            className="text-[var(--color-muted)] font-light leading-relaxed mb-10 max-w-md"
          >
            Мы создаём кинематографичные AI-визуалы для брендов, артистов и кампаний — с точностью бутиковой студии и гибкостью современной команды.
          </motion.p>

          {/* Team */}
          <div className="flex flex-col gap-8">
            <motion.div
              variants={fadeUp}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.25 }}
              className="cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  className="h-px bg-[var(--color-accent)]"
                  initial={{ width: '1.5rem' }}
                  whileHover={{ width: '3rem' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="label text-[var(--color-accent)]">София</span>
              </div>
              <p className="label text-[var(--color-white)] mb-1">AI-Креатор / Визуальный директор</p>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
                Отвечает за визуальную концепцию, AI-режиссуру и общую эстетику. Тот вкус, к которому возвращаются клиенты.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.25 }}
              className="cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.span
                  className="h-px bg-[var(--color-accent)]"
                  initial={{ width: '1.5rem' }}
                  whileHover={{ width: '3rem' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="label text-[var(--color-accent)]">Михаил</span>
              </div>
              <p className="label text-[var(--color-white)] mb-1">Монтажёр / Руководитель продакшена</p>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
                Монтаж, финальная сборка и коммерческая точность — то, что отличает сырой материал от готового продукта.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Ambient video column */}
        <motion.div variants={scaleIn} className="relative">
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <video
              ref={ambientVideoRef}
              src="/videos/ai-1.webm"
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-[#0d0d0d]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(8,8,8,0.6) 100%)' }}
            />
          </div>
          <span
            className="absolute -bottom-4 -right-2 font-display text-[8rem] italic font-light leading-none select-none pointer-events-none"
            style={{ color: 'rgba(240,237,230,0.04)' }}
          >
            02
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
