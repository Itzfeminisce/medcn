"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { EmergencyContactCard } from "@/registry/medcn/emergency-contact-card/emergency-contact-card"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import { Label } from "@/registry/medcn/label/label"
import { Switch } from "@/registry/medcn/switch/switch"

export interface EmergencyContactValue {
  name: string
  relationship: string
  phone: string
  isPrimary: boolean
}

const EMPTY: EmergencyContactValue = {
  name: "",
  relationship: "",
  phone: "",
  isPrimary: false,
}

/** Diallable = at least 7 digits (ignoring spaces, dashes, and a leading +). */
function isDiallable(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 7
}

export interface EmergencyContactFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: EmergencyContactValue
  defaultValue?: EmergencyContactValue
  onValueChange?: (value: EmergencyContactValue) => void
  showPreview?: boolean
  disabled?: boolean
}

/**
 * Emergency-contact form that renders a live EmergencyContactCard preview and
 * emits a structured contact. Validates that the number is diallable, not that
 * it is prettily formatted.
 */
function EmergencyContactField({
  value,
  defaultValue,
  onValueChange,
  showPreview = true,
  disabled,
  className,
  ...props
}: EmergencyContactFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<EmergencyContactValue>(
    defaultValue ?? EMPTY
  )
  const current = isControlled ? value : internal

  function commit(patch: Partial<EmergencyContactValue>) {
    const next = { ...current, ...patch }
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const phoneInvalid = current.phone.trim() !== "" && !isDiallable(current.phone)
  const canPreview = current.name.trim() !== "" && isDiallable(current.phone)

  return (
    <div
      data-slot="emergency-contact-field"
      className={cn("flex w-full max-w-xs flex-col gap-4", className)}
      {...props}
    >
      <Field label="Full name" required>
        <Input
          placeholder="Jordan Rivera"
          disabled={disabled}
          value={current.name}
          onChange={(e) => commit({ name: e.target.value })}
        />
      </Field>

      <Field label="Relationship">
        <Input
          placeholder="Spouse, parent, friend…"
          disabled={disabled}
          value={current.relationship}
          onChange={(e) => commit({ relationship: e.target.value })}
        />
      </Field>

      <Field
        label="Phone"
        required
        error={phoneInvalid ? "Enter a diallable phone number." : undefined}
      >
        <Input
          type="tel"
          inputMode="tel"
          placeholder="+1 555 010 0134"
          disabled={disabled}
          value={current.phone}
          onChange={(e) => commit({ phone: e.target.value })}
        />
      </Field>

      <Label className="justify-between font-normal">
        Primary emergency contact
        <Switch
          checked={current.isPrimary}
          onCheckedChange={(c) => commit({ isPrimary: c })}
          disabled={disabled}
        />
      </Label>

      {showPreview && canPreview && (
        <EmergencyContactCard
          name={current.name}
          relationship={current.relationship || undefined}
          phone={current.phone}
          isPrimary={current.isPrimary}
        />
      )}
    </div>
  )
}

export { EmergencyContactField, isDiallable }
