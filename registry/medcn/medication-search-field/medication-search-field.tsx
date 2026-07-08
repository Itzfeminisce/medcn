"use client"

import * as React from "react"
import { Loader2Icon, PillIcon, SearchIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Input } from "@/registry/medcn/input/input"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/registry/medcn/popover/popover"

export interface MedicationOption {
  id: string
  name: string
  /** e.g. "500 mg". */
  strength?: string
  /** e.g. "tablet", "oral suspension". */
  form?: string
  /** Brand name, if the option is a brand; absent for generics. */
  brand?: string
}

export interface MedicationSearchFieldProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "onSelect" | "defaultValue"
  > {
  /** Async candidate lookup — pair with the /drug-catalog API. */
  onSearch: (query: string) => Promise<MedicationOption[]>
  /** Selected drug (controlled). */
  value?: MedicationOption | null
  onSelect?: (drug: MedicationOption) => void
  placeholder?: string
  /** Minimum characters before searching. */
  minChars?: number
  /** Debounce in ms. */
  debounceMs?: number
  disabled?: boolean
}

function labelFor(m: MedicationOption): string {
  return [m.name, m.strength, m.form && `(${m.form})`].filter(Boolean).join(" ")
}

/**
 * Typeahead drug picker: async candidate lookup, a keyboard-navigable listbox
 * in a popover, and a structured drug object on selection (not free text).
 */
function MedicationSearchField({
  onSearch,
  value,
  onSelect,
  placeholder = "Search medications…",
  minChars = 1,
  debounceMs = 250,
  disabled,
  className,
  ...props
}: MedicationSearchFieldProps) {
  const [query, setQuery] = React.useState(value ? labelFor(value) : "")
  const [results, setResults] = React.useState<MedicationOption[]>([])
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const listId = React.useId()
  const reqId = React.useRef(0)

  // Debounced async search; last-write-wins via a request id.
  React.useEffect(() => {
    const q = query.trim()
    if (q.length < minChars) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const id = ++reqId.current
    const t = setTimeout(async () => {
      try {
        const found = await onSearch(q)
        if (id === reqId.current) {
          setResults(found)
          setActive(0)
          setOpen(true)
        }
      } finally {
        if (id === reqId.current) setLoading(false)
      }
    }, debounceMs)
    return () => clearTimeout(t)
  }, [query, minChars, debounceMs, onSearch])

  function choose(m: MedicationOption) {
    onSelect?.(m)
    setQuery(labelFor(m))
    setOpen(false)
    setResults([])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === "ArrowDown" && results.length) setOpen(true)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const m = results[active]
      if (m) choose(m)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div
      data-slot="medication-search-field"
      className={cn("w-full max-w-sm", className)}
      {...props}
    >
      <Popover open={open && results.length > 0} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              role="combobox"
              aria-expanded={open && results.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                open && results[active] ? `${listId}-${active}` : undefined
              }
              autoComplete="off"
              placeholder={placeholder}
              disabled={disabled}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => results.length > 0 && setOpen(true)}
              className="pl-9 pr-9"
            />
            {loading && (
              <Loader2Icon className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin" />
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[var(--radix-popover-trigger-width)] p-1"
        >
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto">
            {results.map((m, i) => (
              <li
                key={m.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(m)
                }}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-md px-2.5 py-2 text-sm",
                  i === active && "bg-accent text-accent-foreground"
                )}
              >
                <PillIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">
                    {m.name}
                    {m.strength && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        {m.strength}
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {[m.form, m.brand ? `Brand: ${m.brand}` : "Generic"]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { MedicationSearchField, labelFor as medicationLabel }
