import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type ProblemStatus = "active" | "resolved" | "inactive"
export type ProblemSeverity = "mild" | "moderate" | "severe"

const statusDot: Record<ProblemStatus, string> = {
  active: "bg-destructive",
  inactive: "bg-muted-foreground/50",
  resolved: "bg-success",
}

const statusLabel: Record<ProblemStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  resolved: "Resolved",
}

const severityBadge: Record<
  ProblemSeverity,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  mild: "secondary",
  moderate: "warning",
  severe: "destructive",
}

export interface ProblemListItemProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Problem / diagnosis name. */
  name: React.ReactNode
  /** Coded identifier, e.g. an ICD-10 code. Shown as a mono chip with a Tooltip. */
  code?: React.ReactNode
  /** Coding system label surfaced in the code Tooltip. Defaults to "ICD-10". */
  codeSystem?: React.ReactNode
  status?: ProblemStatus
  severity?: ProblemSeverity
  /** Onset date/age, e.g. "Since 2019". */
  onset?: React.ReactNode
  /** When last reviewed/verified. */
  lastReviewed?: React.ReactNode
  /** Right-aligned action slot (menu, edit). */
  actions?: React.ReactNode
}

/**
 * One entry on a patient's problem list: status dot, diagnosis name, an ICD-10
 * code chip (with a Tooltip naming the coding system), onset, and severity.
 * Resolved/inactive problems are visually de-emphasized but never hidden.
 */
function ProblemListItem({
  name,
  code,
  codeSystem = "ICD-10",
  status = "active",
  severity,
  onset,
  lastReviewed,
  actions,
  className,
  ...props
}: ProblemListItemProps) {
  const resolved = status !== "active"
  const meta = [onset, lastReviewed].filter((v) => v !== undefined && v !== "")

  return (
    <div
      data-slot="problem-list-item"
      data-status={status}
      className={cn(
        "group/problem flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 shadow-soft transition-all duration-200 hover:border-border hover:shadow-lift",
        className
      )}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger
          aria-label={statusLabel[status]}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <span
            aria-hidden
            className={cn(
              "block size-2.5 rounded-full ring-4 ring-transparent transition-transform duration-200 group-hover/problem:scale-110",
              statusDot[status]
            )}
          />
        </TooltipTrigger>
        <TooltipContent>{statusLabel[status]}</TooltipContent>
      </Tooltip>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "truncate text-sm font-semibold",
              resolved && "text-muted-foreground line-through decoration-1"
            )}
          >
            {name}
          </span>
          {code && (
            <Tooltip>
              <TooltipTrigger
                className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                aria-label={`${codeSystem} ${typeof code === "string" ? code : ""}`}
              >
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                  {code}
                </span>
              </TooltipTrigger>
              <TooltipContent>{codeSystem} code</TooltipContent>
            </Tooltip>
          )}
          {severity && (
            <Badge variant={severityBadge[severity]} className="shrink-0 capitalize">
              {severity}
            </Badge>
          )}
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
      </div>

      {resolved && (
        <Badge variant="outline" className="shrink-0 text-muted-foreground">
          {statusLabel[status]}
        </Badge>
      )}
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export { ProblemListItem }
