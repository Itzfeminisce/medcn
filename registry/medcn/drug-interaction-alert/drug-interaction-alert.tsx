"use client"

import * as React from "react"
import {
  BanIcon,
  ChevronDownIcon,
  InfoIcon,
  ShieldAlertIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"

export type InteractionSeverity = "minor" | "moderate" | "major" | "contraindicated"

const severityConfig: Record<
  InteractionSeverity,
  {
    label: string
    Icon: React.FC<React.ComponentProps<"svg">>
    dismissible: boolean
    role: "alert" | "status"
    /** Number of lit escalation bars (of 4). */
    bars: number
    surface: string
    rail: string
    accent: string
    barFill: string
  }
> = {
  minor: {
    label: "Minor interaction",
    Icon: InfoIcon,
    dismissible: true,
    role: "status",
    bars: 1,
    surface: "bg-info/8 border-info/25",
    rail: "bg-info",
    accent: "text-info",
    barFill: "bg-info",
  },
  moderate: {
    label: "Moderate interaction",
    Icon: TriangleAlertIcon,
    dismissible: true,
    role: "status",
    bars: 2,
    surface: "bg-warning/10 border-warning/30",
    rail: "bg-warning",
    accent: "text-warning-foreground dark:text-warning",
    barFill: "bg-warning",
  },
  major: {
    label: "Major interaction",
    Icon: ShieldAlertIcon,
    dismissible: false,
    role: "alert",
    bars: 3,
    surface: "bg-destructive/8 border-destructive/30",
    rail: "bg-destructive",
    accent: "text-destructive",
    barFill: "bg-destructive",
  },
  contraindicated: {
    label: "Contraindicated",
    Icon: BanIcon,
    dismissible: false,
    role: "alert",
    bars: 4,
    surface: "bg-destructive/12 border-destructive/40",
    rail: "bg-destructive",
    accent: "text-destructive",
    barFill: "bg-destructive",
  },
}

export interface DrugInteractionAlertProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  severity: InteractionSeverity
  /** The interacting pair, e.g. ["Warfarin", "Aspirin"], or a single node. */
  drugs: [React.ReactNode, React.ReactNode] | React.ReactNode
  description?: React.ReactNode
  /** Collapsible clinical detail shown via "Management advice" toggle. */
  detail?: React.ReactNode
  /** Honoured only for minor/moderate — major/contraindicated are non-dismissible. */
  onDismiss?: () => void
}

/** Four-bar escalation meter: minor → contraindicated. */
function EscalationMeter({ severity }: { severity: InteractionSeverity }) {
  const { bars, barFill } = severityConfig[severity]
  return (
    <span
      data-slot="drug-interaction-alert-meter"
      className="flex items-end gap-0.5"
      aria-hidden
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full transition-all",
            // escalating heights read as rising severity
            i === 0 && "h-1.5",
            i === 1 && "h-2",
            i === 2 && "h-2.5",
            i === 3 && "h-3",
            i < bars ? barFill : "bg-current opacity-15"
          )}
        />
      ))}
    </span>
  )
}

/**
 * Severity-tiered drug interaction / contraindication banner. A four-bar
 * escalation meter and a colored rail convey severity at a glance; major and
 * contraindicated tiers are non-dismissible and use role="alert".
 */
function DrugInteractionAlert({
  severity,
  drugs,
  description,
  detail,
  onDismiss,
  className,
  ...props
}: DrugInteractionAlertProps) {
  const cfg = severityConfig[severity]
  const [open, setOpen] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) return null

  const drugPair: React.ReactNode = Array.isArray(drugs) ? (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold">{drugs[0]}</span>
      <span className="text-current/50 text-[11px]" aria-hidden>
        ✕
      </span>
      <span className="font-semibold">{drugs[1]}</span>
    </span>
  ) : (
    <span className="font-semibold">{drugs}</span>
  )

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const highTier = severity === "major" || severity === "contraindicated"

  return (
    <div
      data-slot="drug-interaction-alert"
      data-severity={severity}
      role={cfg.role}
      className={cn(
        "text-foreground relative w-full overflow-hidden rounded-xl border pl-4 pr-3 py-3 text-sm shadow-soft",
        cfg.surface,
        className
      )}
      {...props}
    >
      {/* Colored severity rail */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          cfg.rail,
          highTier && "motion-safe:animate-pulse"
        )}
      />

      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center [&_svg]:size-4",
            cfg.accent
          )}
        >
          <cfg.Icon aria-hidden />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wide",
                    cfg.accent
                  )}
                >
                  {cfg.label}
                </span>
                <EscalationMeter severity={severity} />
              </span>
              <span className="text-foreground text-sm leading-tight">
                {drugPair}
              </span>
            </div>

            {cfg.dismissible && onDismiss && (
              <button
                onClick={handleDismiss}
                aria-label="Dismiss alert"
                className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 -mr-1 -mt-1 shrink-0 rounded-md p-1 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>

          {description && (
            <p className="text-muted-foreground text-[13px] leading-relaxed">
              {description}
            </p>
          )}

          {detail && (
            <Collapsible open={open} onOpenChange={setOpen} className="mt-0.5">
              <CollapsibleTrigger
                data-slot="drug-interaction-alert-toggle"
                aria-expanded={open}
                className={cn(
                  "focus-visible:ring-ring inline-flex items-center gap-1 rounded text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2",
                  cfg.accent
                )}
              >
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    open && "rotate-180"
                  )}
                  aria-hidden
                />
                {open ? "Hide advice" : "Management advice"}
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div
                  data-slot="drug-interaction-alert-detail"
                  className="text-muted-foreground border-current/15 mt-2 border-l-2 pl-3 text-xs leading-relaxed"
                >
                  {detail}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  )
}

export { DrugInteractionAlert }
