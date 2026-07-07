"use client"

import * as React from "react"
import { ClockIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import { Progress } from "@/registry/medcn/progress/progress"

export interface DoseItem {
  id: string | number
  /** Medication name, e.g. "Metformin". */
  name: React.ReactNode
  /** e.g. "500 mg". */
  dose?: React.ReactNode
  /** Scheduled time, e.g. "8:00 AM". */
  time?: React.ReactNode
  taken?: boolean
}

export interface DoseChecklistProps
  extends Omit<React.ComponentProps<"div">, "title" | "onToggle"> {
  doses: DoseItem[]
  onToggle?: (dose: DoseItem, taken: boolean) => void
  title?: React.ReactNode
  /** Hide the "n of m taken" progress header. */
  hideProgress?: boolean
}

/** Day checklist of scheduled doses with a progress header. */
function DoseChecklist({
  doses,
  onToggle,
  title = "Today's doses",
  hideProgress = false,
  className,
  ...props
}: DoseChecklistProps) {
  const takenCount = doses.filter((d) => d.taken).length
  const headingId = React.useId()

  return (
    <div
      data-slot="dose-checklist"
      className={cn(
        "bg-card w-full max-w-sm rounded-2xl border border-border/60 p-5 shadow-soft",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span id={headingId} className="text-sm font-semibold">
            {title}
          </span>
          {!hideProgress && (
            <span
              data-slot="dose-checklist-count"
              className="text-muted-foreground text-xs"
            >
              {takenCount} of {doses.length} taken
            </span>
          )}
        </div>
        {!hideProgress && (
          <Progress
            value={doses.length ? (takenCount / doses.length) * 100 : 0}
            variant="success"
            size="sm"
          />
        )}
      </div>
      <ul aria-labelledby={headingId} className="flex flex-col gap-1">
        {doses.map((dose) => {
          const checkboxId = `${headingId}-${dose.id}`
          return (
            <li
              key={dose.id}
              data-slot="dose-checklist-item"
              data-taken={dose.taken ? "true" : "false"}
              className="hover:bg-accent/40 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
            >
              <Checkbox
                id={checkboxId}
                checked={!!dose.taken}
                onCheckedChange={(checked) =>
                  onToggle?.(dose, checked === true)
                }
              />
              <label
                htmlFor={checkboxId}
                className={cn(
                  "flex min-w-0 flex-1 cursor-pointer flex-col",
                  dose.taken && "opacity-60"
                )}
              >
                <span
                  className={cn(
                    "truncate text-sm font-medium",
                    dose.taken && "line-through"
                  )}
                >
                  {dose.name}
                  {dose.dose && (
                    <span className="text-muted-foreground ml-1.5 font-normal">
                      {dose.dose}
                    </span>
                  )}
                </span>
              </label>
              {dose.time && (
                <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                  <ClockIcon className="size-3.5" />
                  {dose.time}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { DoseChecklist }
