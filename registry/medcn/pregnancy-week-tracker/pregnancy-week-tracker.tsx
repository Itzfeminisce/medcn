import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { Progress } from "@/registry/medcn/progress/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

const DAY = 86_400_000
const FULL_TERM_DAYS = 280 // 40w — EDD
const DOMAIN_DAYS = 294 // 42w — end of the term window / track
const TERM_START_DAYS = 259 // 37w

export type DatingMethod = "ga" | "edd" | "lmp"

export interface PregnancyMilestone {
  /** Gestational week, e.g. 20 (anomaly scan). */
  week: number
  label: string
}

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d
}

function formatDate(d: Date): string {
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

interface Resolved {
  gaDays: number
  edd: Date
  method: DatingMethod
}

/**
 * Precedence: explicit `gestationalAgeDays` → `eddDate` (often scan-adjusted,
 * clinically preferred) → `lmpDate`. `asOf` is the reference "today".
 */
function resolve(
  gestationalAgeDays: number | undefined,
  eddDate: Date | string | undefined,
  lmpDate: Date | string | undefined,
  asOf: Date
): Resolved | null {
  if (gestationalAgeDays !== undefined) {
    const edd = eddDate
      ? toDate(eddDate)
      : lmpDate
        ? new Date(toDate(lmpDate).getTime() + FULL_TERM_DAYS * DAY)
        : new Date(asOf.getTime() + (FULL_TERM_DAYS - gestationalAgeDays) * DAY)
    return { gaDays: gestationalAgeDays, edd, method: "ga" }
  }
  if (eddDate) {
    const edd = toDate(eddDate)
    const gaDays = FULL_TERM_DAYS - Math.round((edd.getTime() - asOf.getTime()) / DAY)
    return { gaDays, edd, method: "edd" }
  }
  if (lmpDate) {
    const lmp = toDate(lmpDate)
    const gaDays = Math.round((asOf.getTime() - lmp.getTime()) / DAY)
    const edd = new Date(lmp.getTime() + FULL_TERM_DAYS * DAY)
    return { gaDays, edd, method: "lmp" }
  }
  return null
}

const methodLabel: Record<DatingMethod, string> = {
  ga: "By reported gestational age",
  edd: "Dated by EDD",
  lmp: "Dated by LMP",
}

function trimesterLabel(gaDays: number): string {
  if (gaDays > DOMAIN_DAYS) return "Post-term"
  if (gaDays >= TERM_START_DAYS) return "Term"
  if (gaDays >= 196) return "Third trimester"
  if (gaDays >= 98) return "Second trimester"
  return "First trimester"
}

export interface PregnancyWeekTrackerProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Direct gestational age in days; highest precedence. */
  gestationalAgeDays?: number
  /** Estimated due date; preferred over LMP (often scan-adjusted). */
  eddDate?: Date | string
  /** Last menstrual period. */
  lmpDate?: Date | string
  /** Reference "today"; defaults to now. Set it for deterministic rendering. */
  asOf?: Date | string
  milestones?: PregnancyMilestone[]
}

/**
 * Gestational-age progress: the current age prominent, a track with trimester
 * boundaries and the 37–42w term window as a band, and the EDD at the end.
 * The dating method the shown EDD is based on is always displayed (LMP vs
 * scan-adjusted matters), and the term window is a band, not a single date.
 */
