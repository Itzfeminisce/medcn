import * as React from "react"
import { MapPin, Video } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type AppointmentStatus =
  | "scheduled"
  | "checked-in"
  | "in-room"
  | "completed"
  | "cancelled"
  | "no-show"

const statusConfig: Record<
  AppointmentStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"]; rail: string }
> = {
  scheduled: { label: "Scheduled", variant: "secondary", rail: "before:bg-border" },
  "checked-in": { label: "Checked in", variant: "info", rail: "before:bg-info" },
  "in-room": { label: "In room", variant: "warning", rail: "before:bg-warning" },
  completed: { label: "Completed", variant: "success", rail: "before:bg-success" },
  cancelled: { label: "Cancelled", variant: "outline", rail: "before:bg-muted-foreground/40" },
  "no-show": { label: "No-show", variant: "destructive", rail: "before:bg-destructive" },
}

function initials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export interface AppointmentRowProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Start time, e.g. "10:30". */
  time: React.ReactNode
  /** Duration/period, e.g. "30 min". */
  duration?: React.ReactNode
  /** Patient (or attendee) — avatar + name. */
  patient?: { name: string; avatarSrc?: string }
  /** Falls back here when no `patient`. */
  title?: React.ReactNode
  /** Visit type, e.g. "Follow-up". */
  type?: React.ReactNode
  status?: AppointmentStatus
  /** Room/location. Renders with a pin; use `telehealth` for a video pin. */
  location?: React.ReactNode
  telehealth?: boolean
  interactive?: boolean
  /** Right-aligned actions (Check in, Reschedule). */
  actions?: React.ReactNode
}

/**
 * One appointment on an agenda: a fixed time column, a status-tinted left rail,
 * the patient (avatar + name), visit type, location, a status badge, and an
 * action slot. Pairs with `appointment-check-in` for the arrival flow.
 */
function AppointmentRow({
  time,
  duration,
  patient,
  title,
  type,
  status = "scheduled",
  location,
  telehealth = false,
  interactive = false,
  actions,
  className,
  ...props
}: AppointmentRowProps) {
  const cfg = statusConfig[status]
  const LocationIcon = telehealth ? Video : MapPin

  return (
    <div
      data-slot="appointment-row"
      data-status={status}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "group/appt relative flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-card py-2.5 pl-4 pr-3 shadow-soft transition-all duration-200 hover:border-border hover:shadow-lift",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-['']",
        cfg.rail,
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.995]",
        status === "cancelled" && "opacity-70",
        className
      )}
      {...props}
    >
      <div className="flex w-14 shrink-0 flex-col items-start">
        <span className="text-sm font-semibold tabular-nums">{time}</span>
        {duration && (
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {duration}
          </span>
        )}
      </div>

      {patient && (
        <Avatar className="size-9 shrink-0 ring-1 ring-border transition-transform duration-200 group-hover/appt:scale-105">
          {patient.avatarSrc && <AvatarImage src={patient.avatarSrc} alt="" />}
          <AvatarFallback className="text-xs font-semibold">
            {initials(patient.name)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "truncate text-sm font-semibold",
            status === "cancelled" && "line-through decoration-1"
          )}
        >
          {patient?.name ?? title}
        </span>
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          {type && <span className="truncate">{type}</span>}
          {type && location && (
            <span className="text-muted-foreground/40">·</span>
          )}
          {location && (
            <Tooltip>
              <TooltipTrigger
                className="flex min-w-0 items-center gap-0.5 rounded focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                aria-label={telehealth ? "Telehealth visit" : "Location"}
              >
                <LocationIcon className="size-3 shrink-0" />
                <span className="truncate">{location}</span>
              </TooltipTrigger>
              <TooltipContent>
                {telehealth ? "Telehealth visit" : location}
              </TooltipContent>
            </Tooltip>
          )}
        </span>
      </div>

      <Badge variant={cfg.variant} className="hidden shrink-0 sm:inline-flex">
        {cfg.label}
      </Badge>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export { AppointmentRow }
