import * as React from "react"
import { CalendarClockIcon, PillIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Card } from "@/registry/medcn/card/card"
import { Separator } from "@/registry/medcn/separator/separator"

type SupplyTone = "ok" | "low" | "critical" | "out"

const toneMeta: Record<
  SupplyTone,
  {
    bar: string
    badge: React.ComponentProps<typeof Badge>["variant"]
    text: string
  }
> = {
  ok: { bar: "bg-primary", badge: "soft", text: "text-foreground" },
  low: {
    bar: "bg-warning",
    badge: "warning",
    text: "text-warning-foreground dark:text-warning",
  },
  critical: { bar: "bg-destructive", badge: "destructive", text: "text-destructive" },
  out: { bar: "bg-destructive", badge: "destructive", text: "text-destructive" },
}

function toneFor(days: number): SupplyTone {
  if (days <= 0) return "out"
  if (days <= 3) return "critical"
  if (days <= 7) return "low"
  return "ok"
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

function addDays(days: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d
}

type SupplyProps =
  | { daysRemaining: number; quantityRemaining?: never; dailyUse?: never }
  | { daysRemaining?: never; quantityRemaining: number; dailyUse: number }

export type RefillCountdownProps = Omit<
  React.ComponentProps<typeof Card>,
  "children" | "title"
> &
  SupplyProps & {
    drugName?: React.ReactNode
    strength?: React.ReactNode
    /** Explicit run-out date. Derived from today + daysRemaining when omitted. */
    runOutDate?: Date | string
    /** Full supply length, sets the depleting bar's baseline. Default 30. */
    supplyDays?: number
    /** Action slot, e.g. a "Request refill" button. */
    actions?: React.ReactNode
  }

/**
 * Days-of-supply remaining as a depleting bar with the run-out *date*
 * (patients plan around dates, not counts). Tone escalates at ≤7 and ≤3 days
 * and to an out-of-supply state at 0. Count days from dispensed quantity and
 * the sig — pass `quantityRemaining` + `dailyUse`, or `daysRemaining` directly.
 */
function RefillCountdown({
  daysRemaining: daysProp,
  quantityRemaining,
  dailyUse,
  drugName,
  strength,
  runOutDate,
  supplyDays,
  actions,
  className,
  ...props
}: RefillCountdownProps) {
  const days =
    daysProp ??
    (dailyUse && dailyUse > 0
      ? Math.max(0, Math.floor((quantityRemaining ?? 0) / dailyUse))
      : 0)

  const tone = toneFor(days)
  const meta = toneMeta[tone]
  const runOut = runOutDate ?? addDays(days)
  const runOutLabel = formatDate(runOut)

  const baseline = supplyDays ?? Math.max(days, 30)
  const fillPct = baseline > 0 ? Math.min(100, (days / baseline) * 100) : 0

  const badgeLabel =
    tone === "out" ? "Out of supply" : `${days} day${days === 1 ? "" : "s"} left`
  const summary = [
    typeof drugName === "string" ? drugName : undefined,
    tone === "out"
      ? "out of supply"
      : `${days} day${days === 1 ? "" : "s"} of supply remaining`,
    runOutLabel ? `runs out ${runOutLabel}` : undefined,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <Card
      data-slot="refill-countdown"
      data-tone={tone}
      role="group"
      aria-label={summary}
      className={cn("w-full max-w-sm gap-3 px-5 py-4", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4.5"
          >
            <PillIcon />
          </span>
          <div className="flex min-w-0 flex-col">
            <span
              data-slot="refill-countdown-drug"
              className="truncate text-sm font-semibold"
            >
              {drugName ?? "Medication"}
            </span>
            {strength && (
              <span className="text-muted-foreground text-xs">{strength}</span>
            )}
          </div>
        </div>
        <Badge
          data-slot="refill-countdown-badge"
          variant={meta.badge}
          className="shrink-0 tabular-nums"
        >
          {badgeLabel}
        </Badge>
      </div>

      {/* Depleting supply bar */}
      <div
        data-slot="refill-countdown-bar"
        aria-hidden
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", meta.bar)}
          style={{ width: `${fillPct}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <CalendarClockIcon
          className={cn("size-3.5 shrink-0", meta.text)}
          aria-hidden
        />
        <span className="text-muted-foreground text-xs">
          {tone === "out" ? (
            <span className={cn("font-semibold", meta.text)}>
              Supply exhausted
            </span>
          ) : (
            <>
              Runs out{" "}
              <span className={cn("font-semibold tabular-nums", meta.text)}>
                {runOutLabel}
              </span>
            </>
          )}
        </span>
      </div>

      {actions && (
        <>
          <Separator />
          <div
            data-slot="refill-countdown-actions"
            className="flex items-center justify-end gap-2"
          >
            {actions}
          </div>
        </>
      )}
    </Card>
  )
}

export { RefillCountdown }
