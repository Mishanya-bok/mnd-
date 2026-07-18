import type { Variants } from 'framer-motion'

const CINE = [0.22, 1, 0.36, 1] as const
const MASK = [0.77, 0, 0.175, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: CINE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: CINE } },
}

export const maskReveal: Variants = {
  hidden: { y: '108%' },
  visible: { y: '0%', transition: { duration: 0.75, ease: MASK } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
}

export const lineExpand: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: CINE } },
}

export const viewport = { once: true, margin: '-12% 0px -12% 0px' } as const
