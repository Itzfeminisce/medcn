import * as React from "react"
import { HeartPulseIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type BPCategory = "normal" | "elevated" | "stage1" | "stage2" | "crisis"

/**
 * AHA blood-pressure category thresholds used for auto-classification.
 * Informational UI only — consumers own clinical validation.
 * normal <120/<80 · elevated 120–129/<80 · stage1 130–139 or 80–89 ·
 * stage2 ≥140 or ≥90 · crisis >180 or >120. Higher of the two wins.
 */
function classifyBP(systolic: number, diastolic: number): BPCategory {
  if (systolic > 180 || diastolic > 120) return "crisis"
  if (systolic >= 140 || diastolic >= 90) return "stage2"
  if (systolic >= 130 || diastolic >= 80) return "stage1"
  if (systolic >= 120 && diastolic < 80) return "elevated"
  return "normal"
}

const ORDER: BPCategory[] = ["normal", "elevated", "stage1", "stage2", "crisis"]

const categoryMeta: Record<
  BPCategory,
  {
    label: string
    /** Tailwind bg token for the lit spectrum segment + marker. */
    fill: string
    /** Text tone for the category label. */
    text: string
  }
> = {
  normal:   { label: "Normal",   fill: "bg-success",     text: "text-success" },
  elevated: { label: "Elevated", fill: "bg-warning",     text: "text-warning-foreground dark:text-warning" },
  stage1:   { label: "Stage 1",  fill: "bg-warning",     text: "text-warning-foreground dark:text-warning" },
  stage2:   { label: "Stage 2",  fill: "bg-destructive", text: "text-destructive" },
  crisis:   { label: "Crisis",   fill: "bg-destructive", text: "text-destructive" },
}

export interface BloodPressureBadgeProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  systolic: number
  diastolic: number
  /** Override auto-derived category. */
  category?: BPCategory
  /** Show the category label + spectrum gauge. Default: true. */
  showCategoryLabel?: boolean
  size?: "sm" | "default"
}

/**
 * Blood-pressure reading rendered as a compact AHA-category gauge: a
 * tabular systolic/diastolic readout beside a five-segment spectrum that
 * lights the active category and drops a marker on it.
 */
function BloodPressureBadge({
  systolic,
  diastolic,
  category: categoryProp,
  showCategoryLabel = true,
  size = "default",
  className,
  ...props
}: BloodPressureBadgeProps) {
  const category = categoryProp ?? classifyBP(systolic, diastolic)
  const meta = categoryMeta[category]
  const activeIndex = ORDER.indexOf(category)
  const accessibleName = `${systolic} over ${diastolic} millimetres of mercury, ${meta.label.toLowerCase()}`
  const compact = size === "sm"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          data-slot="blood-pressure-badge"
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
          {/* Reading: systolic over diastolic, tabular numerals */}
          <span className="flex items-center gap-2">
            <HeartPulseIcon
              className={cn(
                meta.text,
                compact ? "size-3.5" : "size-4",
                category === "crisis" && "motion-safe:animate-pulse"
              )}
              aria-hidden
            />
            <span className="flex flex-col leading-none">
              <span
                data-slot="blood-pressure-badge-reading"
                className={cn(
                  "font-bold tabular-nums tracking-tight",
                  compact ? "text-sm" : "text-lg"
                )}
              >
                {systolic}
                <span className="text-muted-foreground/50 mx-0.5 font-normal">/</span>
                {diastolic}
              </span>
              {!compact && (
                <span className="text-muted-foreground/70 mt-0.5 text-[10px] font-medium uppercase tracking-wide">
                  mmHg
                </span>
              )}
            </span>
          </span>

          {showCategoryLabel && (
            <span className="border-border/50 flex flex-col justify-center gap-1.5 border-l pl-3">
              <span
                data-slot="blood-pressure-badge-label"
                className={cn(
                  "font-semibold leading-none",
                  compact ? "text-[10px]" : "text-xs",
                  meta.text
                )}
              >
                {meta.label}
              </span>
              {/* Five-segment AHA spectrum with an active marker */}
              <span
                data-slot="blood-pressure-badge-gauge"
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
                          : i < activeIndex
                            ? cn(categoryMeta[seg].fill, "w-1.5 opacity-30")
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
          {systolic}/{diastolic} mmHg · AHA category
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export { BloodPressureBadge, classifyBP }
