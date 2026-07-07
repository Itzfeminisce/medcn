import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type LabOrderStage =
  | "ordered"
  | "collected"
  | "in-lab"
  | "resulted"
  | "reviewed"

export type LabOrderTerminalState = "cancelled" | "rejected"

const BASE_STAGES: LabOrderStage[] = [
  "ordered",
  "collected",
  "in-lab",
  "resulted",
]

const STAGE_LABEL: Record<LabOrderStage, string> = {
  ordered: "Ordered",
  collected: "Collected",
  "in-lab": "In lab",
  resulted: "Resulted",
  reviewed: "Reviewed",
}

const TERMINAL_LABEL: Record<LabOrderTerminalState, string> = {
  cancelled: "Cancelled",
  rejected: "Rejected",
}

const sizeConfig = {
  sm: {
    circle: "size-5",
    icon: "size-3",
    connMt: "mt-2.5",
    col: "w-12",
    label: "text-[10px]",
  },
  default: {
    circle: "size-6",
    icon: "size-3.5",
    connMt: "mt-3",
    col: "w-14",
    label: "text-[11px]",
  },
} as const

function formatStamp(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}

export interface LabOrderStatusProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** The furthest stage the order has reached. */
  current: LabOrderStage
  /** Append a final "reviewed" stage — unseen results are a real safety gap. */
  showReviewed?: boolean
  /** Per-stage timestamps, surfaced in each node's tooltip. */
  times?: Partial<Record<LabOrderStage, Date | string>>
  /** Terminal outcome (e.g. haemolysed sample → rejected). Ends the pipeline. */
  terminal?: {
    state: LabOrderTerminalState
    at?: Date | string
    reason?: string
  }
  size?: "sm" | "default"
}

/**
 * Horizontal micro-pipeline for a lab order:
 * `ordered → collected → in-lab → resulted` with an optional `reviewed`
 * stage, plus terminal `cancelled`/`rejected` states. The current stage is
 * lit in `--primary`; per-stage timestamps live in tooltips. Informational
 * UI — "resulted" is not "reviewed", so callers can require the extra stage.
 */
function LabOrderStatus({
  current,
  showReviewed = false,
  times,
  terminal,
  size = "default",
  className,
  ...props
}: LabOrderStatusProps) {
  const stages: LabOrderStage[] =
    showReviewed || current === "reviewed"
      ? [...BASE_STAGES, "reviewed"]
      : BASE_STAGES
  const reachedIndex = stages.indexOf(current)
  const isTerminal = !!terminal
  const sc = sizeConfig[size]

  // When terminal, the pipeline halts at the reached stage; the rest is moot.
  const visibleStages = isTerminal
    ? stages.slice(0, reachedIndex + 1)
    : stages

  const summary =
    "Lab order status. " +
    stages
      .map((s, i) => {
        const status = isTerminal
          ? i <= reachedIndex
            ? "done"
            : "not reached"
          : i < reachedIndex
            ? "done"
            : i === reachedIndex
              ? "current"
              : "pending"
        const t = times?.[s]
        return `${STAGE_LABEL[s]} ${status}${t ? `, ${formatStamp(t)}` : ""}`
      })
      .join("; ") +
    (terminal
      ? `. Order ${TERMINAL_LABEL[terminal.state].toLowerCase()}${
          terminal.reason ? `: ${terminal.reason}` : ""
        }${terminal.at ? ` at ${formatStamp(terminal.at)}` : ""}.`
      : "")

  return (
    <div
      data-slot="lab-order-status"
      data-current={current}
      data-terminal={terminal?.state}
      role="img"
      aria-label={summary}
      className={cn("w-full max-w-md", className)}
      {...props}
    >
      <div aria-hidden className="flex items-start">
        {visibleStages.map((stage, i) => {
          const status: "done" | "current" | "upcoming" = isTerminal
            ? "done"
            : i < reachedIndex
              ? "done"
              : i === reachedIndex
                ? "current"
                : "upcoming"
          const t = times?.[stage]
          const connectorFilled = i <= reachedIndex

          return (
            <React.Fragment key={stage}>
              {i > 0 && (
                <span
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    sc.connMt,
                    connectorFilled
                      ? "bg-primary"
                      : "bg-muted-foreground/25"
                  )}
                />
              )}
              <div
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1.5 text-center",
                  sc.col
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        "relative z-10 flex items-center justify-center rounded-full transition-all duration-300",
                        sc.circle,
                        status === "done" &&
                          "bg-primary text-primary-foreground",
                        status === "current" &&
                          "border-2 border-primary bg-primary/10 text-primary shadow-glow motion-safe:animate-pulse",
                        status === "upcoming" &&
                          "border border-dashed border-muted-foreground/30 text-muted-foreground/40"
                      )}
                    >
                      {status === "done" ? (
                        <CheckIcon className={sc.icon} />
                      ) : status === "current" ? (
                        <span className="bg-primary size-2 rounded-full" />
                      ) : (
                        <span className="bg-muted-foreground/40 size-1.5 rounded-full" />
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{STAGE_LABEL[stage]}</p>
                    <p className="text-background/70 text-[11px]">
                      {t
                        ? formatStamp(t)
                        : status === "current"
                          ? "In progress"
                          : status === "done"
                            ? "Completed"
                            : "Pending"}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <span
                  className={cn(
                    "font-medium leading-tight",
                    sc.label,
                    status === "current"
                      ? "text-primary font-semibold"
                      : status === "done"
                        ? "text-foreground"
                        : "text-muted-foreground/60"
                  )}
                >
                  {STAGE_LABEL[stage]}
                </span>
              </div>
            </React.Fragment>
          )
        })}

        {terminal && (
          <>
            <span
              className={cn(
                "bg-destructive h-0.5 flex-1 rounded-full",
                sc.connMt
              )}
            />
            <div
              className={cn(
                "flex shrink-0 flex-col items-center gap-1.5 text-center",
                sc.col
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "bg-destructive text-destructive-foreground relative z-10 flex items-center justify-center rounded-full shadow-glow motion-safe:animate-pulse",
                      sc.circle
                    )}
                  >
                    <XIcon className={sc.icon} />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">
                    {TERMINAL_LABEL[terminal.state]}
                  </p>
                  <p className="text-background/70 text-[11px]">
                    {[
                      terminal.reason,
                      terminal.at ? formatStamp(terminal.at) : undefined,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Order ended"}
                  </p>
                </TooltipContent>
              </Tooltip>
              <span
                className={cn(
                  "text-destructive font-semibold leading-tight",
                  sc.label
                )}
              >
                {TERMINAL_LABEL[terminal.state]}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export { LabOrderStatus }
