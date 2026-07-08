"use client"

import * as React from "react"
import { CalculatorIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"

export interface WeightBasedDoseValue {
  mgPerKg: number | null
  weightKg: number | null
  /** Final dose after cap + rounding, or null if inputs are incomplete. */
  dose: number | null
  /** Whether the max-dose cap was applied. */
  capped: boolean
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}

function trim(n: number): number {
  return Math.round(n * 100) / 100
}

export interface WeightBasedDoseFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  defaultValue?: { mgPerKg?: number | null; weightKg?: number | null }
  onValueChange?: (value: WeightBasedDoseValue) => void
  /** Maximum dose cap in `unit`; the computed dose never exceeds it. */
  maxDose?: number
  /** Round the dose down to the nearest dispensable increment (e.g. 25). */
  roundTo?: number
  /** Dose unit label. */
  unit?: string
  disabled?: boolean
}

/**
 * Weight-based dose calculator (mg/kg × weight) that always shows its working,
 * the weight used, and whether a cap was applied — the numbers a bare computed
 * dose would hide. It performs arithmetic only; it is not a dosing authority.
 */
function WeightBasedDoseField({
  defaultValue,
  onValueChange,
  maxDose,
  roundTo,
  unit = "mg",
  disabled,
  className,
  ...props
}: WeightBasedDoseFieldProps) {
  const [mgPerKgStr, setMgPerKgStr] = React.useState(() =>
    defaultValue?.mgPerKg != null ? String(defaultValue.mgPerKg) : ""
  )
  const [weightStr, setWeightStr] = React.useState(() =>
    defaultValue?.weightKg != null ? String(defaultValue.weightKg) : ""
  )

  const mgPerKg = parseNum(mgPerKgStr)
  const weightKg = parseNum(weightStr)

  const rawDose = mgPerKg != null && weightKg != null ? trim(mgPerKg * weightKg) : null
  const capped = rawDose != null && maxDose != null && rawDose > maxDose
  const afterCap = rawDose == null ? null : capped ? maxDose! : rawDose
  const dose =
    afterCap == null
      ? null
      : roundTo && roundTo > 0
        ? Math.floor(afterCap / roundTo) * roundTo
        : afterCap

  // Emit on every change without re-triggering from our own render.
  const emitRef = React.useRef(onValueChange)
  emitRef.current = onValueChange
  React.useEffect(() => {
    emitRef.current?.({ mgPerKg, weightKg, dose, capped })
  }, [mgPerKg, weightKg, dose, capped])

  return (
    <div
      data-slot="weight-based-dose-field"
      className={cn("flex w-full max-w-xs flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Field label={`Dose (${unit}/kg)`} className="flex-1">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="12"
            disabled={disabled}
            value={mgPerKgStr}
            onChange={(e) => setMgPerKgStr(e.target.value)}
          />
        </Field>
        <Field label="Weight (kg)" className="flex-1">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="18"
            disabled={disabled}
            value={weightStr}
            onChange={(e) => setWeightStr(e.target.value)}
          />
        </Field>
      </div>

      <div
        data-slot="weight-based-dose-field-working"
        className="bg-muted/40 flex items-start gap-2 rounded-lg border border-border/60 px-3.5 py-3 text-sm"
      >
        <CalculatorIcon
          className="text-muted-foreground mt-0.5 size-4 shrink-0"
          aria-hidden
        />
        {dose == null ? (
          <span className="text-muted-foreground">
            Enter a dose rate and weight.
          </span>
        ) : (
          <span className="leading-relaxed">
            <span className="tabular-nums">
              {mgPerKg} {unit}/kg × {weightKg} kg ={" "}
            </span>
            <span className="tabular-nums font-semibold">
              {rawDose} {unit}
            </span>
            {capped && (
              <span className="text-warning-foreground dark:text-warning tabular-nums">
                {" "}
                · capped at {maxDose} {unit}
              </span>
            )}
            {dose !== afterCap && (
              <span className="text-muted-foreground tabular-nums">
                {" "}
                · rounded to {dose} {unit}
              </span>
            )}
            <span className="mt-1 block">
              <span className="text-muted-foreground">Give </span>
              <span className="text-base font-bold tabular-nums">
                {dose} {unit}
              </span>
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

export { WeightBasedDoseField }
