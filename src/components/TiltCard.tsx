import { useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number      // max tilt degrees, default 8
  highlightSize?: number  // radial highlight radius px, default 160
}

export default function TiltCard({
  children,
  className = '',
  intensity = 8,
  highlightSize = 160,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mouseX = useMotionValue(0) // position for radial highlight (0–100%)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(rawX, { stiffness: 260, damping: 28 })
  const rotateY = useSpring(rawY, { stiffness: 260, damping: 28 })

  const highlight = useMotionTemplate`radial-gradient(${highlightSize}px circle at ${mouseX}% ${mouseY}%, rgba(0,209,255,0.10) 0%, transparent 70%)`

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width   // 0–1
    const cy = (e.clientY - rect.top)  / rect.height  // 0–1
    rawY.set((cx - 0.5) * intensity * 2)
    rawX.set((0.5 - cy) * intensity * 2)
    mouseX.set(cx * 100)
    mouseY.set(cy * 100)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        rotateX,
        rotateY,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Radial highlight layer */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
        style={{ background: highlight }}
      />
      {children}
    </motion.div>
  )
}
