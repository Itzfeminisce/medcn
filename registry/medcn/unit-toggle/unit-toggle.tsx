"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export interface UnitOption {
  /** The value emitted on change — e.g. "mg/dL". */
  value: string
  /** Short label on the control. Defaults to `value`. */
  label?: React.ReactNode
  /** Spoken name, e.g. "milligrams per decilitre". */
  description?: string
}

export interface UnitToggleProps
  extends Omit<
    React.ComponentProps<typeof ToggleGroup>,
    "type" | "value" | "onValueChange" | "children"
  > {
  units: UnitOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (unit: string) => void
  /** Accessible name — say which measurement it switches, not just "units". */
  label?: string
}

/**
 * Switches the unit a value is displayed in (mg/dL ↔ mmol/L, kg ↔ lb, °C ↔ °F).
 *
 * It emits the selected unit and nothing else: the caller performs the
 * conversion, so rounding and precision stay under test in the consumer's code
 * rather than being decided here. Unit ambiguity is a documented source of
 * clinical harm — pair this with a value that always displays its active unit,
 * never with one that silently changes meaning.
 */
function UnitToggle({
  units,
  value,
  defaultValue,
  onValueChange,
  label = "Display unit",
  className,
  size = "sm",
  variant = "outline",
  ...props
}: UnitToggleProps) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? units[0]?.value
  )
  const active = value ?? uncontrolled

  const handleChange = (next: string) => {
    // Radix emits "" when the active item is pressed again. A value must always
    // have a unit, so ignore the deselect rather than displaying a bare number.
    if (!next) return
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <ToggleGroup
      type="single"
      value={active}
      onValueChange={handleChange}
      aria-label={label}
      size={size}
      variant={variant}
      className={cn("w-fit", className)}
      {...props}
    >
      {units.map((unit) => (
        <ToggleGroupItem
          key={unit.value}
          value={unit.value}
          aria-label={unit.description ?? unit.value}
          className="font-mono text-xs"
        >
          {unit.label ?? unit.value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { UnitToggle }
