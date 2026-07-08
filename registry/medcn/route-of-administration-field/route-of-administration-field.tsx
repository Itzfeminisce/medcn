"use client"

import * as React from "react"
import {
  DropletIcon,
  PillIcon,
  SprayCanIcon,
  SyringeIcon,
  WindIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export interface RouteOption {
  /** Stable code stored as the value, e.g. "IM". */
  value: string
  /** Short abbreviation shown on the control. */
  abbr: string
  /** Full route name — always shown in full on selection. */
  label: string
  icon?: LucideIcon
}

/** Common formulary routes. Callers override `routes` to match their formulary. */
export const DEFAULT_ROUTES: RouteOption[] = [
  { value: "PO", abbr: "PO", label: "Oral", icon: PillIcon },
  { value: "IV", abbr: "IV", label: "Intravenous", icon: SyringeIcon },
  { value: "IM", abbr: "IM", label: "Intramuscular", icon: SyringeIcon },
  { value: "SC", abbr: "SC", label: "Subcutaneous", icon: SyringeIcon },
  { value: "PR", abbr: "PR", label: "Rectal", icon: DropletIcon },
  { value: "INH", abbr: "INH", label: "Inhaled", icon: WindIcon },
  { value: "TOP", abbr: "TOP", label: "Topical", icon: SprayCanIcon },
  { value: "SL", abbr: "SL", label: "Sublingual", icon: PillIcon },
]

export interface RouteOfAdministrationFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  routes?: RouteOption[]
  /** How many routes to show inline before collapsing the rest into "More". */
  maxVisible?: number
  disabled?: boolean
}

/**
 * Compact single-select for route of administration. Routes overflow into a
 * "More" popover; the full route name is always shown on selection because
 * wrong-route errors (IM ≠ IV ≠ IT) are catastrophic.
 */
function RouteOfAdministrationField({
  value,
  defaultValue,
  onValueChange,
  routes = DEFAULT_ROUTES,
  maxVisible = 6,
  disabled,
  className,
  ...props
}: RouteOfAdministrationFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue
  )
  const current = isControlled ? value : internal
  const [open, setOpen] = React.useState(false)

  function commit(next: string | undefined) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  // Keep the selected route inline even when it lives past the visible cutoff.
  let visible = routes.slice(0, maxVisible)
  let overflow = routes.slice(maxVisible)
  const selectedInOverflow =
    current != null && overflow.some((r) => r.value === current)
  if (selectedInOverflow) {
    const sel = overflow.find((r) => r.value === current)!
    const displaced = visible[visible.length - 1]
    visible = [...visible.slice(0, -1), sel]
    overflow = overflow.filter((r) => r.value !== current)
    if (displaced) overflow = [displaced, ...overflow]
  }

  const selected = routes.find((r) => r.value === current)

  return (
    <div
      data-slot="route-of-administration-field"
      className={cn("flex w-full max-w-sm flex-col gap-2", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <ToggleGroup
          type="single"
          variant="outline"
          value={current ?? ""}
          onValueChange={(v) => commit(v || undefined)}
          disabled={disabled}
          className="flex-wrap"
        >
          {visible.map((r) => {
            const Icon = r.icon
            return (
              <ToggleGroupItem
                key={r.value}
                value={r.value}
                aria-label={r.label}
                className="flex-none px-3"
              >
                {Icon && <Icon aria-hidden />}
                {r.abbr}
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>

        {overflow.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                className="h-9"
              >
                More
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1.5">
              <div className="flex flex-col">
                {overflow.map((r) => {
                  const Icon = r.icon
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => {
                        commit(r.value)
                        setOpen(false)
                      }}
                      className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm outline-none focus-visible:bg-accent"
                    >
                      {Icon && (
                        <Icon className="text-muted-foreground size-4" aria-hidden />
                      )}
                      <span className="font-medium">{r.abbr}</span>
                      <span className="text-muted-foreground text-xs">
                        {r.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {selected && (
        <p
          data-slot="route-of-administration-field-selected"
          className="text-muted-foreground text-xs"
        >
          <span className="text-foreground font-semibold">{selected.abbr}</span>
          {" — "}
          {selected.label}
        </p>
      )}
    </div>
  )
}

export { RouteOfAdministrationField }
