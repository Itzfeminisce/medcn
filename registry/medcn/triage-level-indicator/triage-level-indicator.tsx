import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

type TriageLevel = 1 | 2 | 3 | 4 | 5

const defaultLabels: Record<TriageLevel, string> = {
  1: "Immediate",
  2: "Emergent",
  3: "Urgent",
  4: "Less urgent",
  5: "Non-urgent",
}

const levelTone: Record<
  TriageLevel,
  { fill: string; text: string; ring: string }
> = {
  1: { fill: "bg-destructive",        text: "text-destructive",             ring: "ring-destructive/40" },
  2: { fill: "bg-destructive/70",     text: "text-destructive",             ring: "ring-destructive/30" },
  3: { fill: "bg-warning",            text: "text-warning-foreground dark:text-warning", ring: "ring-warning/40" },
  4: { fill: "bg-info",               text: "text-info",                    ring: "ring-info/40" },
  5: { fill: "bg-muted-foreground/40", text: "text-muted-foreground",       ring: "ring-muted-foreground/30" },
}

const sizeConfig = {
  sm:      { seg: "h-4 w-4 text-[9px]",  label: "text-[11px]", gap: "gap-1.5" },
  default: { seg: "h-5 w-5 text-[10px]", label: "text-xs",     gap: "gap-2" },
  lg:      { seg: "h-7 w-7 text-xs",     label: "text-sm",     gap: "gap-2.5" },
} as const

export interface TriageLevelIndicatorProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  level: TriageLevel
  /** Override the default level label. */
  label?: React.ReactNode
  /** Prefix the label with "L{n} · ". */
  showLevel?: boolean
  size?: "sm" | "default" | "lg"
}

/**
 * ESI/MTS acuity indicator drawn as a five-cell strip (1 = resuscitation →
 * 5 = non-urgent). The active cell is filled in its own tone, raised, and
 * carries a caret; level 1 pulses (reduced-motion safe). Classification is
 * informational UI — consumers own clinical validation.
 */
function TriageLevelIndicator({
  level,
  label,
  showLevel = false,
  size = "default",
  className,
  ...props
}: TriageLevelIndicatorProps) {
  const resolvedLabel = label ?? defaultLabels[level]
  const tone = levelTone[level]
  const sc = sizeConfig[size]
  const accessibleName = `Triage level ${level}, ${
    typeof resolvedLabel === "string" ? resolvedLabel.toLowerCase() : ""
  }`

  return (
    <span
      data-slot="triage-level-indicator"
      data-level={level}
      role="img"
      aria-label={accessibleName}
      className={cn("inline-flex items-center", sc.gap, className)}
      {...props}
    >
      <span
        data-slot="triage-level-indicator-strip"
        className="flex items-center gap-0.5"
        aria-hidden
      >
        {([1, 2, 3, 4, 5] as TriageLevel[]).map((cell) => {
          const active = cell === level
          return (
            <span
              key={cell}
              className={cn(
                "flex items-center justify-center rounded-[5px] font-bold tabular-nums transition-all duration-200",
                sc.seg,
                active
                  ? cn(
                      levelTone[cell].fill,
                      "text-white shadow-soft ring-2",
                      levelTone[cell].ring,
                      "scale-110",
                      cell === 1 && "motion-safe:animate-pulse"
                    )
                  : cn(levelTone[cell].fill, "text-white/70 opacity-25")
              )}
            >
              {cell}
            </span>
          )
        })}
      </span>
      <span
        data-slot="triage-level-indicator-label"
        className={cn("font-semibold leading-none", sc.label, tone.text)}
      >
        {showLevel && <span className="tabular-nums">L{level} · </span>}
        {resolvedLabel}
      </span>
    </span>
  )
}

export { TriageLevelIndicator }
