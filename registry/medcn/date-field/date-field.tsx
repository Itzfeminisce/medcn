"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

type Segment = "day" | "month" | "year"

const SEGMENT_ORDER: Record<string, Segment[]> = {
  dmy: ["day", "month", "year"],
  mdy: ["month", "day", "year"],
  ymd: ["year", "month", "day"],
}

const SEGMENT_META: Record<
  Segment,
  { placeholder: string; label: string; maxLength: number; max: number }
> = {
  day: { placeholder: "DD", label: "Day", maxLength: 2, max: 31 },
  month: { placeholder: "MM", label: "Month", maxLength: 2, max: 12 },
  year: { placeholder: "YYYY", label: "Year", maxLength: 4, max: 9999 },
}

interface Parts {
  day: string
  month: string
  year: string
}

const EMPTY: Parts = { day: "", month: "", year: "" }

/** Parse an ISO `YYYY-MM-DD` string into segment parts. Invalid → empty. */
function partsFromIso(iso: string | undefined): Parts {
  if (!iso) return EMPTY
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return EMPTY
  return { year: m[1]!, month: m[2]!, day: m[3]! }
}

/** A real calendar date? Rejects 31 Feb, month 13, etc. */
function isRealDate(y: number, mo: number, d: number): boolean {
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false
  const date = new Date(y, mo - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === mo - 1 &&
    date.getDate() === d
  )
}

/** Assemble an ISO string from parts, or undefined if incomplete/invalid. */
function isoFromParts(parts: Parts): string | undefined {
  if (
    parts.year.length !== 4 ||
    parts.month.length === 0 ||
    parts.day.length === 0
  ) {
    return undefined
  }
  const y = Number(parts.year)
  const mo = Number(parts.month)
  const d = Number(parts.day)
  if (!isRealDate(y, mo, d)) return undefined
  return `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

export interface DateFieldProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "defaultValue" | "value"
  > {
  /** Controlled value as an ISO `YYYY-MM-DD` string. */
  value?: string
  /** Uncontrolled initial value as an ISO `YYYY-MM-DD` string. */
  defaultValue?: string
  /**
   * Called on every edit with the ISO string, or `undefined` while the
   * entry is incomplete or not a real date.
   */
  onValueChange?: (iso: string | undefined) => void
  /** Segment order. */
  order?: "dmy" | "mdy" | "ymd"
  /** Marks all segments aria-invalid and applies the error ring. */
  "aria-invalid"?: boolean
  disabled?: boolean
}

/** Typed day/month/year date entry — no calendar, validates real dates. */
function DateField({
  className,
  value,
  defaultValue,
  onValueChange,
  order = "dmy",
  disabled,
  "aria-invalid": ariaInvalid,
  ...props
}: DateFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<Parts>(() =>
    partsFromIso(defaultValue)
  )
  const parts = isControlled ? partsFromIso(value) : internal
  const refs = React.useRef<Record<Segment, HTMLInputElement | null>>({
    day: null,
    month: null,
    year: null,
  })
  const segments = SEGMENT_ORDER[order] ?? SEGMENT_ORDER.dmy!

  function commit(next: Parts) {
    if (!isControlled) setInternal(next)
    onValueChange?.(isoFromParts(next))
  }

  function handleChange(segment: Segment, raw: string) {
    const meta = SEGMENT_META[segment]
    const digits = raw.replace(/\D/g, "").slice(0, meta.maxLength)
    commit({ ...parts, [segment]: digits })

    // Auto-advance when the segment can hold no more meaningful digits.
    const full = digits.length === meta.maxLength
    const overflow = Number(digits) * 10 > meta.max // e.g. "4" for month → advance
    if ((full || overflow) && digits.length > 0) {
      const idx = segments.indexOf(segment)
      const nextSeg = segments[idx + 1]
      if (nextSeg) refs.current[nextSeg]?.focus()
    }
  }

  function handleKeyDown(
    segment: Segment,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && parts[segment].length === 0) {
      const idx = segments.indexOf(segment)
      const prevSeg = segments[idx - 1]
      if (prevSeg) {
        e.preventDefault()
        refs.current[prevSeg]?.focus()
      }
    }
  }

  return (
    <div
      data-slot="date-field"
      role="group"
      aria-invalid={ariaInvalid}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "border-input dark:bg-input/30 flex h-10 w-fit items-center rounded-lg border bg-card px-2 text-base shadow-xs transition-[color,box-shadow,border-color] duration-200 md:text-sm",
        "focus-within:border-ring focus-within:ring-ring/40 hover:border-ring/50 focus-within:ring-[3px]",
        "has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
        ariaInvalid &&
          "border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]",
        className
      )}
      {...props}
    >
      {segments.map((segment, i) => {
        const meta = SEGMENT_META[segment]
        return (
          <React.Fragment key={segment}>
            {i > 0 && (
              <span
                aria-hidden
                className="text-muted-foreground px-0.5 select-none"
              >
                /
              </span>
            )}
            <input
              ref={(el) => {
                refs.current[segment] = el
              }}
              data-slot={`date-field-${segment}`}
              inputMode="numeric"
              autoComplete="off"
              aria-label={meta.label}
              aria-invalid={ariaInvalid}
              placeholder={meta.placeholder}
              disabled={disabled}
              value={parts[segment]}
              onChange={(e) => handleChange(segment, e.target.value)}
              onKeyDown={(e) => handleKeyDown(segment, e)}
              onFocus={(e) => e.target.select()}
              className={cn(
                "placeholder:text-muted-foreground bg-transparent text-center tabular-nums outline-none disabled:cursor-not-allowed",
                segment === "year" ? "w-[4.5ch]" : "w-[2.5ch]"
              )}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { DateField }
