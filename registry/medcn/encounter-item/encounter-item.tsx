import * as React from "react"
import {
  Activity,
  Bed,
  FlaskConical,
  Scissors,
  Stethoscope,
  Syringe,
  Video,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type EncounterType =
  | "office"
  | "ed"
  | "inpatient"
  | "telehealth"
  | "procedure"
  | "lab"
  | "immunization"
  | "other"

export type EncounterStatus =
  | "completed"
  | "scheduled"
  | "in-progress"
  | "cancelled"

const typeConfig: Record<
  EncounterType,
  { icon: React.ElementType; label: string; chip: string }
> = {
  office: { icon: Stethoscope, label: "Office visit", chip: "bg-primary/10 text-primary" },
  ed: { icon: Activity, label: "ED", chip: "bg-destructive/10 text-destructive" },
  inpatient: { icon: Bed, label: "Inpatient", chip: "bg-info/10 text-info" },
  telehealth: { icon: Video, label: "Telehealth", chip: "bg-primary/10 text-primary" },
  procedure: { icon: Scissors, label: "Procedure", chip: "bg-warning/15 text-warning-foreground" },
  lab: { icon: FlaskConical, label: "Laboratory", chip: "bg-success/10 text-success" },
  immunization: { icon: Syringe, label: "Immunization", chip: "bg-success/10 text-success" },
  other: { icon: Stethoscope, label: "Encounter", chip: "bg-muted text-muted-foreground" },
}

const statusBadge: Record<
  EncounterStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  completed: { label: "Completed", variant: "secondary" },
  scheduled: { label: "Scheduled", variant: "info" },
  "in-progress": { label: "In progress", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "outline" },
}

export interface EncounterItemProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  type?: EncounterType
  /** Encounter reason/title. Falls back to the type label. */
  title?: React.ReactNode
  provider?: React.ReactNode
  /** Location/facility. */
  location?: React.ReactNode
  date?: React.ReactNode
  status?: EncounterStatus
  /** One-line summary/impression. */
  summary?: React.ReactNode
  /** Override the type icon. */
  icon?: React.ReactNode
  interactive?: boolean
  actions?: React.ReactNode
}

/**
 * One visit/encounter as a self-contained row: a type-tinted icon chip (with a
 * Tooltip naming the encounter type), reason, provider · location · date meta,
 * a status badge, and an optional summary. Drop into a list, or map onto a
 * Timeline for chronological history.
 */
function EncounterItem({
  type = "office",
  title,
  provider,
  location,
  date,
  status = "completed",
  summary,
  icon,
  interactive = false,
  actions,
  className,
  ...props
}: EncounterItemProps) {
  const cfg = typeConfig[type]
  const Icon = cfg.icon
  const sb = statusBadge[status]
  const meta = [provider, location, date].filter(
    (v) => v !== undefined && v !== ""
  )

  return (
    <div
      data-slot="encounter-item"
      data-type={type}
      data-status={status}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "group/enc flex items-start gap-3 rounded-xl border border-border/60 bg-card px-3 py-3 shadow-soft transition-all duration-200 hover:border-border hover:shadow-lift",
        interactive &&
          "cursor-pointer hover:-translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:translate-y-0 active:scale-[0.995]",
        status === "cancelled" && "opacity-70",
        className
      )}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger
          aria-label={cfg.label}
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <span
            aria-hidden
            className={cn(
              "flex size-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover/enc:scale-105 [&_svg]:size-4.5",
              cfg.chip
            )}
          >
            {icon ?? <Icon />}
          </span>
        </TooltipTrigger>
        <TooltipContent>{cfg.label}</TooltipContent>
      </Tooltip>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "truncate text-sm font-semibold",
              status === "cancelled" && "line-through decoration-1"
            )}
          >
            {title ?? cfg.label}
          </span>
          <Badge variant={sb.variant} className="ml-auto shrink-0">
            {sb.label}
          </Badge>
        </div>
        {meta.length > 0 && (
          <span className="truncate text-xs text-muted-foreground">
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-muted-foreground/40"> · </span>}
                {m}
              </React.Fragment>
            ))}
          </span>
        )}
        {summary && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {summary}
          </p>
        )}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export { EncounterItem }
