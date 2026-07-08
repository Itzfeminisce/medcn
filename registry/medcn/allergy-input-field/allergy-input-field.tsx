"use client"

import * as React from "react"
import { PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  AllergyBadge,
  AllergyList,
  type AllergySeverity,
} from "@/registry/medcn/allergy-badge/allergy-badge"
import { Button } from "@/registry/medcn/button/button"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import { Label } from "@/registry/medcn/label/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/medcn/select/select"

export interface AllergyEntry {
  label: string
  severity?: AllergySeverity
  reaction?: string
}

export interface AllergyInputValue {
  /** Explicit "No known allergies" affirmation — distinct from an empty list. */
  nka: boolean
  allergies: AllergyEntry[]
}

const SEVERITIES: { value: string; label: string }[] = [
  { value: "unspecified", label: "Unspecified" },
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
]

const EMPTY: AllergyInputValue = { nka: false, allergies: [] }

export interface AllergyInputFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: AllergyInputValue
  defaultValue?: AllergyInputValue
  onValueChange?: (value: AllergyInputValue) => void
  /** Optional allergen suggestions for the datalist typeahead. */
  suggestions?: string[]
  disabled?: boolean
}

/**
 * Add-allergy row (allergen + reaction + severity) producing AllergyBadge
 * chips, with an explicit "No known allergies" affirmative state.
 */
function AllergyInputField({
  value,
  defaultValue,
  onValueChange,
  suggestions,
  disabled,
  className,
  ...props
}: AllergyInputFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<AllergyInputValue>(
    defaultValue ?? EMPTY
  )
  const current = isControlled ? value : internal

  const [allergen, setAllergen] = React.useState("")
  const [reaction, setReaction] = React.useState("")
  const [severity, setSeverity] = React.useState("unspecified")
  const listId = React.useId()

  function commit(next: AllergyInputValue) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function addAllergy() {
    const name = allergen.trim()
    if (!name) return
    const entry: AllergyEntry = {
      label: name,
      severity: severity === "unspecified" ? undefined : (severity as AllergySeverity),
      reaction: reaction.trim() || undefined,
    }
    // Adding an allergy revokes any prior NKA affirmation.
    commit({ nka: false, allergies: [...current.allergies, entry] })
    setAllergen("")
    setReaction("")
    setSeverity("unspecified")
  }

  function removeAllergy(index: number) {
    commit({
      ...current,
      allergies: current.allergies.filter((_, i) => i !== index),
    })
  }

  function toggleNka(checked: boolean) {
    // Affirming NKA clears the list; it is a recorded choice, not an empty state.
    commit({ nka: checked, allergies: checked ? [] : current.allergies })
  }

  return (
    <div
      data-slot="allergy-input-field"
      className={cn("flex w-full max-w-md flex-col gap-4", className)}
      {...props}
    >
      {!current.nka && (
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <Field label="Allergen" className="flex-1">
              <Input
                placeholder="e.g. Penicillin"
                list={suggestions ? listId : undefined}
                disabled={disabled}
                value={allergen}
                onChange={(e) => setAllergen(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addAllergy()
                  }
                }}
              />
            </Field>
            <Field label="Reaction" className="flex-1">
              <Input
                placeholder="e.g. Rash"
                disabled={disabled}
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addAllergy()
                  }
                }}
              />
            </Field>
          </div>
          {suggestions && (
            <datalist id={listId}>
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
          <div className="flex items-end gap-2">
            <Field label="Severity" className="flex-1">
              {(controlProps) => (
                <Select
                  value={severity}
                  onValueChange={setSeverity}
                  disabled={disabled}
                >
                  <SelectTrigger {...controlProps} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Button
              type="button"
              variant="outline"
              onClick={addAllergy}
              disabled={disabled || allergen.trim() === ""}
            >
              <PlusIcon />
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Current allergies as removable chips, or the NKA affirmative state. */}
      {current.nka ? (
        <AllergyList allergies={[]} />
      ) : current.allergies.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {current.allergies.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <AllergyBadge
                label={a.label}
                severity={a.severity}
                reaction={a.reaction}
              />
              <button
                type="button"
                onClick={() => removeAllergy(i)}
                disabled={disabled}
                aria-label={`Remove ${a.label}`}
                className="text-muted-foreground hover:text-foreground rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
              >
                <XIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {current.allergies.length === 0 && (
        <Label className="text-muted-foreground font-normal">
          <Checkbox
            checked={current.nka}
            onCheckedChange={(c) => toggleNka(c === true)}
            disabled={disabled}
          />
          No known allergies (confirmed with patient)
        </Label>
      )}
    </div>
  )
}

export { AllergyInputField }
