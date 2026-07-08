"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  BloodPressureBadge,
  classifyBP,
} from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"

export interface BloodPressureValue {
  systolic: number | null
  diastolic: number | null
}

const EMPTY: BloodPressureValue = { systolic: null, diastolic: null }

/** Plausible entry bounds — outside these is almost certainly a typo, not a real reading. */
const BOUNDS = {
  systolic: { min: 50, max: 300 },
  diastolic: { min: 20, max: 200 },
}

function parseField(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export interface BloodPressureInputProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: BloodPressureValue
  defaultValue?: BloodPressureValue
  onValueChange?: (value: BloodPressureValue) => void
  disabled?: boolean
  /** Hide the live AHA-category badge (kept visible by default). */
  showBadge?: boolean
}

/**
 * Paired systolic/diastolic entry that renders a live BloodPressureBadge from
 * the same source of truth, so the preview can never disagree with the inputs.
 */
function BloodPressureInput({
  value,
  defaultValue,
  onValueChange,
  disabled,
  showBadge = true,
  className,
  ...props
}: BloodPressureInputProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<BloodPressureValue>(
    defaultValue ?? EMPTY
  )
  const current = isControlled ? value : internal

  function commit(next: BloodPressureValue) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const { systolic, diastolic } = current
  const both = systolic != null && diastolic != null

  // Advisory flags — never block saving (hypertensive crises are real readings).
  const sysOut =
    systolic != null &&
    (systolic < BOUNDS.systolic.min || systolic > BOUNDS.systolic.max)
  const diaOut =
    diastolic != null &&
    (diastolic < BOUNDS.diastolic.min || diastolic > BOUNDS.diastolic.max)
  const inverted = both && systolic <= diastolic

  return (
    <div
      data-slot="blood-pressure-input"
      className={cn("flex w-full max-w-xs flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-end gap-2">
        <Field
          label="Systolic"
          className="flex-1"
          error={sysOut ? "Check value" : undefined}
        >
          <Input
            type="number"
            inputMode="numeric"
            placeholder="120"
            disabled={disabled}
            value={systolic ?? ""}
            onChange={(e) =>
              commit({ ...current, systolic: parseField(e.target.value) })
            }
          />
        </Field>
        <span
          aria-hidden
          className="text-muted-foreground/50 pb-2.5 text-xl font-light"
        >
          /
        </span>
        <Field
          label="Diastolic"
          className="flex-1"
          error={diaOut ? "Check value" : undefined}
        >
          <Input
            type="number"
            inputMode="numeric"
            placeholder="80"
            disabled={disabled}
            value={diastolic ?? ""}
            onChange={(e) =>
              commit({ ...current, diastolic: parseField(e.target.value) })
            }
          />
        </Field>
        <span className="text-muted-foreground pb-2.5 text-xs font-medium">
          mmHg
        </span>
      </div>

      {inverted && (
        <p className="text-warning-foreground dark:text-warning text-xs font-medium">
          Systolic is usually higher than diastolic — double-check the reading.
        </p>
      )}

      {showBadge && both && !inverted && (
        <BloodPressureBadge
          systolic={systolic}
          diastolic={diastolic}
          category={classifyBP(systolic, diastolic)}
        />
      )}
    </div>
  )
}

export { BloodPressureInput }
