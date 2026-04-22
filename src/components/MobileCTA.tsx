import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="m-3">
            <button
              onClick={handleClick}
              className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] label py-4 text-center hover:bg-[var(--color-white)] transition-colors duration-300"
            >
              Discuss a Project
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
