"use client"

import * as React from "react"
import {
  BellRing,
  CheckCircle2,
  Info,
  ShieldAlert,
  TriangleAlert,
  X,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type AlertSeverity = "critical" | "warning" | "info" | "success"

const severityConfig: Record<
  AlertSeverity,
  { icon: React.ElementType; wrap: string; icons: string; role: "alert" | "status" }
> = {
  critical: {
    icon: ShieldAlert,
    wrap: "border-destructive/30 bg-destructive/5",
    icons: "bg-destructive/10 text-destructive",
    role: "alert",
  },
  warning: {
    icon: TriangleAlert,
    wrap: "border-warning/30 bg-warning/5",
    icons: "bg-warning/15 text-warning-foreground",
    role: "alert",
  },
  info: {
    icon: Info,
    wrap: "border-info/30 bg-info/5",
    icons: "bg-info/10 text-info",
    role: "status",
  },
  success: {
    icon: CheckCircle2,
    wrap: "border-success/30 bg-success/5",
    icons: "bg-success/10 text-success",
    role: "status",
  },
}

export interface ClinicalAlertItemProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  severity?: AlertSeverity
  title: React.ReactNode
  /** Body of the alert. */
  message?: React.ReactNode
  /** Category chip, e.g. "Drug interaction" or "Critical lab". */
  category?: React.ReactNode
  /** Rule/source disclosed via a Tooltip on the category chip. */
  source?: React.ReactNode
  time?: React.ReactNode
  /** Override the leading icon. */
  icon?: React.ReactNode
  /** Show an acknowledge button; called on click. */
  onAcknowledge?: () => void
  /** Show a dismiss (×) button; called on click. */
  onDismiss?: () => void
  /** Extra right-aligned actions. */
  actions?: React.ReactNode
}

/**
 * One clinical alert in a feed: severity-tinted, an icon chip, title + message,
 * a category chip (with a source Tooltip), timestamp, and acknowledge / dismiss
 * affordances. Critical & warning render with role="alert" for assistive tech.
 */
function ClinicalAlertItem({
  severity = "info",
  title,
  message,
  category,
  source,
  time,
  icon,
  onAcknowledge,
  onDismiss,
  actions,
  className,
  ...props
}: ClinicalAlertItemProps) {
  const cfg = severityConfig[severity]
  const Icon = cfg.icon

  return (
    <div
      data-slot="clinical-alert-item"
      data-severity={severity}
      role={cfg.role}
      className={cn(
        "group/alert flex items-start gap-3 rounded-xl border px-3 py-3 shadow-soft transition-all duration-200 hover:shadow-lift",
        cfg.wrap,
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover/alert:scale-105 [&_svg]:size-4.5",
          cfg.icons,
          severity === "critical" && "motion-safe:animate-pulse"
        )}
      >
        {icon ?? <Icon />}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold">{title}</span>
          {category &&
            (source ? (
              <Tooltip>
                <TooltipTrigger
                  className="rounded focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  aria-label={
                    typeof category === "string" ? category : undefined
                  }
                >
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground underline-offset-2 decoration-dotted group-hover/alert:underline">
                    {category}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{source}</TooltipContent>
              </Tooltip>
            ) : (
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {category}
              </span>
            ))}
          {time && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
              {time}
            </span>
          )}
        </div>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        {(onAcknowledge || actions) && (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {onAcknowledge && (
              <button
                type="button"
                onClick={onAcknowledge}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.98]"
              >
                <BellRing className="size-3.5" /> Acknowledge
              </button>
            )}
            {actions}
          </div>
        )}
      </div>

      {onDismiss && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss alert"
              className="-mr-1 shrink-0 rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-90"
            >
              <X className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Dismiss</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

export { ClinicalAlertItem }
