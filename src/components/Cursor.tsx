import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // Dot: follows instantly
  const dotX = useSpring(mx, { stiffness: 1200, damping: 60 })
  const dotY = useSpring(my, { stiffness: 1200, damping: 60 })

  // Ring: lags behind for fluid feel
  const ringX = useSpring(mx, { stiffness: 130, damping: 18 })
  const ringY = useSpring(my, { stiffness: 130, damping: 18 })

  // Ring state on hover
  const ringScale = useSpring(1, { stiffness: 350, damping: 28 })
  const ringBorderOpacity = useSpring(0.45, { stiffness: 350, damping: 28 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest('a, button, .group, [data-cursor]')) {
        ringScale.set(2.4)
        ringBorderOpacity.set(1)
      }
    }
    const onOut = (e: MouseEvent) => {
      const t = e.target as Element
      if (t.closest('a, button, .group, [data-cursor]')) {
        ringScale.set(1)
        ringBorderOpacity.set(0.45)
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [ringScale, ringBorderOpacity])

  return (
    <>
      {/* Dot — inverts colors via mix-blend-difference */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'white',
        }}
      />
      {/* Ring — gold, lags with spring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,108,0.9)',
          scale: ringScale,
          opacity: ringBorderOpacity,
        }}
      />
    </>
  )
}
