import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // Dot: near-instant
  const dotX = useSpring(mx, { stiffness: 2000, damping: 120 })
  const dotY = useSpring(my, { stiffness: 2000, damping: 120 })

  // Ring: lags behind
  const ringX   = useSpring(mx, { stiffness: 160, damping: 18 })
  const ringY   = useSpring(my, { stiffness: 160, damping: 18 })
  const ringSize   = useSpring(28, { stiffness: 380, damping: 26 })
  const ringOp     = useSpring(0.45, { stiffness: 300, damping: 24 })
  const ringBorder = useSpring(0.5, { stiffness: 300, damping: 24 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, .group, [data-cursor]')) {
        ringSize.set(52)
        ringOp.set(0.9)
        ringBorder.set(1)
      }
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, .group, [data-cursor]')) {
        ringSize.set(28)
        ringOp.set(0.45)
        ringBorder.set(0.5)
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [ringSize, ringOp, ringBorder])

  return (
    <>
      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX, y: dotY,
          translateX: '-50%', translateY: '-50%',
          width: 4, height: 4,
          borderRadius: '50%',
          backgroundColor: '#fff',
        }}
      />

      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
          width: ringSize, height: ringSize,
          opacity: ringOp,
          borderRadius: '50%',
          border: '1px solid rgba(74,158,255,0.7)',
          boxShadow: '0 0 8px rgba(74,158,255,0.2)',
        }}
      />
    </>
  )
}
