import { useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'

interface Strand {
  id: number
  d: string
  delay: number
  duration: number
  opacity: number
  strokeWidth: number
}

function generateStrands(side: 'bottomLeft' | 'topRight', count = 14): Strand[] {
  const strands: Strand[] = []
  const rng = (seed: number, min: number, max: number) => {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return min + (x - Math.floor(x)) * (max - min)
  }

  for (let i = 0; i < count; i++) {
    const seed = i + (side === 'topRight' ? 100 : 0)
    let d: string
    if (side === 'bottomLeft') {
      // Origin: bottom-left corner area, tendrils reach up and right
      const ox = rng(seed + 1, -20, 60)
      const oy = rng(seed + 2, 240, 320)
      const c1x = rng(seed + 3, 80, 200)
      const c1y = rng(seed + 4, 100, 220)
      const c2x = rng(seed + 5, 150, 340)
      const c2y = rng(seed + 6, 20, 140)
      const ex = rng(seed + 7, 200, 420)
      const ey = rng(seed + 8, -10, 120)
      d = `M ${ox} ${oy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`
    } else {
      // Origin: top-right corner area, tendrils reach down and left
      const ox = rng(seed + 1, 240, 320)
      const oy = rng(seed + 2, -20, 60)
      const c1x = rng(seed + 3, 100, 220)
      const c1y = rng(seed + 4, 80, 200)
      const c2x = rng(seed + 5, 20, 140)
      const c2y = rng(seed + 6, 150, 340)
      const ex = rng(seed + 7, -10, 120)
      const ey = rng(seed + 8, 200, 420)
      d = `M ${ox} ${oy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`
    }

    strands.push({
      id: i,
      d,
      delay: rng(seed + 9, 0, 2.5),
      duration: rng(seed + 10, 3.5, 6),
      opacity: rng(seed + 11, 0.12, 0.45),
      strokeWidth: rng(seed + 12, 0.5, 1.5),
    })
  }
  return strands
}

const BL_STRANDS = generateStrands('bottomLeft')
const TR_STRANDS = generateStrands('topRight')

interface WireClusterProps {
  side: 'bottomLeft' | 'topRight'
  className?: string
}

export default function WireCluster({ side, className = '' }: WireClusterProps) {
  const strands = side === 'bottomLeft' ? BL_STRANDS : TR_STRANDS
  const floatY = useMotionValue(0)
  const floatX = useMotionValue(0)

  // Slow organic float
  useEffect(() => {
    let frame: number
    let t = side === 'topRight' ? Math.PI : 0
    const tick = () => {
      t += 0.003
      floatY.set(Math.sin(t) * 8)
      floatX.set(Math.cos(t * 0.7) * 5)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [floatY, floatX, side])

  const gradId = `wire-grad-${side}`
  const glowId = `wire-glow-${side}`

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ y: floatY, x: floatX }}
    >
      <svg
        width="420"
        height="320"
        viewBox="0 0 420 320"
        fill="none"
        overflow="visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#C9D3DC" stopOpacity="0.6" />
            <stop offset="40%"  stopColor="#00D1FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7FE7FF" stopOpacity="0.2" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {strands.map(strand => (
          <motion.path
            key={strand.id}
            d={strand.d}
            stroke={`url(#${gradId})`}
            strokeWidth={strand.strokeWidth}
            strokeLinecap="round"
            fill="none"
            filter={`url(#${glowId})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: strand.opacity }}
            transition={{
              pathLength: {
                delay: strand.delay,
                duration: strand.duration,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: {
                delay: strand.delay,
                duration: 1,
              },
            }}
          />
        ))}

        {/* Terminal nodes — glowing dots at strand endpoints */}
        {strands.filter((_, i) => i % 3 === 0).map(strand => {
          // Extract endpoint from path string
          const parts = strand.d.split(' ')
          const ex = parseFloat(parts[parts.length - 2])
          const ey = parseFloat(parts[parts.length - 1])
          return (
            <motion.circle
              key={`node-${strand.id}`}
              cx={ex}
              cy={ey}
              r={2}
              fill="#00D1FF"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.9, 0.4], scale: [0, 1.2, 1] }}
              transition={{
                delay: strand.delay + strand.duration * 0.85,
                duration: 0.6,
                times: [0, 0.4, 1],
              }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(0,209,255,0.9))' }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}
