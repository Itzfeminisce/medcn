import * as React from "react"
import { AlertTriangleIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Card } from "@/registry/medcn/card/card"

export type LabFlag = "below" | "normal" | "above" | "critical"

const flagMeta: Record<
  LabFlag,
  {
    label: string
    /** Visually-hidden announcement, e.g. "above reference range". */
    announce: string
    badgeVariant: React.ComponentProps<typeof Badge>["variant"]
    marker: string
  }
> = {
  below: {
    label: "Low",
    announce: "below reference range",
    badgeVariant: "info",
    marker: "bg-info",
  },
  normal: {
    label: "Normal",
    announce: "within reference range",
    badgeVariant: "success",
    marker: "bg-success",
  },
  above: {
    label: "High",
    announce: "above reference range",
    badgeVariant: "warning",
    marker: "bg-warning",
  },
  critical: {
    label: "Critical",
    announce: "critical, outside reference range",
    badgeVariant: "destructive",
    marker: "bg-destructive",
  },
}

export interface LabResultRowProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Analyte name, e.g. "HbA1c". */
  label: React.ReactNode
  value: number
  /** e.g. "%", "mmol/L". */
  unit?: React.ReactNode
  referenceMin?: number
  referenceMax?: number
  /**
   * Derived from the reference range when omitted (below | normal | above).
   * `critical` is never derived — pass it explicitly.
   */
  flag?: LabFlag
  /** Renders a horizontal range bar with a marker at `value`. */
  showRangeBar?: boolean
  note?: React.ReactNode
}

function deriveFlag(
  value: number,
  referenceMin?: number,
  referenceMax?: number
): LabFlag {
  if (referenceMin !== undefined && value < referenceMin) return "below"
  if (referenceMax !== undefined && value > referenceMax) return "above"
  return "normal"
}

/**
 * Decorative reference-range bar: muted tails, tinted normal zone, and a
 * marker at the value (clamped 20% beyond the range at the edges).
 */
function RangeBar({
  value,
  referenceMin,
  referenceMax,
  flag,
}: {
  value: number
  referenceMin: number
  referenceMax: number
  flag: LabFlag
}) {
  const span = referenceMax - referenceMin || 1
  const displayMin = referenceMin - span * 0.2
  const displayMax = referenceMax + span * 0.2
  const pct = (v: number) =>
    Math.min(100, Math.max(0, ((v - displayMin) / (displayMax - displayMin)) * 100))

  return (
    <div
      data-slot="lab-result-row-range-bar"
      aria-hidden
      className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full"
    >
      <div
        className="bg-success/25 absolute inset-y-0"
        style={{
          left: `${pct(referenceMin)}%`,
          width: `${pct(referenceMax) - pct(referenceMin)}%`,
        }}
      />
      <div
        data-slot="lab-result-row-range-marker"
        className={cn(
          "absolute top-1/2 h-3 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
          flagMeta[flag].marker
        )}
        style={{ left: `${pct(value)}%` }}
      />
    </div>
  )
}

/** Single lab value with unit, reference range, flag badge, and optional range bar. */
function LabResultRow({
  label,
  value,
  unit,
  referenceMin,
  referenceMax,
  flag,
  showRangeBar = false,
  note,
  className,
  ...props
}: LabResultRowProps) {
  const resolvedFlag = flag ?? deriveFlag(value, referenceMin, referenceMax)
  const meta = flagMeta[resolvedFlag]
  const hasRange = referenceMin !== undefined && referenceMax !== undefined

  return (
    <div
      data-slot="lab-result-row"
      data-flag={resolvedFlag}
      className={cn("flex flex-col gap-1.5 py-2.5", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
          {resolvedFlag === "critical" && (
            <AlertTriangleIcon
              aria-hidden
              className="text-destructive size-3.5 shrink-0"
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-2">
          <span
            data-slot="lab-result-row-value"
            className={cn(
              "text-sm font-bold tabular-nums tracking-tight",
              resolvedFlag === "critical" && "text-destructive"
            )}
          >
            {value}
            {unit && (
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                {unit}
              </span>
            )}
          </span>
          <Badge variant={meta.badgeVariant}>
            {meta.label}
            <span className="sr-only"> — {meta.announce}</span>
          </Badge>
        </span>
      </div>

      {showRangeBar && hasRange && (
        <RangeBar
          value={value}
          referenceMin={referenceMin!}
          referenceMax={referenceMax!}
          flag={resolvedFlag}
        />
      )}

      {hasRange && (
        <span className="text-muted-foreground text-[11px] tabular-nums">
          Reference: {referenceMin}–{referenceMax}
          {unit && <> {unit}</>}
        </span>
      )}

      {note && (
        <span
          data-slot="lab-result-row-note"
          className="text-muted-foreground text-xs"
        >
          {note}
        </span>
      )}
    </div>
  )
}

export interface LabPanelProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** Panel name, e.g. "Lipid panel". */
  title: React.ReactNode
  /** When the sample was collected, e.g. "12 Jun 2026" or a Date. */
  collectedDate?: Date | string
  /** LabResultRow children. */
  children: React.ReactNode
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Groups LabResultRow entries under a panel title with a collected date. */
function LabPanel({
  title,
  collectedDate,
  children,
  className,
  ...props
}: LabPanelProps) {
  const headingId = React.useId()

  return (
    <Card
      data-slot="lab-panel"
      className={cn("w-full max-w-md gap-1 px-5 py-4", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span id={headingId} className="text-sm font-semibold">
          {title}
        </span>
        {collectedDate && (
          <span
            data-slot="lab-panel-date"
            className="text-muted-foreground text-xs tabular-nums"
          >
            Collected {formatDate(collectedDate)}
          </span>
        )}
      </div>
      <div
        aria-labelledby={headingId}
        role="list"
        className="divide-border/50 flex flex-col divide-y"
      >
        {React.Children.map(children, (child) => (
          <div role="listitem">{child}</div>
        ))}
      </div>
    </Card>
  )
}

export { LabPanel, LabResultRow }
