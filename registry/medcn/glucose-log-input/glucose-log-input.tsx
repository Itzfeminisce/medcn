"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  GlucoseBadge,
  type GlucoseContext,
  type GlucoseUnit,
} from "@/registry/medcn/glucose-badge/glucose-badge"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/medcn/select/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

const MGDL_PER_MMOL = 18.0182

const CONTEXTS: { value: GlucoseContext; label: string }[] = [
  { value: "fasting", label: "Fasting" },
  { value: "post-meal", label: "Post-meal" },
  { value: "random", label: "Random" },
  { value: "bedtime", label: "Bedtime" },
]

export interface GlucoseLogValue {
  value: number | null
  unit: GlucoseUnit
  context: GlucoseContext
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/** Convert a reading between units, rounding to each unit's sensible precision. */
function convert(value: number, from: GlucoseUnit, to: GlucoseUnit): number {
  if (from === to) return value
  if (to === "mg/dL") return Math.round(value * MGDL_PER_MMOL)
  return Math.round((value / MGDL_PER_MMOL) * 10) / 10
}

export interface GlucoseLogInputProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  defaultValue?: GlucoseLogValue
  onValueChange?: (value: GlucoseLogValue) => void
  showBadge?: boolean
  disabled?: boolean
}

/**
 * Blood-glucose entry: reading + explicit unit toggle + context select,
 * rendering a live GlucoseBadge with the context-appropriate classification.
 */
function GlucoseLogInput({
  defaultValue,
  onValueChange,
  showBadge = true,
  disabled,
  className,
  ...props
}: GlucoseLogInputProps) {
  const [unit, setUnit] = React.useState<GlucoseUnit>(
    defaultValue?.unit ?? "mmol/L"
  )
  const [context, setContext] = React.useState<GlucoseContext>(
    defaultValue?.context ?? "fasting"
  )
  const [str, setStr] = React.useState(() =>
    defaultValue?.value != null ? String(defaultValue.value) : ""
  )

  const value = parseNum(str)

  function emit(next: Partial<GlucoseLogValue>) {
    onValueChange?.({
      value: next.value !== undefined ? next.value : value,
      unit: next.unit ?? unit,
      context: next.context ?? context,
    })
  }

  function changeValue(v: string) {
    setStr(v)
    emit({ value: parseNum(v) })
  }

  function switchUnit(next: GlucoseUnit) {
    if (next === unit) return
    // Never guess the unit — convert the entered number explicitly.
    const converted = value != null ? convert(value, unit, next) : null
    const nextStr = converted != null ? String(converted) : ""
    setUnit(next)
    setStr(nextStr)
    emit({ unit: next, value: converted })
  }

  function changeContext(next: GlucoseContext) {
    setContext(next)
    emit({ context: next })
  }

  return (
    <div
      data-slot="glucose-log-input"
      className={cn("flex w-full max-w-xs flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-start gap-2">
        <Field label="Reading" className="flex-1">
          <Input
            type="number"
            inputMode="decimal"
            step={unit === "mmol/L" ? "0.1" : "1"}
            placeholder={unit === "mmol/L" ? "5.4" : "97"}
            disabled={disabled}
            value={str}
            onChange={(e) => changeValue(e.target.value)}
          />
        </Field>
        <Field label="Unit">
          {() => (
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={unit}
              onValueChange={(v) => v && switchUnit(v as GlucoseUnit)}
              disabled={disabled}
            >
              <ToggleGroupItem value="mmol/L">mmol/L</ToggleGroupItem>
              <ToggleGroupItem value="mg/dL">mg/dL</ToggleGroupItem>
            </ToggleGroup>
          )}
        </Field>
      </div>

      <Field label="Context">
        {(controlProps) => (
          <Select
            value={context}
            onValueChange={(v) => changeContext(v as GlucoseContext)}
            disabled={disabled}
          >
            <SelectTrigger {...controlProps} className="w-full">
              <SelectValue placeholder="When was it measured?" />
            </SelectTrigger>
            <SelectContent>
              {CONTEXTS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      {showBadge && value != null && (
        <GlucoseBadge value={value} unit={unit} context={context} />
      )}
    </div>
  )
}

export { GlucoseLogInput }
