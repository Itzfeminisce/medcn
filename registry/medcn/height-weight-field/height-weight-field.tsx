"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { BmiGauge } from "@/registry/medcn/bmi-gauge/bmi-gauge"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export type HeightWeightUnit = "metric" | "imperial"

export interface HeightWeightValue {
  /** Canonical height in centimetres, regardless of display unit. */
  heightCm: number | null
  /** Canonical weight in kilograms, regardless of display unit. */
  weightKg: number | null
}

const CM_PER_IN = 2.54
const KG_PER_LB = 0.45359237

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export interface HeightWeightFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  defaultValue?: HeightWeightValue
  onValueChange?: (value: HeightWeightValue) => void
  /** Initial display unit. */
  defaultUnit?: HeightWeightUnit
  /** Hide the live BmiGauge (e.g. paediatric/pregnancy callers). */
  showGauge?: boolean
  disabled?: boolean
}

/**
 * Height + weight entry with a metric/imperial toggle and a live BmiGauge.
 * Switching units converts the entered values rather than clearing them;
 * output is always canonical kg/cm regardless of the display unit.
 */
function HeightWeightField({
  defaultValue,
  onValueChange,
  defaultUnit = "metric",
  showGauge = true,
  disabled,
  className,
  ...props
}: HeightWeightFieldProps) {
  const [unit, setUnit] = React.useState<HeightWeightUnit>(defaultUnit)

  const seed = (v: number | null | undefined, toImperial: (cm: number) => number) => {
    if (v == null) return ""
    return String(defaultUnit === "imperial" ? round1(toImperial(v)) : round1(v))
  }
  const [heightStr, setHeightStr] = React.useState(() =>
    seed(defaultValue?.heightCm, (cm) => cm / CM_PER_IN)
  )
  const [weightStr, setWeightStr] = React.useState(() =>
    seed(defaultValue?.weightKg, (kg) => kg / KG_PER_LB)
  )

  const toCanonical = React.useCallback(
    (h: string, w: string, u: HeightWeightUnit): HeightWeightValue => {
      const hv = parseNum(h)
      const wv = parseNum(w)
      return {
        heightCm:
          hv == null ? null : round1(u === "imperial" ? hv * CM_PER_IN : hv),
        weightKg:
          wv == null ? null : round1(u === "imperial" ? wv * KG_PER_LB : wv),
      }
    },
    []
  )

  const canonical = toCanonical(heightStr, weightStr, unit)

  function emit(h: string, w: string, u: HeightWeightUnit) {
    onValueChange?.(toCanonical(h, w, u))
  }

  function changeHeight(v: string) {
    setHeightStr(v)
    emit(v, weightStr, unit)
  }
  function changeWeight(v: string) {
    setWeightStr(v)
    emit(heightStr, v, unit)
  }

  function switchUnit(next: HeightWeightUnit) {
    if (next === unit) return
    // Convert the displayed values so nothing is lost on the toggle.
    const { heightCm, weightKg } = canonical
    const h =
      heightCm == null
        ? ""
        : String(next === "imperial" ? round1(heightCm / CM_PER_IN) : round1(heightCm))
    const w =
      weightKg == null
        ? ""
        : String(next === "imperial" ? round1(weightKg / KG_PER_LB) : round1(weightKg))
    setUnit(next)
    setHeightStr(h)
    setWeightStr(w)
    emit(h, w, next)
  }

  const metric = unit === "metric"

  return (
    <div
      data-slot="height-weight-field"
      className={cn("flex w-full max-w-xs flex-col gap-4", className)}
      {...props}
    >
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={unit}
        onValueChange={(v) => v && switchUnit(v as HeightWeightUnit)}
        disabled={disabled}
        className="w-full"
      >
        <ToggleGroupItem value="metric">Metric</ToggleGroupItem>
        <ToggleGroupItem value="imperial">Imperial</ToggleGroupItem>
      </ToggleGroup>

      <div className="flex items-start gap-3">
        <Field label={metric ? "Height (cm)" : "Height (in)"} className="flex-1">
          <Input
            type="number"
            inputMode="decimal"
            placeholder={metric ? "175" : "69"}
            disabled={disabled}
            value={heightStr}
            onChange={(e) => changeHeight(e.target.value)}
          />
        </Field>
        <Field label={metric ? "Weight (kg)" : "Weight (lb)"} className="flex-1">
          <Input
            type="number"
            inputMode="decimal"
            placeholder={metric ? "72" : "159"}
            disabled={disabled}
            value={weightStr}
            onChange={(e) => changeWeight(e.target.value)}
          />
        </Field>
      </div>

      {showGauge && canonical.heightCm != null && canonical.weightKg != null && (
        <BmiGauge
          height={canonical.heightCm}
          weight={canonical.weightKg}
          units="metric"
        />
      )}
    </div>
  )
}

export { HeightWeightField }
