import * as React from "react"
import { DropletIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type GlucoseCategory =
  | "low"
  | "normal"
  | "elevated"
  | "high"
  | "veryHigh"

export type GlucoseUnit = "mmol/L" | "mg/dL"

export type GlucoseContext = "fasting" | "post-meal" | "random" | "bedtime"

/** mg/dL per 1 mmol/L (molar mass of glucose ≈ 180.16 g/mol). */
const MGDL_PER_MMOL = 18.0182

/**
 * Context-specific ascending cutoffs in mg/dL used for auto-classification.
 * Informational defaults only — thresholds vary by diabetic status and target,
 * so consumers pass `category` when their own pipeline classifies readings.
 * A value below `lowMax` is Low; ≤ `normalMax` In range; ≤ `elevatedMax`
 * Elevated; ≤ `highMax` High; anything above is Very high.
 */
const THRESHOLDS: Record<
  GlucoseContext,
  { lowMax: number; normalMax: number; elevatedMax: number; highMax: number }
> = {
  fasting: { lowMax: 70, normalMax: 99, elevatedMax: 125, highMax: 179 },
  "post-meal": { lowMax: 70, normalMax: 139, elevatedMax: 199, highMax: 249 },
  random: { lowMax: 70, normalMax: 139, elevatedMax: 199, highMax: 249 },
  bedtime: { lowMax: 90, normalMax: 150, elevatedMax: 180, highMax: 249 },
}

const CONTEXT_LABEL: Record<GlucoseContext, string> = {
  fasting: "Fasting",
  "post-meal": "Post-meal",
  random: "Random",
  bedtime: "Bedtime",
}

/** Classify a reading. `value` is interpreted in `unit`; comparison is done in mg/dL. */
function classifyGlucose(
  value: number,
  unit: GlucoseUnit,
  context: GlucoseContext
): GlucoseCategory {
  const mgdl = unit === "mg/dL" ? value : value * MGDL_PER_MMOL
  const t = THRESHOLDS[context]
  if (mgdl < t.lowMax) return "low"
  if (mgdl <= t.normalMax) return "normal"
  if (mgdl <= t.elevatedMax) return "elevated"
  if (mgdl <= t.highMax) return "high"
  return "veryHigh"
}

const ORDER: GlucoseCategory[] = [
  "low",
  "normal",
  "elevated",
  "high",
  "veryHigh",
]

const categoryMeta: Record<
  GlucoseCategory,
  { label: string; fill: string; text: string }
> = {
  low: {
    label: "Low",
    fill: "bg-warning",
    text: "text-warning-foreground dark:text-warning",
  },
  normal: { label: "In range", fill: "bg-success", text: "text-success" },
  elevated: {
    label: "Elevated",
    fill: "bg-warning",
    text: "text-warning-foreground dark:text-warning",
  },
  high: { label: "High", fill: "bg-destructive", text: "text-destructive" },
  veryHigh: {
    label: "Very high",
    fill: "bg-destructive",
    text: "text-destructive",
  },
}

const UNIT_SPOKEN: Record<GlucoseUnit, string> = {
  "mmol/L": "millimoles per litre",
  "mg/dL": "milligrams per decilitre",
}

export interface GlucoseBadgeProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  value: number
  /** Explicit — never guessed, since the same number means different things per unit. */
  unit: GlucoseUnit
  context: GlucoseContext
  /** Override the auto-derived category. */
  category?: GlucoseCategory
  /** Show the category label + spectrum gauge column. Default: true. */
  showCategoryLabel?: boolean
  size?: "sm" | "default"
}

/**
 * Blood-glucose reading rendered as a compact gauge, sibling of
 * BloodPressureBadge: a tabular value + unit + context tag beside a
 * five-segment spectrum that lights the active category. Because Low and the
 * high bands are both abnormal, only the active segment is lit (no cumulative
 * fill) — the spectrum is positional, not an ordinal severity ramp.
 */
function GlucoseBadge({
  value,
  unit,
  context,
  category: categoryProp,
  showCategoryLabel = true,
  size = "default",
  className,
  ...props
}: GlucoseBadgeProps) {
  const category = categoryProp ?? classifyGlucose(value, unit, context)
  const meta = categoryMeta[category]
  const activeIndex = ORDER.indexOf(category)
  const contextLabel = CONTEXT_LABEL[context]
  const accessibleName = `${value} ${UNIT_SPOKEN[unit]}, ${contextLabel.toLowerCase()} glucose, ${meta.label.toLowerCase()}`
  const compact = size === "sm"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          data-slot="glucose-badge"
          data-category={category}
          role="img"
          aria-label={accessibleName}
          className={cn(
            "bg-card inline-flex items-stretch gap-3 rounded-xl border border-border/60 shadow-soft",
            compact ? "px-2.5 py-1.5" : "px-3.5 py-2.5",
            className
          )}
          {...props}
        >
          {/* Reading: value + unit, tabular numerals */}
          <span className="flex items-center gap-2">
            <DropletIcon
              className={cn(
                meta.text,
                compact ? "size-3.5" : "size-4",
                category === "veryHigh" && "motion-safe:animate-pulse"
              )}
              aria-hidden
            />
            <span className="flex flex-col leading-none">
              <span
                data-slot="glucose-badge-reading"
                className={cn(
                  "font-bold tabular-nums tracking-tight",
                  compact ? "text-sm" : "text-lg"
                )}
              >
                {value}
              </span>
              {!compact && (
                <span className="text-muted-foreground/70 mt-0.5 text-[10px] font-medium uppercase tracking-wide">
                  {unit} · {contextLabel}
                </span>
              )}
            </span>
          </span>

          {showCategoryLabel && (
            <span className="border-border/50 flex flex-col justify-center gap-1.5 border-l pl-3">
              <span
                data-slot="glucose-badge-label"
                className={cn(
                  "font-semibold leading-none",
                  compact ? "text-[10px]" : "text-xs",
                  meta.text
                )}
              >
                {meta.label}
              </span>
              {/* Five-segment spectrum; only the active category is lit */}
              <span
                data-slot="glucose-badge-gauge"
                className="flex items-center gap-0.5"
                aria-hidden
              >
                {ORDER.map((seg, i) => {
                  const active = i === activeIndex
                  return (
                    <span
                      key={seg}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        active
                          ? cn(categoryMeta[seg].fill, "w-4")
                          : "bg-muted-foreground/20 w-1.5"
                      )}
                    />
                  )
                })}
              </span>
            </span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{meta.label}</p>
        <p className="text-background/70 text-[11px]">
          {value} {unit} · {contextLabel.toLowerCase()}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export { GlucoseBadge, classifyGlucose }
