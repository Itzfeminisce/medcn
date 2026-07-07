"use client"

import * as React from "react"
import { AngryIcon, FrownIcon, MehIcon, SmileIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

type Tone = "none" | "mild" | "moderate" | "severe" | "worst"

function toneFor(value: number): Tone {
  if (value === 0) return "none"
  if (value <= 3) return "mild"
  if (value <= 6) return "moderate"
  if (value <= 9) return "severe"
  return "worst"
}

const toneMeta: Record<
  Tone,
  { word: string; fill: string; text: string; Face: React.ComponentType<{ className?: string }> }
> = {
  none: { word: "No pain", fill: "bg-success", text: "text-success", Face: SmileIcon },
  mild: { word: "Mild", fill: "bg-success", text: "text-success", Face: SmileIcon },
  moderate: {
    word: "Moderate",
    fill: "bg-warning",
    text: "text-warning-foreground dark:text-warning",
    Face: MehIcon,
  },
  severe: { word: "Severe", fill: "bg-destructive", text: "text-destructive", Face: FrownIcon },
  worst: { word: "Worst possible", fill: "bg-destructive", text: "text-destructive", Face: AngryIcon },
}

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export interface PainScaleProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /** Controlled score, 0–10. `null` = not yet reported. */
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number) => void
  /** Display-only mode for charts/records. */
  readOnly?: boolean
  /** Show a Wong–Baker-style face for the current score (paediatric/low-literacy). */
  showFaces?: boolean
  minLabel?: React.ReactNode
  maxLabel?: React.ReactNode
}

/**
 * 0–10 numeric pain rating scale (NRS) as a segmented radiogroup with descriptor
 * anchors and optional faces. Self-reported only — the score is never derived.
 * Arrow keys move the selection; the value is always announced as text.
 */
function PainScale({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  readOnly = false,
  showFaces = false,
  minLabel = "No pain",
  maxLabel = "Worst possible",
  className,
  "aria-label": ariaLabel = "Pain score, 0 to 10",
  ...props
}: PainScaleProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<number | null>(defaultValue)
  const value = isControlled ? valueProp : internal
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const select = (next: number) => {
    if (readOnly) return
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return
    const current = value ?? 0
    let next: number | null = null
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(10, current + 1)
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, current - 1)
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = 10
    if (next !== null) {
      e.preventDefault()
      select(next)
      btnRefs.current[next]?.focus()
    }
  }

  const meta = value !== null ? toneMeta[toneFor(value)] : undefined

  return (
    <div
      data-slot="pain-scale"
      className={cn("flex w-full max-w-md flex-col gap-2", className)}
      {...props}
    >
      {(showFaces || value !== null) && (
        <div className="flex h-6 items-center gap-2" aria-hidden>
          {meta && (
            <>
              {showFaces && <meta.Face className={cn("size-5", meta.text)} />}
              <span className={cn("text-sm font-semibold", meta.text)}>
                {value}
                <span className="text-muted-foreground font-normal"> · {meta.word}</span>
              </span>
            </>
          )}
          {value === null && (
            <span className="text-muted-foreground text-sm">Not reported</span>
          )}
        </div>
      )}

      <div
        role={readOnly ? "img" : "radiogroup"}
        aria-label={
          readOnly
            ? `Pain score ${value ?? "not reported"} out of 10`
            : ariaLabel
        }
        onKeyDown={onKeyDown}
        className="flex items-center gap-1"
      >
        {SCORES.map((score) => {
          const selected = value === score
          const t = toneMeta[toneFor(score)]
          return (
            <button
              key={score}
              ref={(el) => {
                btnRefs.current[score] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${score} out of 10${
                score === 0 ? ", no pain" : score === 10 ? ", worst possible" : ""
              }`}
              tabIndex={readOnly ? -1 : selected || (value === null && score === 0) ? 0 : -1}
              disabled={readOnly}
              onClick={() => select(score)}
              className={cn(
                "flex h-9 flex-1 items-center justify-center rounded-md text-sm font-semibold tabular-nums transition-all",
                "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                selected
                  ? cn(t.fill, "text-white shadow-soft scale-105", score === 10 && "motion-safe:animate-pulse")
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
                readOnly && !selected && "opacity-50",
                !readOnly && "cursor-pointer"
              )}
            >
              {score}
            </button>
          )
        })}
      </div>

      <div className="text-muted-foreground flex justify-between text-[11px] font-medium">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

export { PainScale }
