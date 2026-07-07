import * as React from "react"
import {
  CalendarClockIcon,
  CheckIcon,
  SyringeIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

type VaccineStatus = "complete" | "due" | "overdue" | "upcoming"

const statusConfig: Record<
  VaccineStatus,
  { label: string; rail: string; disc: string; chip: string }
> = {
  complete: {
    label: "Complete",
    rail: "bg-success",
    disc: "bg-success/12 text-success",
    chip: "bg-success/12 text-success",
  },
  due: {
    label: "Due",
    rail: "bg-warning",
    disc: "bg-warning/15 text-warning-foreground dark:text-warning",
    chip: "bg-warning/15 text-warning-foreground dark:text-warning",
  },
  overdue: {
    label: "Overdue",
    rail: "bg-destructive",
    disc: "bg-destructive/12 text-destructive",
    chip: "bg-destructive/12 text-destructive",
  },
  upcoming: {
    label: "Upcoming",
    rail: "bg-muted-foreground/40",
    disc: "bg-muted text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
  },
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export interface VaccinationRecordRowProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Vaccine name, e.g. "Tdap". */
  vaccine: React.ReactNode
  /** Free-text dose label, e.g. "Booster". Ignored when doseNumber/doseTotal given. */
  doseLabel?: React.ReactNode
  /** Structured dose position for the pip meter, e.g. 2 of 3. */
  doseNumber?: number
  doseTotal?: number
  dateGiven?: Date | string
  lotNumber?: React.ReactNode
  provider?: React.ReactNode
  status?: VaccineStatus
  nextDueDate?: Date | string
}

/** Series-progress pips: filled up to the dose given, hollow for remaining. */
function DosePips({ number, total }: { number: number; total: number }) {
  const clampedTotal = Math.max(1, Math.min(total, 8))
  return (
    <span
      data-slot="vaccination-record-row-pips"
      className="flex items-center gap-0.5"
      aria-hidden
    >
      {Array.from({ length: clampedTotal }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            i < number ? "bg-success" : "bg-muted-foreground/25"
          )}
        />
      ))}
    </span>
  )
}

/** Immunization record row with a status rail, dose-series pips, and next-due chip. */
function VaccinationRecordRow({
  vaccine,
  doseLabel,
  doseNumber,
  doseTotal,
  dateGiven,
  lotNumber,
  provider,
  status,
  nextDueDate,
  className,
  ...props
}: VaccinationRecordRowProps) {
  const cfg = status ? statusConfig[status] : undefined
  const isSelfReported = status === "complete" && !dateGiven
  const hasPips =
    typeof doseNumber === "number" && typeof doseTotal === "number"
  const doseAccessible = hasPips
    ? `dose ${doseNumber} of ${doseTotal}`
    : typeof doseLabel === "string"
      ? doseLabel
      : undefined

  return (
    <div
      data-slot="vaccination-record-row"
      data-status={status}
      className={cn(
        "group bg-card relative flex items-start gap-3 overflow-hidden rounded-xl border border-border/50 py-3 pl-4 pr-3 transition-shadow hover:shadow-soft",
        className
      )}
      {...props}
    >
      {cfg && (
        <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", cfg.rail)} />
      )}

      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
          cfg ? cfg.disc : "bg-muted text-muted-foreground"
        )}
        aria-hidden
      >
        {status === "complete" ? <CheckIcon /> : <SyringeIcon />}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">{vaccine}</span>
          {hasPips ? (
            <span className="flex items-center gap-1.5">
              <DosePips number={doseNumber!} total={doseTotal!} />
              <span className="text-muted-foreground text-[11px] tabular-nums">
                {doseNumber} of {doseTotal}
              </span>
              <span className="sr-only">{doseAccessible}</span>
            </span>
          ) : (
            doseLabel && (
              <span className="text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 text-[11px] font-medium">
                {doseLabel}
              </span>
            )
          )}
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
          {dateGiven && <span className="tabular-nums">{formatDate(dateGiven)}</span>}
          {lotNumber && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default font-mono text-[11px] underline decoration-dotted underline-offset-2">
                  #{lotNumber}
                </span>
              </TooltipTrigger>
              <TooltipContent>Lot number</TooltipContent>
            </Tooltip>
          )}
          {provider && <span>{provider}</span>}
          {isSelfReported && (
            <span className="text-muted-foreground/60 italic">Self-reported</span>
          )}
        </div>

        {nextDueDate && status !== "complete" && (
          <span
            className={cn(
              "mt-0.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium [&_svg]:size-3",
              cfg?.chip ?? "bg-muted text-muted-foreground"
            )}
          >
            <CalendarClockIcon aria-hidden />
            Next due {formatDate(nextDueDate)}
          </span>
        )}
      </div>

      {cfg && (
        <span
          className={cn(
            "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            cfg.chip
          )}
        >
          {cfg.label}
        </span>
      )}
    </div>
  )
}

export { VaccinationRecordRow }
