"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type DoseStatus = "taken" | "due" | "missed" | "skipped"

export interface StripDose {
  /** "HH:MM" (24h), "h:mm AM/PM", or a Date — rendered in local time. */
  time: string | Date
  status: DoseStatus
  label?: React.ReactNode
}

const statusMeta: Record<DoseStatus, { label: string; dot: string }> = {
  taken: { label: "Taken", dot: "bg-primary border-primary" },
  due: { label: "Due", dot: "bg-card border-primary" },
  missed: { label: "Missed", dot: "bg-card border-destructive" },
  skipped: { label: "Skipped", dot: "bg-card border-muted-foreground/50 border-dashed" },
}

const HOURS = [0, 6, 12, 18, 24]

/** Minutes past local midnight for a dose time. Returns null if unparseable. */
function minutesOfDay(time: string | Date): number | null {
  if (time instanceof Date) {
    if (Number.isNaN(time.getTime())) return null
    return time.getHours() * 60 + time.getMinutes()
  }
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  const ap = m[3]?.toLowerCase()
  if (ap === "pm" && h < 12) h += 12
  if (ap === "am" && h === 12) h = 0
  if (h > 24 || min > 59) return null
  return h * 60 + min
}

function labelFor(time: string | Date): string {
  if (time instanceof Date) {
    return time.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  }
  return time
}

export interface MedicationTimingStripProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  doses: StripDose[]
  /** Medication label, e.g. "Metformin 500 mg". */
  medication?: React.ReactNode
  /** Hide the "now" cursor. */
  hideNow?: boolean
}

/**
 * Single-day 24-hour strip for one medication: dose markers (taken filled, due
 * ring, missed hollow destructive, skipped dashed) with a live "now" cursor.
 * Times render in the patient's local timezone. Missed doses are shown for
 * information only — catch-up advice is drug-specific and belongs to the caller.
 */
function MedicationTimingStrip({
  doses,
  medication,
  hideNow = false,
  className,
  ...props
}: MedicationTimingStripProps) {
  // Null until mounted so SSR and first client render match (no clock server-side).
  const [nowMin, setNowMin] = React.useState<number | null>(null)

  React.useEffect(() => {
    const update = () => {
      const d = new Date()
      setNowMin(d.getHours() * 60 + d.getMinutes())
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  const parsed = doses
    .map((d) => ({ ...d, min: minutesOfDay(d.time) }))
    .filter((d): d is StripDose & { min: number } => d.min !== null)

  const summary =
    (typeof medication === "string" ? `${medication}. ` : "") +
    "Doses today: " +
    parsed
      .map((d) => `${labelFor(d.time)} ${statusMeta[d.status].label.toLowerCase()}`)
      .join(", ")

  return (
    <div
      data-slot="medication-timing-strip"
      role="group"
      aria-label={summary}
      className={cn(
        "bg-card w-full max-w-md rounded-xl border border-border/60 px-4 py-3 shadow-soft",
        className
      )}
      {...props}
    >
      {medication && (
        <div className="mb-3 text-sm font-semibold">{medication}</div>
      )}

      <div className="relative h-9" aria-hidden>
        {/* Baseline */}
        <div className="bg-border absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
        {/* Hour gridlines */}
        {HOURS.map((h) => (
          <div
            key={h}
            className="bg-border/60 absolute top-1/2 h-2 w-px -translate-y-1/2"
            style={{ left: `${(h / 24) * 100}%` }}
          />
        ))}
        {/* Now cursor */}
        {!hideNow && nowMin !== null && (
          <div
            data-slot="medication-timing-strip-now"
            className="bg-foreground/70 absolute inset-y-0 w-px"
            style={{ left: `${(nowMin / 1440) * 100}%` }}
          >
            <span className="bg-foreground absolute -top-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full" />
          </div>
        )}
        {/* Dose markers */}
        {parsed.map((dose, i) => {
          const meta = statusMeta[dose.status]
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="focus-visible:ring-ring absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2"
                  style={{ left: `${(dose.min / 1440) * 100}%` }}
                >
                  <span className={cn("block size-full rounded-full border-2", meta.dot)} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold tabular-nums">{labelFor(dose.time)}</p>
                <p className="text-background/70 text-[11px]">
                  {meta.label}
                  {dose.label ? ` · ${dose.label}` : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Hour axis */}
      <div className="text-muted-foreground/70 relative mt-1 h-4 text-[10px] tabular-nums">
        {HOURS.map((h) => (
          <span
            key={h}
            className={cn(
              "absolute -translate-x-1/2",
              h === 0 && "translate-x-0",
              h === 24 && "-translate-x-full"
            )}
            style={{ left: `${(h / 24) * 100}%` }}
          >
            {h.toString().padStart(2, "0")}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {(Object.keys(statusMeta) as DoseStatus[]).map((s) => (
          <span key={s} className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            <span className={cn("size-2.5 rounded-full border-2", statusMeta[s].dot)} />
            {statusMeta[s].label}
          </span>
        ))}
      </div>
    </div>
  )
}

export { MedicationTimingStrip }
