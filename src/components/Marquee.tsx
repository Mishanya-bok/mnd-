import { brands } from '@data/site'

/** Minimal monochrome ticker of brand wordmarks — seamless infinite loop.
 *  Each half repeats the list enough times to exceed any viewport width,
 *  so translateX(-50%) never reveals an edge. */
export default function Marquee() {
  const items = [...brands, ...brands, ...brands]
  const half = (key: string) => (
    <div key={key} className="flex items-center gap-10 md:gap-16 pr-10 md:pr-16 shrink-0">
      {items.map((b, i) => (
        <span
          key={`${key}-${i}`}
          className="whitespace-nowrap text-[0.82rem] md:text-[0.9rem] text-[color:var(--color-bone)]/45 hover:text-[color:var(--color-bone)]/90 transition-colors"
          style={b.font}
        >
          {b.text}
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative w-full overflow-hidden border-t border-[color:var(--color-line)] bg-black/45 backdrop-blur-sm py-3.5">
      <div className="flex items-center gap-6 container-x">
        <span className="u-label-sm text-[color:var(--color-bone)]/35 shrink-0 text-[0.6rem]">Нам доверяют</span>
        <div className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-black/50 to-transparent" />
          <div className="mnd-ticker flex w-max animate-[ticker_45s_linear_infinite] hover:[animation-play-state:paused]">
            {half('a')}
            {half('b')}
          </div>
        </div>
      </div>
    </div>
  )
}
