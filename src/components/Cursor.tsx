import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const BLUE = '1.5px solid rgba(74,158,255,0.85)'

export default function Cursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // Dot: near-instant
  const dotX = useSpring(mx, { stiffness: 1200, damping: 60 })
  const dotY = useSpring(my, { stiffness: 1200, damping: 60 })

  // Viewfinder frame: lags behind
  const fX = useSpring(mx, { stiffness: 120, damping: 16 })
  const fY = useSpring(my, { stiffness: 120, damping: 16 })
  const fScale = useSpring(1, { stiffness: 300, damping: 24 })
  const fOpacity = useSpring(0.45, { stiffness: 300, damping: 24 })
  const fRotate = useSpring(0, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, .group, [data-cursor]')) {
        fScale.set(1.9)
        fOpacity.set(1)
        fRotate.set(45)
      }
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, .group, [data-cursor]')) {
        fScale.set(1)
        fOpacity.set(0.45)
        fRotate.set(0)
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [fScale, fOpacity, fRotate])

  return (
    <>
      {/* Center dot — inverts colors */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotX, y: dotY,
          translateX: '-50%', translateY: '-50%',
          width: 5, height: 5,
          borderRadius: '50%',
          backgroundColor: 'white',
        }}
      />

      {/* Camera viewfinder — 4 corner brackets */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: fX, y: fY,
          translateX: '-50%', translateY: '-50%',
          width: 34, height: 34,
          scale: fScale,
          opacity: fOpacity,
          rotate: fRotate,
        }}
      >
        {/* Top-left */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 9, height: 9, borderTop: BLUE, borderLeft: BLUE }} />
        {/* Top-right */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 9, height: 9, borderTop: BLUE, borderRight: BLUE }} />
        {/* Bottom-left */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 9, height: 9, borderBottom: BLUE, borderLeft: BLUE }} />
        {/* Bottom-right */}
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderBottom: BLUE, borderRight: BLUE }} />
      </motion.div>
    </>
  )
}
