import { motion } from 'framer-motion'
import { maskReveal } from '@lib/motion'
import { asset } from '@lib/asset'
import Marquee from '@components/Marquee'

const HEAD = ['Студия', 'по созданию', 'ИИ-контента.']

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#150409,#1d060b)' }}
    >
      {/* video — full-frame block on mobile, fullscreen bg on desktop */}
      <div className="relative w-full lg:absolute lg:inset-0 lg:z-0">
        <video
          className="w-full aspect-video object-cover lg:h-full lg:aspect-auto"
          src={asset('/videos/main.mp4')}
          poster={asset('/videos/main.jpg')}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* scrims only on desktop where text overlays the video */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/45" />
      </div>

      {/* content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center lg:justify-end container-x w-full pt-8 lg:pt-32 pb-8">
        <motion.p
          className="u-label text-[color:var(--color-bone)]/75 mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          ИИ · Визуальная студия
        </motion.p>

        <h1 className="font-extrabold leading-[0.92] tracking-[-0.03em] text-[clamp(2.1rem,6.2vw,6rem)]">
          {HEAD.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                variants={maskReveal}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 + i * 0.09 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-md text-[color:var(--color-bone)]/80 u-lg leading-snug"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Создание контента для бизнеса и артистов.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.7 }}
        >
          <a
            href="#work"
            className="inline-flex items-center gap-3 bg-[color:var(--color-bone)] text-[color:var(--color-ink)] u-label px-7 py-4 rounded-full hover:bg-white transition-colors"
          >
            Смотреть работы
            <span aria-hidden>→</span>
          </a>
          <span className="u-label-sm text-[color:var(--color-bone)]/60">ИИ + Продакшн</span>
        </motion.div>
      </div>

      {/* trusted-by ticker pinned to the bottom of the hero */}
      <div className="relative z-10">
        <Marquee />
      </div>
    </section>
  )
}
