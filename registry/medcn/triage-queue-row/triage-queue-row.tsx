import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import { TriageLevelIndicator } from "@/registry/medcn/triage-level-indicator/triage-level-indicator"

type TriageLevel = React.ComponentProps<typeof TriageLevelIndicator>["level"]

function getInitials(name: React.ReactNode): string {
  if (typeof name !== "string") return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatWait(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m.toString().padStart(2, "0")}m`
}

type WaitTone = "ok" | "warning" | "breach"

function waitTone(minutes: number, target?: number): WaitTone {
  if (target === undefined || target <= 0) return "ok"
  if (minutes >= target) return "breach"
  if (minutes >= target * 0.75) return "warning"
  return "ok"
}

const waitBadge: Record<WaitTone, React.ComponentProps<typeof Badge>["variant"]> = {
  ok: "secondary",
  warning: "warning",
  breach: "destructive",
}

export interface TriageQueueRowProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  name: React.ReactNode
  age?: React.ReactNode
  sex?: React.ReactNode
  avatarSrc?: string
  level: TriageLevel
  /** Chief complaint, truncated to one line. */
  complaint?: React.ReactNode
  waitingMinutes: number
  /** Per-level wait target; the chip escalates as it's approached and breached. */
  targetMinutes?: number
  /** Right-aligned action slot. */
  actions?: React.ReactNode
}

/**
 * One waiting patient in an ED/clinic queue: identity, TriageLevelIndicator,
 * truncated chief complaint, and a waiting-time chip that escalates against a
 * per-level target. Waiting-time targets differ per acuity level, so the
 * threshold is a prop — the row stays legible on a wallboard at distance.
 */
function TriageQueueRow({
  name,
  age,
  sex,
  avatarSrc,
  level,
  complaint,
  waitingMinutes,
  targetMinutes,
  actions,
  className,
  ...props
}: TriageQueueRowProps) {
  const tone = waitTone(waitingMinutes, targetMinutes)
  const demographics = [age, sex].filter((v) => v !== undefined && v !== "")

  const accessibleWait = `waiting ${formatWait(waitingMinutes)}${
    tone === "breach"
      ? ", target breached"
      : tone === "warning"
        ? ", approaching target"
        : ""
  }`

  return (
    <div
      data-slot="triage-queue-row"
      data-level={level}
      data-wait-tone={tone}
      className={cn(
        "bg-card flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 shadow-soft transition-shadow hover:shadow-lift",
        className
      )}
      {...props}
    >
      <Avatar className="ring-border size-10 shrink-0 ring-1">
        {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
        <AvatarFallback className="text-xs font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold">{name}</span>
          {demographics.length > 0 && (
            <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
              {demographics.map((d, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-muted-foreground/40"> · </span>}
                  {d}
                </React.Fragment>
              ))}
            </span>
          )}
        </span>
        {complaint && (
          <span className="text-muted-foreground truncate text-xs">
            {complaint}
          </span>
        )}
      </div>

      <TriageLevelIndicator level={level} size="sm" className="shrink-0" />

      <Badge
        data-slot="triage-queue-row-wait"
        variant={waitBadge[tone]}
        aria-label={accessibleWait}
        className={cn(
          "shrink-0 tabular-nums",
          tone === "breach" && "motion-safe:animate-pulse"
        )}
      >
        {formatWait(waitingMinutes)}
      </Badge>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export { TriageQueueRow }
