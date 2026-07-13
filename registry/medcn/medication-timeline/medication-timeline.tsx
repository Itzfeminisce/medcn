"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type DoseState = "given" | "scheduled" | "held" | "missed" | "refused"

export interface Dose {
  /** Must match one of `times` — this is what aligns the strip to a vitals axis. */
  time: string
  state: DoseState
  /** "5 mg IV", "Held — SBP 88" — the caller's words. */
  detail?: React.ReactNode
}

export interface MedicationRow {
  key: string
  /** "Furosemide 40 mg", "Metoprolol 12.5 mg BD". */
  label: string
  doses: Dose[]
}

export interface MedicationTimelineProps extends React.ComponentProps<"div"> {
  /** The shared time axis. Pass the same labels a vitals chart uses to align them. */
  times: string[]
  medications: MedicationRow[]
  caption: string
}

const DOSE_STATE: Record<
  DoseState,
  {
    label: string
    className: string
    /** A glyph, so the state survives greyscale — colour is never the only signal. */
    mark: string
  }
> = {
  given: {
    label: "Given",
    className: "bg-chart-2 text-background border-transparent",
    mark: "✓",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-transparent text-muted-foreground border-dashed",
    mark: "·",
  },
  held: {
    label: "Held",
    className: "bg-warning/20 text-warning-foreground border-warning/40",
    mark: "H",
  },
  missed: {
    label: "Missed",
    className: "bg-destructive/10 text-destructive border-destructive/40",
    mark: "✕",
  },
  refused: {
    label: "Refused",
    className: "bg-muted text-muted-foreground border-border",
    mark: "R",
  },
}

/**
 * Doses over time, on a time axis you can align with a vitals chart.
 *
 * Held, missed, and refused doses are rendered as prominently as given ones. A
 * strip that showed only what was administered would answer "what did we give?"
 * while hiding the question a clinician is usually asking — "why is she still
 * hypertensive?" — when the answer is that three doses were held for a soft
 * blood pressure.
 *
 * Alignment is not causation. Placing this above a vitals trend invites the eye
 * to connect a dose with a change; the component makes the timing visible and
 * makes no claim about the link.
 */
function MedicationTimeline({
  times,
  medications,
  caption,
  className,
  ...props
}: MedicationTimelineProps) {
  return (
    <div
      data-slot="medication-timeline"
      className={cn("w-full overflow-x-auto rounded-xl border", className)}
      {...props}
    >
      <table className="w-full border-separate border-spacing-0 text-sm">
        <caption className="text-muted-foreground px-3 py-2 text-left text-xs">
          {caption}
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="bg-background sticky left-0 z-10 border-b border-r px-3 py-2 text-left text-xs font-medium"
            >
              Medication
            </th>
            {times.map((time) => (
              <th
                key={time}
                scope="col"
                className="border-b px-2 py-2 text-center text-xs font-medium whitespace-nowrap"
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {medications.map((medication) => (
            <tr key={medication.key}>
              <th
                scope="row"
                className="bg-background sticky left-0 z-10 border-b border-r px-3 py-1.5 text-left font-medium whitespace-nowrap"
              >
                {medication.label}
              </th>

              {times.map((time) => {
                const dose = medication.doses.find((d) => d.time === time)

                if (!dose) {
                  return (
                    <td
                      key={time}
                      className="border-b px-2 py-1.5 text-center"
                      aria-label="No dose due"
                    >
                      <span aria-hidden className="text-muted-foreground/30">
                        —
                      </span>
                    </td>
                  )
                }

                const state = DOSE_STATE[dose.state]

                return (
                  <td key={time} className="border-b px-2 py-1.5 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          data-state={dose.state}
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-md border text-xs font-bold",
                            state.className
                          )}
                        >
                          <span aria-hidden>{state.mark}</span>
                          <span className="sr-only">
                            {state.label} at {time}
                          </span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="font-medium">{state.label}</span>
                        {dose.detail ? <> · {dose.detail}</> : null}
                      </TooltipContent>
                    </Tooltip>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap gap-2 px-3 py-2">
        {Object.entries(DOSE_STATE).map(([key, state]) => (
          <Badge key={key} variant="outline" className="gap-1 font-normal">
            <span aria-hidden className={cn("font-bold")}>
              {state.mark}
            </span>
            {state.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export { MedicationTimeline, DOSE_STATE as medicationDoseStates }
