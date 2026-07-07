import * as React from "react"
import { ScaleIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese1"
  | "obese2"
  | "obese3"

export type BmiUnits = "metric" | "imperial"

/**
 * WHO adult BMI cutoffs (kg/m²). Population screening bands, not diagnoses.
 * underweight <18.5 · normal 18.5–24.9 · overweight 25–29.9 ·
 * obese I 30–34.9 · obese II 35–39.9 · obese III ≥40.
 */
function classifyBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight"
  if (bmi < 25) return "normal"
  if (bmi < 30) return "overweight"
  if (bmi < 35) return "obese1"
  if (bmi < 40) return "obese2"
  return "obese3"
}

/**
 * BMI from height + weight. `metric` = cm + kg, `imperial` = inches + lb.
 * Returns null for non-positive inputs so callers/UI can degrade gracefully.
 */
function computeBmi(
  height: number,
  weight: number,
  units: BmiUnits
): number | null {
  if (height <= 0 || weight <= 0) return null
  if (units === "imperial") return (703 * weight) / (height * height)
  const m = height / 100
  return weight / (m * m)
}

const ORDER: BmiCategory[] = [
  "underweight",
  "normal",
  "overweight",
  "obese1",
  "obese2",
  "obese3",
]

const categoryMeta: Record<
  BmiCategory,
  { label: string; short: string; fill: string; text: string }
> = {
  underweight: {
    label: "Underweight",
    short: "Under",
    fill: "bg-warning",
    text: "text-warning-foreground dark:text-warning",
  },
  normal: {
    label: "Healthy weight",
    short: "Healthy",
    fill: "bg-success",
    text: "text-success",
  },
  overweight: {
    label: "Overweight",
    short: "Over",
    fill: "bg-warning",
    text: "text-warning-foreground dark:text-warning",
  },
  obese1: {
    label: "Obese I",
    short: "Obese I",
    fill: "bg-destructive",
    text: "text-destructive",
  },
  obese2: {
    label: "Obese II",
    short: "Obese II",
    fill: "bg-destructive",
    text: "text-destructive",
  },
  obese3: {
    label: "Obese III",
    short: "Obese III",
    fill: "bg-destructive",
    text: "text-destructive",
  },
}

type DerivedProps =
  | { bmi: number; height?: never; weight?: never; units?: never }
  | {
      bmi?: never
      height: number
      weight: number
      units?: BmiUnits
    }

export type BmiGaugeProps = Omit<
  React.ComponentProps<"span">,
  "children"
> &
  DerivedProps & {
    /** Override the auto-derived WHO category (e.g. athletes, paediatric percentiles). */
    category?: BmiCategory
    /** Show the category label + spectrum gauge column. Default: true. */
    showCategoryLabel?: boolean
    size?: "sm" | "default"
  }

/**
 * BMI rendered as a compact WHO-band gauge, sibling of BloodPressureBadge:
 * the number beside a six-segment spectrum that lights the active band. Since
 * both underweight and the obese bands are abnormal, only the active segment
 * is lit — the spectrum is positional, not an ordinal severity ramp.
 */
function BmiGauge({
  bmi: bmiProp,
  height,
  weight,
  units = "metric",
  category: categoryProp,
  showCategoryLabel = true,
  size = "default",
  className,
  ...props
}: BmiGaugeProps) {
  const bmi =
    bmiProp ?? computeBmi(height as number, weight as number, units)

  if (bmi == null || !Number.isFinite(bmi)) {
    return (
      <span
        data-slot="bmi-gauge"
        className={cn(
          "bg-card text-muted-foreground inline-flex items-center gap-2 rounded-xl border border-border/60 px-3.5 py-2.5 text-sm shadow-soft",
          className
        )}
        {...props}
      >
        <ScaleIcon className="size-4" aria-hidden />
        BMI unavailable
      </span>
    )
  }

  const category = categoryProp ?? classifyBmi(bmi)
  const meta = categoryMeta[category]
  const activeIndex = ORDER.indexOf(category)
  const rounded = bmi.toFixed(1)
  const accessibleName = `Body mass index ${rounded}, ${meta.label.toLowerCase()}`
  const compact = size === "sm"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          data-slot="bmi-gauge"
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
          {/* BMI number + unit */}
          <span className="flex items-center gap-2">
            <ScaleIcon
              className={cn(meta.text, compact ? "size-3.5" : "size-4")}
              aria-hidden
            />
            <span className="flex flex-col leading-none">
              <span
                data-slot="bmi-gauge-value"
                className={cn(
                  "font-bold tabular-nums tracking-tight",
                  compact ? "text-sm" : "text-lg"
                )}
              >
                {rounded}
              </span>
              {!compact && (
                <span className="text-muted-foreground/70 mt-0.5 text-[10px] font-medium uppercase tracking-wide">
                  kg/m²
                </span>
              )}
            </span>
          </span>

          {showCategoryLabel && (
            <span className="border-border/50 flex flex-col justify-center gap-1.5 border-l pl-3">
              <span
                data-slot="bmi-gauge-label"
                className={cn(
                  "font-semibold leading-none",
                  compact ? "text-[10px]" : "text-xs",
                  meta.text
                )}
              >
                {compact ? meta.short : meta.label}
              </span>
              {/* Six-segment WHO spectrum; only the active band is lit */}
              <span
                data-slot="bmi-gauge-gauge"
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
          BMI {rounded} kg/m² · WHO band
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export { BmiGauge, classifyBmi, computeBmi }