function PregnancyWeekTracker({
  gestationalAgeDays,
  eddDate,
  lmpDate,
  asOf,
  milestones = [],
  className,
  ...props
}: PregnancyWeekTrackerProps) {
  const asOfDate = asOf ? toDate(asOf) : new Date()
  const resolved = resolve(gestationalAgeDays, eddDate, lmpDate, asOfDate)

  if (!resolved) {
    return (
      <div
        data-slot="pregnancy-week-tracker"
        className={cn(
          "bg-card text-muted-foreground w-full max-w-md rounded-xl border border-border/60 px-4 py-3 text-sm shadow-soft",
          className
        )}
        {...props}
      >
        Provide gestationalAgeDays, eddDate, or lmpDate.
      </div>
    )
  }

  const { gaDays, edd, method } = resolved
  const clamped = Math.max(0, Math.min(gaDays, DOMAIN_DAYS))
  const weeks = Math.floor(gaDays / 7)
  const days = ((gaDays % 7) + 7) % 7
  const pct = (clamped / DOMAIN_DAYS) * 100
  const pctOf = (d: number) => (d / DOMAIN_DAYS) * 100

  const postTerm = gaDays > DOMAIN_DAYS
  const inTerm = gaDays >= TERM_START_DAYS && !postTerm
  const tone = postTerm ? "warning" : inTerm ? "success" : "default"

  const dividers = [
    { day: 98, label: "14w · 2nd trimester" },
    { day: 196, label: "28w · 3rd trimester" },
  ]

  const accessibleName = `Gestational age ${weeks} weeks ${days} days, ${trimesterLabel(
    gaDays
  ).toLowerCase()}. Estimated due date ${formatDate(edd)}, ${methodLabel[
    method
  ].toLowerCase()}.`

  return (
    <div
      data-slot="pregnancy-week-tracker"
      role="group"
      aria-label={accessibleName}
      className={cn(
        "bg-card w-full max-w-md rounded-xl border border-border/60 px-4 py-3.5 shadow-soft",
        className
      )}
      {...props}
    >
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-bold tabular-nums tracking-tight">
            {weeks}
            <span className="text-muted-foreground text-base font-semibold">w</span>{" "}
            {days}
            <span className="text-muted-foreground text-base font-semibold">d</span>
          </span>
          <span className="text-muted-foreground mt-1 text-xs font-medium">
            {trimesterLabel(gaDays)}
          </span>
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="text-xs font-semibold tabular-nums">
            EDD {formatDate(edd)}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {methodLabel[method]}
          </span>
        </div>
      </div>

      <div className="relative py-1">
        <Progress
          value={pct}
          variant={tone}
          className="h-3"
          aria-hidden
        />

        {/* Term window (37–42w) as a band, not a single date */}
        <div
          aria-hidden
          className="border-success/60 bg-success/15 pointer-events-none absolute top-1 h-3 rounded-sm border-x"
          style={{
            left: `${pctOf(TERM_START_DAYS)}%`,
            width: `${pctOf(DOMAIN_DAYS) - pctOf(TERM_START_DAYS)}%`,
          }}
        />

        {/* Trimester dividers */}
        {dividers.map((d) => (
          <Tooltip key={d.day}>
            <TooltipTrigger asChild>
              <span
                className="bg-border absolute top-0.5 h-4 w-px -translate-x-1/2 cursor-default"
                style={{ left: `${pctOf(d.day)}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>{d.label}</TooltipContent>
          </Tooltip>
        ))}

        {/* EDD marker at 40w */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="border-foreground/60 absolute top-0.5 h-4 w-0.5 -translate-x-1/2 cursor-default border-l border-dashed"
              style={{ left: `${pctOf(FULL_TERM_DAYS)}%` }}
            />
          </TooltipTrigger>
          <TooltipContent>EDD · 40w · {formatDate(edd)}</TooltipContent>
        </Tooltip>

        {/* Milestones */}
        {milestones.map((m, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span
                className="bg-primary ring-card absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 cursor-default"
                style={{ left: `${pctOf(Math.min(m.week * 7, DOMAIN_DAYS))}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>
              {m.week}w · {m.label}
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Current-position marker */}
        <span
          aria-hidden
          className={cn(
            "ring-card absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2",
            tone === "warning"
              ? "bg-warning"
              : tone === "success"
                ? "bg-success"
                : "bg-primary"
          )}
          style={{ left: `${pct}%` }}
        />
      </div>

      <div className="text-muted-foreground/70 mt-1.5 flex justify-between text-[10px] tabular-nums">
        <span>0w</span>
        <span>14w</span>
        <span>28w</span>
        <span>40w</span>
      </div>
    </div>
  )
}

export { PregnancyWeekTracker }
