import * as React from "react"
import {
  CalendarClockIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Card } from "@/registry/medcn/card/card"

function getInitials(name: React.ReactNode): string {
  if (typeof name !== "string") return "?"
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

function TechRow({ ok, onLabel, offLabel, OnIcon, OffIcon }: {
  ok: boolean
  onLabel: string
  offLabel: string
  OnIcon: React.ComponentType<{ className?: string }>
  OffIcon: React.ComponentType<{ className?: string }>
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        ok ? "text-success" : "text-destructive"
      )}
    >
      {ok ? (
        <OnIcon className="size-3.5" />
      ) : (
        <OffIcon className="size-3.5" />
      )}
      {ok ? onLabel : offLabel}
    </span>
  )
}

export interface TelehealthCallCardProps
  extends Omit<React.ComponentProps<typeof Card>, "children" | "title"> {
  clinicianName: React.ReactNode
  specialty?: React.ReactNode
  avatarSrc?: string
  scheduledTime: Date | string
  /** Timezone label — always shown; cross-timezone no-shows are usually tz bugs. */
  timezone: string
  /** Whether the join window is open. Policy, so it's a prop (e.g. 10 min before). */
  joinEnabled?: boolean
  /** Join target when enabled; rendered as a link. */
  joinHref?: string
  onJoin?: () => void
  /** Tech-check states; omit to hide the row. */
  camera?: boolean
  mic?: boolean
}

/**
 * Upcoming telehealth visit: clinician identity, scheduled time with an
 * always-visible timezone, a camera/mic tech-check row, and a Join button the
 * caller enables when the join window opens (policy, so it's a prop).
 */
function TelehealthCallCard({
  clinicianName,
  specialty,
  avatarSrc,
  scheduledTime,
  timezone,
  joinEnabled = false,
  joinHref,
  onJoin,
  camera,
  mic,
  className,
  ...props
}: TelehealthCallCardProps) {
  const joinLabel = joinEnabled ? "Join visit" : "Join opens soon"
  const showTechCheck = camera !== undefined || mic !== undefined

  return (
    <Card
      data-slot="telehealth-call-card"
      data-join-enabled={joinEnabled || undefined}
      className={cn("w-full max-w-sm gap-4 px-5 py-4", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="ring-border shrink-0 ring-1">
            {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
            <AvatarFallback className="font-semibold">
              {getInitials(clinicianName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">
              {clinicianName}
            </span>
            {specialty && (
              <span className="text-muted-foreground text-xs">{specialty}</span>
            )}
          </div>
        </div>
        <Badge variant={joinEnabled ? "success" : "soft"} className="shrink-0">
          {joinEnabled ? "Ready" : "Scheduled"}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CalendarClockIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
        <span className="font-medium tabular-nums">
          {formatTime(scheduledTime)}
        </span>
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          {timezone}
        </span>
      </div>

      {showTechCheck && (
        <div className="bg-muted/50 flex items-center gap-4 rounded-lg px-3 py-2">
          {camera !== undefined && (
            <TechRow
              ok={camera}
              onLabel="Camera ready"
              offLabel="Camera blocked"
              OnIcon={VideoIcon}
              OffIcon={VideoOffIcon}
            />
          )}
          {mic !== undefined && (
            <TechRow
              ok={mic}
              onLabel="Mic ready"
              offLabel="Mic blocked"
              OnIcon={MicIcon}
              OffIcon={MicOffIcon}
            />
          )}
        </div>
      )}

      {joinEnabled && joinHref ? (
        <Button asChild className="w-full">
          <a href={joinHref}>
            <VideoIcon className="size-4" />
            {joinLabel}
          </a>
        </Button>
      ) : (
        <Button
          className="w-full"
          variant={joinEnabled ? "default" : "secondary"}
          disabled={!joinEnabled}
          onClick={onJoin}
        >
          <VideoIcon className="size-4" />
          {joinLabel}
        </Button>
      )}
    </Card>
  )
}

export { TelehealthCallCard }
