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
            About the Studio
          </motion.p>

          <div className="overflow-hidden mb-6">
            <motion.h2
              variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
              className="font-display text-display italic font-light leading-[1.05]"
            >
              Two minds.
              <br />
              One vision.
            </motion.h2>
          </div>

          <motion.p
            variants={fadeUp}
            className="text-[var(--color-muted)] font-light leading-relaxed mb-10 max-w-md"
          >
            We create cinematic AI visuals for brands, artists, and campaigns — with the precision of a boutique studio and the fluency of a modern production team.
          </motion.p>

          {/* Team */}
          <div className="flex flex-col gap-8">
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-px bg-[var(--color-accent)]" />
                <span className="label text-[var(--color-accent)]">Sofia</span>
              </div>
              <p className="label text-[var(--color-white)] mb-1">AI Creator / Visual Director</p>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
                Responsible for visual concept, AI direction, and overall aesthetic. Brings the kind of taste that makes clients come back.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-px bg-[var(--color-accent)]" />
                <span className="label text-[var(--color-accent)]">Mikhail</span>
              </div>
              <p className="label text-[var(--color-white)] mb-1">Editor / Production Lead</p>
              <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed">
                Handles editing, final assembly, and the commercial precision that separates rough visuals from polished deliverables.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Ambient video column */}
        <motion.div variants={scaleIn} className="relative">
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '4/5' }}
          >
            <video
              ref={ambientVideoRef}
              src="/videos/ai-1.webm"
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            {/* Subtle vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 60%, rgba(8,8,8,0.6) 100%)',
              }}
            />
          </div>
          {/* Decorative number */}
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
