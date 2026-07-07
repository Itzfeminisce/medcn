"use client"

import * as React from "react"
import {
  BanIcon,
  ClockIcon,
  CupSodaIcon,
  PillIcon,
  UtensilsCrossedIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

export type FastingRestrictionKind = "food" | "fluids" | "medications"

export interface FastingRestriction {
  /** Verbatim instruction from the care team, e.g. "No solid food". */
  label: React.ReactNode
  /** Picks the row icon; defaults to a generic marker. */
  kind?: FastingRestrictionKind
  /** Optional window text, e.g. "since 22:00" or "clear fluids OK until 06:00". */
  window?: React.ReactNode
}

type BannerTone = "info" | "warning" | "critical" | "reached"

const toneMeta: Record<
  BannerTone,
  { wrap: string; icon: string; chip: string; title: string }
> = {
  info: {
    wrap: "border-info/25 bg-info/8",
    icon: "text-info",
    chip: "bg-info/15 text-info",
    title: "Fasting in effect",
  },
  warning: {
    wrap: "border-warning/30 bg-warning/10",
    icon: "text-warning-foreground dark:text-warning",
    chip: "bg-warning/20 text-warning-foreground dark:text-warning",
    title: "Procedure soon — remain nil by mouth",
  },
  critical: {
    wrap: "border-destructive/30 bg-destructive/10",
    icon: "text-destructive",
    chip: "bg-destructive/15 text-destructive",
    title: "Procedure imminent — stay nil by mouth",
  },
  reached: {
    wrap: "border-border bg-muted/40",
    icon: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
    title: "Procedure time reached",
  },
}

const kindIcon: Record<FastingRestrictionKind, React.ComponentType<{ className?: string }>> = {
  food: UtensilsCrossedIcon,
  fluids: CupSodaIcon,
  medications: PillIcon,
}

function toneFor(msRemaining: number): BannerTone {
  if (msRemaining <= 0) return "reached"
  if (msRemaining <= 30 * 60_000) return "critical"
  if (msRemaining <= 2 * 60 * 60_000) return "warning"
  return "info"
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "now"
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function toTime(d: Date | string): number {
  const date = typeof d === "string" ? new Date(d) : d
  return date.getTime()
}

export interface FastingStatusBannerProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Scheduled procedure time; the countdown target. */
  procedureTime: Date | string
  /** What the procedure is, e.g. "Colonoscopy". */
  procedureLabel?: React.ReactNode
  /** Restriction rows, passed verbatim — the component never computes cutoffs. */
  restrictions: FastingRestriction[]
}

/**
 * Pre-procedure nil-by-mouth (NPO) banner: renders the restrictions the care
 * team specifies verbatim and counts down to the procedure, escalating tone as
 * the time approaches. It renders and counts down only — it never computes
 * clinical fasting cutoffs itself.
 */
function FastingStatusBanner({
  procedureTime,
  procedureLabel,
  restrictions,
  className,
  ...props
}: FastingStatusBannerProps) {
  const target = React.useMemo(() => toTime(procedureTime), [procedureTime])
  // Null until mounted so SSR and first client render match (no clock on the server).
  const [now, setNow] = React.useState<number | null>(null)

  React.useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = now === null ? null : target - now
  const tone = remaining === null ? "info" : toneFor(remaining)
  const meta = toneMeta[tone]
  const countdown = remaining === null ? "—" : formatRemaining(remaining)

  const summary = [
    "Nil by mouth",
    procedureLabel && typeof procedureLabel === "string"
      ? `for ${procedureLabel}`
      : undefined,
    remaining === null
      ? undefined
      : remaining <= 0
        ? "procedure time reached"
        : `${countdown} until procedure`,
    restrictions.length
      ? "Restrictions: " +
        restrictions
          .map((r) => (typeof r.label === "string" ? r.label : "restriction"))
          .join(", ")
      : undefined,
  ]
    .filter(Boolean)
    .join(". ")

  return (
    <div
      data-slot="fasting-status-banner"
      data-tone={tone}
      role="group"
      aria-label={summary}
      className={cn(
        "w-full max-w-md rounded-xl border p-4 shadow-soft transition-colors",
        meta.wrap,
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/60",
            meta.icon,
            tone === "critical" && "motion-safe:animate-pulse"
          )}
        >
          <BanIcon className="size-5" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">
                Nil by mouth (NPO)
                {procedureLabel && (
                  <span className="text-muted-foreground font-normal">
                    {" · "}
                    {procedureLabel}
                  </span>
                )}
              </span>
              <span className={cn("text-xs font-medium", meta.icon)}>
                {meta.title}
              </span>
            </div>
            <span
              data-slot="fasting-status-banner-countdown"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                meta.chip
              )}
            >
              <ClockIcon className="size-3.5" aria-hidden />
              {remaining !== null && remaining <= 0 ? "Reached" : countdown}
            </span>
          </div>

          {restrictions.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {restrictions.map((r, i) => {
                const Icon = r.kind ? kindIcon[r.kind] : BanIcon
                return (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-foreground font-medium">{r.label}</span>
                    {r.window && (
                      <span className="text-muted-foreground text-xs">
                        {r.window}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export { FastingStatusBanner }
