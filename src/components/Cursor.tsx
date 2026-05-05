import { useEffect, useRef } from 'react'

// Pure DOM cursor — no framer-motion springs, single shared RAF loop with lerp
export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navigator.maxTouchPoints > 0) return

    let rafId = 0
    let mx = -200, my = -200
    let rx = -200, ry = -200
    let rSize = 28, rTargetSize = 28

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, .group, [data-cursor]')) rTargetSize = 52
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, .group, [data-cursor]')) rTargetSize = 28
    }

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      rx += (mx - rx) * 0.13
      ry += (my - ry) * 0.13
      rSize += (rTargetSize - rSize) * 0.18

      const dot  = dotRef.current
      const ring = ringRef.current
      if (dot)  dot.style.transform  = `translate(${mx}px, ${my}px)`
      if (ring) {
        ring.style.transform = `translate(${rx}px, ${ry}px)`
        ring.style.width     = `${rSize}px`
        ring.style.height    = `${rSize}px`
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null

  return (
    <>
      <div ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 4, height: 4, borderRadius: '50%',
          backgroundColor: '#fff',
          transform: 'translate(-200px, -200px)',
          marginLeft: -2, marginTop: -2,
          willChange: 'transform',
        }} />
      <div ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '1px solid rgba(0,209,255,0.7)',
          boxShadow: '0 0 8px rgba(0,209,255,0.2)',
          transform: 'translate(-200px, -200px)',
          marginLeft: -14, marginTop: -14,
          willChange: 'transform',
        }} />
    </>
  )
}
