"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

export type GcsCell = number | "NT" | null

export interface GcsValue {
  eye: GcsCell
  verbal: GcsCell
  motor: GcsCell
}

type Axis = "eye" | "verbal" | "motor"

interface AxisConfig {
  key: Axis
  title: string
  prefix: string
  max: number
  options: { value: number; label: string }[]
}

const AXES: AxisConfig[] = [
  {
    key: "eye",
    title: "Eye opening",
    prefix: "E",
    max: 4,
    options: [
      { value: 4, label: "Spontaneous" },
      { value: 3, label: "To speech" },
      { value: 2, label: "To pressure" },
      { value: 1, label: "None" },
    ],
  },
  {
    key: "verbal",
    title: "Verbal response",
    prefix: "V",
    max: 5,
    options: [
      { value: 5, label: "Oriented" },
      { value: 4, label: "Confused" },
      { value: 3, label: "Inappropriate words" },
      { value: 2, label: "Incomprehensible sounds" },
      { value: 1, label: "None" },
    ],
  },
  {
    key: "motor",
    title: "Best motor response",
    prefix: "M",
    max: 6,
    options: [
      { value: 6, label: "Obeys commands" },
      { value: 5, label: "Localises to pain" },
      { value: 4, label: "Normal flexion (withdraws)" },
      { value: 3, label: "Abnormal flexion" },
      { value: 2, label: "Extension" },
      { value: 1, label: "None" },
    ],
  },
]

function cellText(v: GcsCell): string {
  if (v === null) return "–"
  if (v === "NT") return "NT"
  return String(v)
}

type Severity = "severe" | "moderate" | "mild"

const severityMeta: Record<Severity, { label: string; text: string; chip: string }> = {
  severe: { label: "Severe", text: "text-destructive", chip: "bg-destructive/12 text-destructive" },
  moderate: {
    label: "Moderate",
    text: "text-warning-foreground dark:text-warning",
    chip: "bg-warning/15 text-warning-foreground dark:text-warning",
  },
  mild: { label: "Mild", text: "text-success", chip: "bg-success/12 text-success" },
}

function severityFor(total: number): Severity {
  if (total <= 8) return "severe"
  if (total <= 12) return "moderate"
  return "mild"
}

function AxisGroup({
  config,
  value,
  onSelect,
}: {
  config: AxisConfig
  value: GcsCell
  onSelect: (v: number | "NT") => void
}) {
  const rows: (number | "NT")[] = [...config.options.map((o) => o.value), "NT"]
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = rows.findIndex((r) => r === value)
    let next = -1
    if (e.key === "ArrowDown") next = Math.min(rows.length - 1, (idx < 0 ? -1 : idx) + 1)
    else if (e.key === "ArrowUp") next = Math.max(0, (idx < 0 ? rows.length : idx) - 1)
    if (next >= 0) {
      e.preventDefault()
      const target = rows[next]
      if (target !== undefined) {
        onSelect(target)
        refs.current[next]?.focus()
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold">{config.title}</span>
        <span className="text-muted-foreground text-[10px] font-medium tabular-nums">
          /{config.max}
        </span>
      </div>
      <div
        role="radiogroup"
        aria-label={config.title}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-1"
      >
        {config.options.map((opt, i) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${config.prefix}${opt.value}, ${opt.label}`}
              tabIndex={selected || (value === null && i === 0) ? 0 : -1}
              onClick={() => onSelect(opt.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
                "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 hover:bg-muted/60"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded font-bold tabular-nums",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {opt.value}
              </span>
              <span className="leading-tight">{opt.label}</span>
            </button>
          )
        })}
        <button
          ref={(el) => {
            refs.current[config.options.length] = el
          }}
          type="button"
          role="radio"
          aria-checked={value === "NT"}
          aria-label={`${config.prefix} not testable`}
          tabIndex={value === "NT" ? 0 : -1}
          onClick={() => onSelect("NT")}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-dashed px-2.5 py-1.5 text-left text-xs transition-colors",
            "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
            value === "NT"
              ? "border-muted-foreground/60 bg-muted text-foreground"
              : "border-border/60 text-muted-foreground hover:bg-muted/60"
          )}
        >
          <span className="bg-muted-foreground/15 text-muted-foreground flex h-5 shrink-0 items-center justify-center rounded px-1 text-[10px] font-bold">
            NT
          </span>
          <span className="leading-tight">Not testable</span>
        </button>
      </div>
    </div>
  )
}

export interface GcsScoreInputProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: GcsValue
  defaultValue?: GcsValue
  onValueChange?: (value: GcsValue) => void
}

const EMPTY: GcsValue = { eye: null, verbal: null, motor: null }

/**
 * Glasgow Coma Scale entry: three radiogroups (Eye /4, Verbal /5, Motor /6)
 * with the standard descriptors, a live total and severity band. Always shows
 * the component breakdown ("E3 V4 M5 = 12"), never a bare total — the same
 * total from different components means different things. `NT` (not testable,
 * e.g. intubated) suppresses the naive numeric total.
 */
function GcsScoreInput({
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  className,
  ...props
}: GcsScoreInputProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<GcsValue>(defaultValue)
  const value = isControlled ? valueProp : internal

  const setAxis = (axis: Axis, cell: number | "NT") => {
    const next = { ...value, [axis]: cell }
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const cells = [value.eye, value.verbal, value.motor]
  const anyNT = cells.some((c) => c === "NT")
  const anyEmpty = cells.some((c) => c === null)
  const numericTotal = cells.reduce<number>(
    (sum, c) => sum + (typeof c === "number" ? c : 0),
    0
  )
  const summable = !anyNT && !anyEmpty
  const total = summable ? numericTotal : null
  const severity = total !== null ? severityFor(total) : null

  const breakdown = `E${cellText(value.eye)} V${cellText(value.verbal)} M${cellText(value.motor)}`

  return (
    <div
      data-slot="gcs-score-input"
      className={cn(
        "bg-card w-full max-w-xl rounded-2xl border border-border/60 p-4 shadow-soft",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        {AXES.map((config) => (
          <AxisGroup
            key={config.key}
            config={config}
            value={value[config.key]}
            onSelect={(v) => setAxis(config.key, v)}
          />
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3"
      >
        <span className="font-mono text-sm font-semibold tabular-nums">
          {breakdown}
          {total !== null && (
            <span className="text-muted-foreground"> = </span>
          )}
          {total !== null && <span>{total}</span>}
        </span>
        {total !== null && severity ? (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              severityMeta[severity].chip
            )}
          >
            GCS {total} · {severityMeta[severity].label}
          </span>
        ) : anyNT ? (
          <span className="text-muted-foreground text-xs font-medium">
            Not summable — report components
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">Select all three</span>
        )}
      </div>
    </div>
  )
}

export { GcsScoreInput }
