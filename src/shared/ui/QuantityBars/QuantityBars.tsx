const BAR_WIDTH = 6
const BAR_GAP = 2
const BAR_HEIGHT = 18
const BAR_RX = 3
const BARS_COUNT = 5
const FILLED = '#949494'
const EMPTY = '#D8D8D8'

export interface QuantityBarsProps {
  value: number
  max?: number
  barCount?: number
}

export function QuantityBars({ value, max = 100, barCount = BARS_COUNT }: QuantityBarsProps) {
  const filledRatio = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max))
  const filledCount = Math.round(filledRatio * barCount)
  const width = barCount * BAR_WIDTH + (barCount - 1) * BAR_GAP

  return (
    <svg
      width={width}
      height={BAR_HEIGHT}
      viewBox={`0 0 ${width} ${BAR_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {Array.from({ length: barCount }, (_, i) => {
        const x = i * (BAR_WIDTH + BAR_GAP)
        const fill = i < filledCount ? FILLED : EMPTY
        return (
          <rect
            key={i}
            x={x}
            y={0}
            width={BAR_WIDTH}
            height={BAR_HEIGHT}
            rx={BAR_RX}
            fill={fill}
          />
        )
      })}
    </svg>
  )
}
