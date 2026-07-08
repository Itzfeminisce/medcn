"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { DateField } from "@/registry/medcn/date-field/date-field"
import { Field } from "@/registry/medcn/field/field"

/** Whole years between a DOB and an "as of" date, or null if DOB is in the future. */
function ageAt(dobIso: string, asOf: Date): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobIso)
  if (!m) return null
  const dob = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (dob.getTime() > asOf.getTime()) return null
  let age = asOf.getFullYear() - dob.getFullYear()
  const beforeBirthday =
    asOf.getMonth() < dob.getMonth() ||
    (asOf.getMonth() === dob.getMonth() && asOf.getDate() < dob.getDate())
  if (beforeBirthday) age -= 1
  return age
}

export interface DateOfBirthFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: string
  defaultValue?: string
  onValueChange?: (iso: string | undefined) => void
  /** Minimum age in years; below it the field flags (never silently blocks). */
  minAge?: number
  /** Date to compute age against; defaults to today. */
  asOf?: Date
  label?: React.ReactNode
  order?: "dmy" | "mdy" | "ymd"
  disabled?: boolean
}

/**
 * Typed day/month/year date-of-birth entry with a live age readout and a
 * configurable minimum-age gate. The gate flags rather than silently blocking,
 * so the reason is visible; age is computed at a caller-supplied "as of" date.
 */
function DateOfBirthField({
  value,
  defaultValue,
  onValueChange,
  minAge,
  asOf,
  label = "Date of birth",
  order = "dmy",
  disabled,
  className,
  ...props
}: DateOfBirthFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue
  )
  const iso = isControlled ? value : internal

  const asOfDate = asOf ?? new Date()
  const age = iso ? ageAt(iso, asOfDate) : null
  const isFuture = iso != null && iso !== "" && age === null
  const underAge = age != null && minAge != null && age < minAge

  const error = isFuture
    ? "Date of birth cannot be in the future."
    : underAge
      ? `Must be at least ${minAge} years old — entered age is ${age}.`
      : undefined

  function commit(next: string | undefined) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const description =
    !error && age != null ? `Age ${age}` : !error ? "Enter a full date." : undefined

  return (
    <div
      data-slot="date-of-birth-field"
      className={cn("w-full max-w-xs", className)}
      {...props}
    >
      <Field label={label} description={description} error={error}>
        {(controlProps) => (
          <DateField
            {...controlProps}
            order={order}
            value={iso}
            onValueChange={commit}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
          />
        )}
      </Field>
    </div>
  )
}

export { DateOfBirthField, ageAt }
