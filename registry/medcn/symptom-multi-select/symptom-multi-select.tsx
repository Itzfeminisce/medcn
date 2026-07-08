"use client"

import * as React from "react"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import { Input } from "@/registry/medcn/input/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export interface SymptomOption {
  id: string
  label: string
}

export interface SelectedSymptom {
  id: string
  label: string
  severity?: "mild" | "moderate" | "severe"
  /** Free-text onset/duration, e.g. "3 days". */
  duration?: string
  /** True when added via the free-text "other" path. */
  custom?: boolean
}

export interface SymptomMultiSelectProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  options: SymptomOption[]
  value?: SelectedSymptom[]
  defaultValue?: SelectedSymptom[]
  onValueChange?: (value: SelectedSymptom[]) => void
  placeholder?: React.ReactNode
  disabled?: boolean
}

const SEVERITIES = ["mild", "moderate", "severe"] as const

/**
 * Searchable multi-select of symptoms rendered as removable chips, each with an
 * optional severity and onset/duration, plus a free-text "other" escape hatch.
 */
function SymptomMultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Add symptoms",
  disabled,
  className,
  ...props
}: SymptomMultiSelectProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<SelectedSymptom[]>(
    defaultValue ?? []
  )
  const selected = isControlled ? value : internal
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)

  function commit(next: SelectedSymptom[]) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const isSelected = (id: string) => selected.some((s) => s.id === id)

  function toggle(option: SymptomOption) {
    commit(
      isSelected(option.id)
        ? selected.filter((s) => s.id !== option.id)
        : [...selected, { id: option.id, label: option.label }]
    )
  }

  function addCustom() {
    const label = query.trim()
    if (!label) return
    const id = `custom:${label.toLowerCase()}`
    if (!isSelected(id)) {
      commit([...selected, { id, label, custom: true }])
    }
    setQuery("")
  }

  function remove(id: string) {
    commit(selected.filter((s) => s.id !== id))
  }

  function update(id: string, patch: Partial<SelectedSymptom>) {
    commit(selected.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const q = query.trim().toLowerCase()
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q))
  const exact = options.some((o) => o.label.toLowerCase() === q)

  return (
    <div
      data-slot="symptom-multi-select"
      className={cn("flex w-full max-w-md flex-col gap-3", className)}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-start font-normal text-muted-foreground"
          >
            <SearchIcon />
            {placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          <div className="relative mb-2">
            <SearchIcon className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              placeholder="Search symptoms…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !exact && q) {
                  e.preventDefault()
                  addCustom()
                }
              }}
              className="h-9 pl-8"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((option) => (
              <label
                key={option.id}
                className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm"
              >
                <Checkbox
                  checked={isSelected(option.id)}
                  onCheckedChange={() => toggle(option)}
                />
                {option.label}
              </label>
            ))}
            {q && !exact && (
              <button
                type="button"
                onClick={addCustom}
                className="text-primary hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium"
              >
                <PlusIcon className="size-4" />
                Add “{query.trim()}” as other
              </button>
            )}
            {filtered.length === 0 && !q && (
              <p className="text-muted-foreground px-2 py-1.5 text-sm">
                Type to search.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected chips with per-symptom severity/duration. */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((s) => (
            <Popover key={s.id}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                  s.custom
                    ? "border-info/25 bg-info/10 text-info"
                    : "border-border/60 bg-muted/60"
                )}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    disabled={disabled}
                    className="inline-flex items-center gap-1.5 outline-none focus-visible:underline"
                  >
                    {s.label}
                    {s.severity && (
                      <span className="text-muted-foreground font-normal">
                        · {s.severity}
                      </span>
                    )}
                    {s.duration && (
                      <span className="text-muted-foreground font-normal">
                        · {s.duration}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  disabled={disabled}
                  aria-label={`Remove ${s.label}`}
                  className="text-muted-foreground hover:text-foreground rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
                >
                  <XIcon className="size-3.5" />
                </button>
              </span>
              <PopoverContent className="w-60" align="start">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Severity</span>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      size="sm"
                      value={s.severity ?? ""}
                      onValueChange={(v) =>
                        update(s.id, {
                          severity: (v || undefined) as SelectedSymptom["severity"],
                        })
                      }
                      className="w-full"
                    >
                      {SEVERITIES.map((sev) => (
                        <ToggleGroupItem key={sev} value={sev} className="capitalize">
                          {sev}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium">Onset / duration</label>
                    <Input
                      placeholder="e.g. 3 days"
                      value={s.duration ?? ""}
                      onChange={(e) =>
                        update(s.id, { duration: e.target.value || undefined })
                      }
                      className="h-9"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      )}
    </div>
  )
}

export { SymptomMultiSelect }
