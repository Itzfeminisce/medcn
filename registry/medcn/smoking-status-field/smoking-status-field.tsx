"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { DateField } from "@/registry/medcn/date-field/date-field"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import { Label } from "@/registry/medcn/label/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/medcn/radio-group/radio-group"

export type SmokingStatus = "never" | "former" | "current"

export interface SmokingStatusValue {
  status: SmokingStatus
  cigsPerDay: number | null
  years: number | null
  /** Quit date (ISO YYYY-MM-DD) — former smokers only. */
  quitDate?: string
}

const STATUS_OPTIONS: { value: SmokingStatus; label: string }[] = [
  { value: "never", label: "Never smoked" },
  { value: "former", label: "Former smoker" },
  { value: "current", label: "Current smoker" },
]

const EMPTY: SmokingStatusValue = {
  status: "never",
  cigsPerDay: null,
  years: null,
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/** Pack-years = (cigarettes per day ÷ 20) × years smoked. */
function packYears(cigsPerDay: number | null, years: number | null): number | null {
  if (cigsPerDay == null || years == null) return null
  return Math.round((cigsPerDay / 20) * years * 10) / 10
}

export interface SmokingStatusFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: SmokingStatusValue
  defaultValue?: SmokingStatusValue
  onValueChange?: (value: SmokingStatusValue) => void
  disabled?: boolean
}

/**
 * Structured smoking status (never / former / current) with conditional
 * pack-years quantification and a quit date for former smokers.
 */
function SmokingStatusField({
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: SmokingStatusFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<SmokingStatusValue>(
    defaultValue ?? EMPTY
  )
  const current = isControlled ? value : internal
  const fieldId = React.useId()

  function commit(patch: Partial<SmokingStatusValue>) {
    const next = { ...current, ...patch }
    // "Never" carries no quantity — clear derived fields.
    if (next.status === "never") {
      next.cigsPerDay = null
      next.years = null
      next.quitDate = undefined
    }
    if (next.status === "current") next.quitDate = undefined
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const py = packYears(current.cigsPerDay, current.years)
  const quantify = current.status !== "never"

  return (
    <div
      data-slot="smoking-status-field"
      className={cn("flex w-full max-w-xs flex-col gap-4", className)}
      {...props}
    >
      <RadioGroup
        value={current.status}
        onValueChange={(v) => commit({ status: v as SmokingStatus })}
        disabled={disabled}
      >
        {STATUS_OPTIONS.map((opt) => (
          <Label
            key={opt.value}
            htmlFor={`${fieldId}-${opt.value}`}
            className="font-normal"
          >
            <RadioGroupItem
              id={`${fieldId}-${opt.value}`}
              value={opt.value}
            />
            {opt.label}
          </Label>
        ))}
      </RadioGroup>

      {quantify && (
        <div className="flex flex-col gap-4 border-l-2 border-border/60 pl-4">
          <div className="flex items-start gap-3">
            <Field label="Cigarettes/day" className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="20"
                disabled={disabled}
                value={current.cigsPerDay ?? ""}
                onChange={(e) =>
                  commit({ cigsPerDay: parseNum(e.target.value) })
                }
              />
            </Field>
            <Field label="Years smoked" className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="15"
                disabled={disabled}
                value={current.years ?? ""}
                onChange={(e) => commit({ years: parseNum(e.target.value) })}
              />
            </Field>
          </div>

          {current.status === "former" && (
            <Field label="Quit date">
              {(controlProps) => (
                <DateField
                  {...controlProps}
                  value={current.quitDate}
                  onValueChange={(iso) => commit({ quitDate: iso })}
                  disabled={disabled}
                />
              )}
            </Field>
          )}

          <p className="text-sm">
            <span className="text-muted-foreground">Pack-years: </span>
            <span className="font-semibold tabular-nums">
              {py != null ? py : "—"}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export { SmokingStatusField, packYears }
