"use client"

import * as React from "react"
import { ThermometerIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export type TemperatureUnit = "C" | "F"

export type TemperatureBand =
  | "hypothermia"
  | "normal"
  | "fever"
  | "highFever"

/**
 * Advisory bands on core-equivalent °C. Thresholds shift with measurement
 * site and age, so the band is guidance, not a diagnosis.
 * hypothermia <35 · normal 35–37.4 · fever 37.5–38.9 · high fever ≥39.
 */
function classifyTemp(celsius: number): TemperatureBand {
  if (celsius < 35) return "hypothermia"
  if (celsius < 37.5) return "normal"
  if (celsius < 39) return "fever"
  return "highFever"
}

const bandMeta: Record<TemperatureBand, { label: string; text: string }> = {
  hypothermia: {
    label: "Hypothermia",
    text: "text-info",
  },
  normal: { label: "Normal", text: "text-success" },
  fever: {
    label: "Fever",
    text: "text-warning-foreground dark:text-warning",
  },
  highFever: { label: "High fever", text: "text-destructive" },
}

function cToF(c: number): number {
  return c * 1.8 + 32
}
function fToC(f: number): number {
  return (f - 32) / 1.8
}
function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export interface TemperatureFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /** Initial value in canonical °C. */
  defaultValue?: number | null
  /** Fires with the canonical °C value (or null when cleared). */
  onValueChange?: (celsius: number | null) => void
  defaultUnit?: TemperatureUnit
  /** Field label; pass null to omit (e.g. when a parent supplies the heading). */
  label?: React.ReactNode
  /** Measurement site shown alongside the band, e.g. "Oral", "Axillary". */
  site?: React.ReactNode
  /** Hide the advisory band feedback. */
  showBand?: boolean
  disabled?: boolean
}

/**
 * Temperature entry with a °C/°F toggle and an advisory band. Converts on unit
 * switch; the measurement site is shown alongside because "38.0" means
 * different things oral vs axillary vs rectal.
 */
function TemperatureField({
  defaultValue,
  onValueChange,
  defaultUnit = "C",
  label = "Temperature",
  site = "Oral",
  showBand = true,
  disabled,
  className,
  ...props
}: TemperatureFieldProps) {
  const [unit, setUnit] = React.useState<TemperatureUnit>(defaultUnit)
  const [str, setStr] = React.useState(() => {
    if (defaultValue == null) return ""
    return String(round1(defaultUnit === "F" ? cToF(defaultValue) : defaultValue))
  })

  function toCelsius(v: string, u: TemperatureUnit): number | null {
    const n = parseNum(v)
    if (n == null) return null
    return round1(u === "F" ? fToC(n) : n)
  }

  const celsius = toCelsius(str, unit)

  function change(v: string) {
    setStr(v)
    onValueChange?.(toCelsius(v, unit))
  }

  function switchUnit(next: TemperatureUnit) {
    if (next === unit) return
    const c = celsius
    const v =
      c == null ? "" : String(round1(next === "F" ? cToF(c) : c))
    setUnit(next)
    setStr(v)
    onValueChange?.(toCelsius(v, next))
  }

  const band = celsius != null ? classifyTemp(celsius) : null
  const meta = band ? bandMeta[band] : null

  return (
    <div
      data-slot="temperature-field"
      className={cn("flex w-full max-w-xs flex-col gap-3", className)}
      {...props}
    >
      <Field label={label}>
        {(controlProps) => (
          <div className="flex items-center gap-2">
            <Input
              {...controlProps}
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder={unit === "C" ? "37.0" : "98.6"}
              disabled={disabled}
              value={str}
              onChange={(e) => change(e.target.value)}
              className="flex-1"
            />
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={unit}
              onValueChange={(v) => v && switchUnit(v as TemperatureUnit)}
              disabled={disabled}
            >
              <ToggleGroupItem value="C">°C</ToggleGroupItem>
              <ToggleGroupItem value="F">°F</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
      </Field>

      {showBand && meta && (
        <p className="flex items-center gap-1.5 text-xs">
          <ThermometerIcon className={cn("size-3.5", meta.text)} aria-hidden />
          <span className={cn("font-semibold", meta.text)}>{meta.label}</span>
          {site && (
            <span className="text-muted-foreground">· {site} · advisory</span>
          )}
        </p>
      )}
    </div>
  )
}

export { TemperatureField, classifyTemp }
