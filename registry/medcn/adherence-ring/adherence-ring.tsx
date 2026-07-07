import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export interface AdherenceDay {
  date: string
  /** Doses actually taken. */
  taken: number
  /** Doses scheduled that day. */
  scheduled: number
  /** Doses intentionally skipped (not the same as missed). */
  skipped?: number
}

const sizeConfig = {
  sm: { box: 64, stroke: 6, pct: "text-base", sub: "text-[9px]" },
  default: { box: 92, stroke: 8, pct: "text-xl", sub: "text-[10px]" },
} as const

export interface AdherenceRingProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Per-day summary, oldest → newest — not raw dose events. */
  data: AdherenceDay[]
  /** Adherence target %; at or above reads as on-track. Default 80. */
  target?: number
  /** Window label for the tooltip/label, e.g. "7 days". */
  windowLabel?: React.ReactNode
  size?: "sm" | "default"
}

/**
 * Ring of the share of scheduled doses taken over a window, with the streak of
 * fully-adherent days at the centre and a taken/missed/skipped breakdown in the
 * tooltip. Below target reads neutral, never destructive — missed and
 * intentionally-skipped doses are different behaviours and neither is shamed.
 */
function AdherenceRing({
  data,
  target = 80,
  windowLabel,
  size = "default",
  className,
  ...props
}: AdherenceRingProps) {
  const scheduled = data.reduce((s, d) => s + d.scheduled, 0)
  const taken = data.reduce((s, d) => s + d.taken, 0)
  const skipped = data.reduce((s, d) => s + (d.skipped ?? 0), 0)
  const missed = Math.max(0, scheduled - taken - skipped)
  const pct = scheduled > 0 ? Math.round((taken / scheduled) * 100) : 0

  // Streak: consecutive most-recent days with every scheduled dose taken.
  let streak = 0
  for (let i = data.length - 1; i >= 0; i--) {
    const day = data[i]!
    if (day.scheduled > 0 && day.taken >= day.scheduled) streak++
    else break
  }

  const onTrack = pct >= target
  const toneClass = onTrack ? "text-primary" : "text-muted-foreground"

  const sc = sizeConfig[size]
  const r = (sc.box - sc.stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - pct / 100)

  const accessibleName = `Medication adherence ${pct} percent${
    windowLabel && typeof windowLabel === "string" ? ` over ${windowLabel}` : ""
  }. ${taken} taken, ${missed} missed, ${skipped} intentionally skipped of ${scheduled} scheduled.${
    streak > 0 ? ` Current streak ${streak} ${streak === 1 ? "day" : "days"}.` : ""
  }`

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          data-slot="adherence-ring"
          data-on-track={onTrack || undefined}
          role="img"
          aria-label={accessibleName}
          className={cn("relative inline-flex shrink-0", className)}
          style={{ width: sc.box, height: sc.box }}
          {...props}
        >
          <svg
            width={sc.box}
            height={sc.box}
            viewBox={`0 0 ${sc.box} ${sc.box}`}
            className={toneClass}
            aria-hidden
          >
            <circle
              cx={sc.box / 2}
              cy={sc.box / 2}
              r={r}
              fill="none"
              strokeWidth={sc.stroke}
              className="stroke-current opacity-15"
            />
            <circle
              cx={sc.box / 2}
              cy={sc.box / 2}
              r={r}
              fill="none"
              strokeWidth={sc.stroke}
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${sc.box / 2} ${sc.box / 2})`}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className={cn("font-bold tabular-nums", sc.pct, toneClass)}>
              {pct}%
            </span>
            {streak > 0 && (
              <span className={cn("text-muted-foreground mt-0.5 font-medium", sc.sub)}>
                {streak}d streak
              </span>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-semibold">
          {pct}% adherence
          {windowLabel && (
            <span className="text-background/60 font-normal"> · {windowLabel}</span>
          )}
        </p>
        <p className="text-background/70 mt-0.5 text-[11px] tabular-nums">
          {taken} taken · {missed} missed · {skipped} skipped
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export { AdherenceRing }
