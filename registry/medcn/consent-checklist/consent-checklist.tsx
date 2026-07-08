"use client"

import * as React from "react"
import { ExternalLinkIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"

export interface ConsentItem {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  /** Link to the full consent text; opens in a new tab. */
  href?: string
  /** Required items gate the submit action. Defaults to true. */
  required?: boolean
  /** Version id of the consent text — recorded with the acceptance. */
  version?: string
}

/** A recorded affirmation: which item, and which version of its text. */
export interface ConsentAcceptance {
  id: string
  version?: string
}

export interface ConsentChecklistProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "defaultValue" | "onSubmit"
  > {
  items: ConsentItem[]
  value?: ConsentAcceptance[]
  defaultValue?: ConsentAcceptance[]
  onValueChange?: (accepted: ConsentAcceptance[]) => void
  /** Renders a submit button, gated until every required item is affirmed. */
  onSubmit?: (accepted: ConsentAcceptance[]) => void
  submitLabel?: React.ReactNode
  disabled?: boolean
}

/**
 * A checklist of consent/attestation items. Each is an explicit affirmative
 * action (never pre-checked); the submit action is gated until every required
 * item is affirmed, and each acceptance records the consent-text version.
 */
function ConsentChecklist({
  items,
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  submitLabel = "Agree & continue",
  disabled,
  className,
  ...props
}: ConsentChecklistProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<ConsentAcceptance[]>(
    defaultValue ?? []
  )
  const accepted = isControlled ? value : internal
  const baseId = React.useId()

  function commit(next: ConsentAcceptance[]) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function toggle(item: ConsentItem, checked: boolean) {
    const without = accepted.filter((a) => a.id !== item.id)
    commit(checked ? [...without, { id: item.id, version: item.version }] : without)
  }

  const isChecked = (id: string) => accepted.some((a) => a.id === id)
  const complete = items
    .filter((i) => i.required !== false)
    .every((i) => isChecked(i.id))

  return (
    <div
      data-slot="consent-checklist"
      className={cn("flex w-full max-w-md flex-col gap-3", className)}
      {...props}
    >
      {items.map((item) => {
        const id = `${baseId}-${item.id}`
        const required = item.required !== false
        return (
          <div
            key={item.id}
            data-slot="consent-checklist-item"
            className="flex gap-3 rounded-lg border border-border/60 bg-card px-3.5 py-3"
          >
            <Checkbox
              id={id}
              checked={isChecked(item.id)}
              onCheckedChange={(c) => toggle(item, c === true)}
              disabled={disabled}
              className="mt-0.5"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <label htmlFor={id} className="text-sm font-medium leading-snug">
                {item.label}
                {required ? (
                  <span aria-hidden className="text-destructive">
                    {" "}
                    *
                  </span>
                ) : (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    (optional)
                  </span>
                )}
              </label>
              {item.description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {item.description}
                </p>
              )}
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex w-fit items-center gap-1 text-xs font-medium hover:underline"
                >
                  Read full text
                  <ExternalLinkIcon className="size-3" aria-hidden />
                </a>
              )}
            </div>
          </div>
        )
      })}

      {onSubmit && (
        <Button
          type="button"
          onClick={() => onSubmit(accepted)}
          disabled={disabled || !complete}
          className="w-full"
        >
          {submitLabel}
        </Button>
      )}
    </div>
  )
}

export { ConsentChecklist }
