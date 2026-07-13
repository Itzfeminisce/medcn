import * as React from "react"
import { ShieldAlertIcon, TriangleAlertIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "@/registry/medcn/alert/alert"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"

export type AiEscalationSeverity = "urgent" | "priority" | "review"

const SEVERITY_CONFIG: Record<
  AiEscalationSeverity,
  {
    label: string
    variant: "destructive" | "warning" | "info"
    badge: "destructive" | "warning" | "info"
    Icon: React.ElementType
  }
> = {
  urgent: {
    label: "Urgent review",
    variant: "destructive",
    badge: "destructive",
    Icon: ShieldAlertIcon,
  },
  priority: {
    label: "Priority review",
    variant: "warning",
    badge: "warning",
    Icon: TriangleAlertIcon,
  },
  review: {
    label: "Review",
    variant: "info",
    badge: "info",
    Icon: TriangleAlertIcon,
  },
}

export interface AiEscalationAlertProps
  extends Omit<React.ComponentProps<typeof Alert>, "title" | "variant"> {
  /** What needs a human — state the condition, not the model's opinion. */
  title: React.ReactNode
  severity?: AiEscalationSeverity
  /** Why this was raised, and by what. */
  children?: React.ReactNode
  /** Caller-owned escalation action, e.g. "Open the sepsis pathway". */
  action?: React.ReactNode
  /**
   * Allow dismissal. Off by default: an escalation a clinician can swipe away
   * without acting is not an escalation.
   */
  dismissible?: boolean
  onDismiss?: () => void
}

/**
 * Urgent human-review surface. It presents a signal for a person to act on and
 * routes them to a local protocol — it never claims triage accuracy and never
 * stands in for one.
 */
function AiEscalationAlert({
  className,
  title,
  severity = "urgent",
  children,
  action,
  dismissible = false,
  onDismiss,
  ...props
}: AiEscalationAlertProps) {
  const config = SEVERITY_CONFIG[severity]

  return (
    <Alert
      data-slot="ai-escalation-alert"
      data-severity={severity}
      variant={config.variant}
      role="alert"
      className={cn("relative overflow-hidden pl-5", className)}
      {...props}
    >
      {/* Severity rail — a second, non-colour-only cue at a glance. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          severity === "urgent" && "bg-destructive motion-safe:animate-pulse",
          severity === "priority" && "bg-warning",
          severity === "review" && "bg-info"
        )}
      />

      <config.Icon aria-hidden />

      <AlertTitle className="flex flex-wrap items-center gap-2">
        <span className="min-w-0">{title}</span>
        <Badge
          variant={config.badge}
          className="h-4 shrink-0 px-1.5 py-0 text-[10px] font-bold uppercase"
        >
          {config.label}
        </Badge>
      </AlertTitle>

      {children && <AlertDescription>{children}</AlertDescription>}

      {action && <AlertActions>{action}</AlertActions>}

      {dismissible && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Dismiss escalation"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground absolute top-2 right-2 size-7"
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </Alert>
  )
}

export { AiEscalationAlert, SEVERITY_CONFIG as aiEscalationSeverities }
