import * as React from "react"
import { PersonStandingIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

export type FallRiskBand = "low" | "moderate" | "high"

const bandMeta: Record<
  FallRiskBand,
  { label: string; pips: number; text: string; accent: string }
> = {
  low: { label: "Low", pips: 1, text: "text-success", accent: "bg-success" },
  moderate: {
    label: "Moderate",
    pips: 2,
    text: "text-warning-foreground dark:text-warning",
    accent: "bg-warning",
  },
  high: {
    label: "High",
    pips: 3,
    text: "text-destructive",
    accent: "bg-destructive",
  },
}

const sizeConfig = {
  sm: { pad: "px-2.5 py-1.5", icon: "size-3.5", label: "text-[11px]", meta: "text-[10px]" },
  default: { pad: "px-3.5 py-2.5", icon: "size-4", label: "text-xs", meta: "text-[11px]" },
} as const

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Three-pip meter — conveys the band without relying on color alone. */
function RiskPips({ band }: { band: FallRiskBand }) {
  const { pips, accent } = bandMeta[band]
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            i < pips ? accent : "bg-muted-foreground/20"
          )}
        />
      ))}
    </span>
  )
}

export interface FallRiskIndicatorProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** The classified band. Required: thresholds differ by scale, so callers classify. */
  band: FallRiskBand
  /** Raw score for context, e.g. 45. */
  score?: number
  /** Scale maximum, e.g. Morse = 125. */
  maxScore?: number
  /** Scale name — REQUIRED so the score is interpretable (Morse ≠ Hendrich). */
  scale: string
  /** When the assessment was performed — a score without a date is stale data. */
  assessedAt?: Date | string
  size?: "sm" | "default"
}

/**
 * Banded fall-risk chip: named scale, numeric score, a three-pip meter, and
 * the assessment date. The band is passed in — thresholds differ by scale
 * (Morse ≠ Hendrich II), so this component never derives a band from a bare
 * score. Informational UI; consumers own clinical validation.
 */
function FallRiskIndicator({
  band,
  score,
  maxScore,
  scale,
  assessedAt,
  size = "default",
  className,
  ...props
}: FallRiskIndicatorProps) {
  const meta = bandMeta[band]
  const sc = sizeConfig[size]
  const dateLabel = assessedAt ? formatDate(assessedAt) : undefined
  const scoreLabel =
    score !== undefined
      ? `${score}${maxScore !== undefined ? `/${maxScore}` : ""}`
      : undefined

  const accessibleName = [
    `Fall risk ${meta.label.toLowerCase()}`,
    `${scale} scale`,
    scoreLabel ? `score ${scoreLabel}` : undefined,
    dateLabel ? `assessed ${dateLabel}` : "assessment date not recorded",
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div
      data-slot="fall-risk-indicator"
      data-band={band}
      role="img"
      aria-label={accessibleName}
      className={cn(
        "bg-card inline-flex items-center gap-3 rounded-xl border border-border/60 shadow-soft",
        sc.pad,
        className
      )}
      {...props}
    >
      <PersonStandingIcon
        className={cn(meta.text, sc.icon, band === "high" && "motion-safe:animate-pulse")}
        aria-hidden
      />
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 leading-none">
          <span className={cn("font-semibold", sc.label, meta.text)}>
            {meta.label} fall risk
          </span>
          <RiskPips band={band} />
        </span>
        <span className={cn("text-muted-foreground/80 tabular-nums", sc.meta)}>
          {scale}
          {scoreLabel && (
            <>
              <span className="text-muted-foreground/40 mx-1">·</span>
              <span className="text-foreground font-medium">{scoreLabel}</span>
            </>
          )}
          <span className="text-muted-foreground/40 mx-1">·</span>
          {dateLabel ?? "date unknown"}
        </span>
      </div>
    </div>
  )
}

export { FallRiskIndicator }
