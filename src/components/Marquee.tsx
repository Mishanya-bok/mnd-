import { brands } from '@data/site'

/** Infinite horizontal ticker of brand wordmarks. Pure CSS loop. */
export default function Marquee() {
  const row = (
    <div className="flex items-center gap-10 md:gap-14 pr-10 md:pr-14 shrink-0">
      {brands.map((b) => (
        <span
          key={b.text}
          className="whitespace-nowrap text-[0.95rem] md:text-[1.05rem] tracking-tight"
          style={{ color: b.color, fontWeight: b.weight, fontStyle: b.style }}
        >
          {b.text}
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative w-full overflow-hidden border-y border-[color:var(--color-line)] bg-black/35 backdrop-blur-sm py-4">
      <div className="flex items-center gap-6 container-x">
        <span className="u-label-sm text-[color:var(--color-bone)]/50 shrink-0">Нам доверяют</span>
        <div className="relative flex-1 overflow-hidden">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-black/40 to-transparent" />
          <div className="flex w-max animate-[ticker_26s_linear_infinite] hover:[animation-play-state:paused]">
            {row}
            {row}
          </div>
        </div>
      </div>
    </div>
  )
}
