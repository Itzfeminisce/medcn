import * as React from "react"
import { CheckIcon, UserRoundIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

export type CheckInStatus = "done" | "current" | "upcoming"

export interface CheckInStep {
  label: React.ReactNode
  status: CheckInStatus
  /** Optional time or time range, e.g. "~10–15 min". Shown as a range, not a promise. */
  time?: React.ReactNode
}

export interface AppointmentCheckInProps
  extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  steps: CheckInStep[]
  title?: React.ReactNode
  /** Estimated wait, shown as a range, e.g. "15–25 min". */
  estimatedWait?: React.ReactNode
  /** Reassurance line; the default states patients are called by name. */
  reassurance?: React.ReactNode
}

/**
 * Patient-facing arrival flow as a vertical stepper (checked in → forms →
 * vitals → ready → with provider), the current step highlighted. Shows only
 * this patient's data — never other patients' identifying info — and presents
 * times as ranges, not promises.
 */
function AppointmentCheckIn({
  steps,
  title = "Check-in",
  estimatedWait,
  reassurance = "You'll be called by name — no need to watch a screen.",
  className,
  ...props
}: AppointmentCheckInProps) {
  const currentLabel =
    steps.find((s) => s.status === "current")?.label ?? "your appointment"
  const summary = `${
    typeof title === "string" ? title : "Check-in"
  }. Current step: ${typeof currentLabel === "string" ? currentLabel : "in progress"}.${
    typeof estimatedWait === "string" ? ` Estimated wait ${estimatedWait}.` : ""
  }`

  return (
    <div
      data-slot="appointment-check-in"
      role="group"
      aria-label={summary}
      className={cn(
        "bg-card w-full max-w-sm rounded-2xl border border-border/60 p-5 shadow-soft",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        {estimatedWait && (
          <span className="flex flex-col items-end leading-tight">
            <span className="text-primary text-sm font-bold tabular-nums">
              {estimatedWait}
            </span>
            <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
              Est. wait
            </span>
          </span>
        )}
      </div>

      <ol className="flex flex-col">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          const done = step.status === "done"
          const current = step.status === "current"
          return (
            <li key={i} className="flex gap-3" data-status={step.status}>
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-colors",
                    done && "bg-primary text-primary-foreground",
                    current &&
                      "border-2 border-primary bg-primary/10 text-primary shadow-glow motion-safe:animate-pulse",
                    step.status === "upcoming" &&
                      "border border-dashed border-muted-foreground/30 text-muted-foreground/50"
                  )}
                >
                  {done ? <CheckIcon className="size-4" /> : i + 1}
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className={cn(
                      "my-1 w-0.5 flex-1 rounded-full",
                      done ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>
              <div className={cn("flex flex-1 items-baseline justify-between gap-2", isLast ? "pb-0" : "pb-4")}>
                <span
                  className={cn(
                    "text-sm",
                    current ? "text-foreground font-semibold" : done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {step.time && (
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {step.time}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {reassurance && (
        <p className="text-muted-foreground bg-muted/50 mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs">
          <UserRoundIcon className="size-4 shrink-0" aria-hidden />
          {reassurance}
        </p>
      )}
    </div>
  )
}

export { AppointmentCheckIn }
