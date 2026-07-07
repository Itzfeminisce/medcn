import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"
import {
  VaccinationRecordRow,
  type VaccinationRecordRowProps,
} from "@/registry/medcn/vaccination-record-row/vaccination-record-row"

type VaccStatus = NonNullable<VaccinationRecordRowProps["status"]>

export interface ImmunizationGroup {
  /** Section label, e.g. an age band or vaccine series. */
  label: React.ReactNode
  rows: VaccinationRecordRowProps[]
  /** Force the section open; defaults to open when it has due/overdue items. */
  defaultOpen?: boolean
}

const statusChip: Record<VaccStatus, string> = {
  complete: "bg-success/12 text-success",
  due: "bg-warning/15 text-warning-foreground dark:text-warning",
  overdue: "bg-destructive/12 text-destructive",
  upcoming: "bg-muted text-muted-foreground",
}

const statusWord: Record<VaccStatus, string> = {
  complete: "complete",
  due: "due",
  overdue: "overdue",
  upcoming: "upcoming",
}

function countStatuses(rows: VaccinationRecordRowProps[]): Record<VaccStatus, number> {
  const counts: Record<VaccStatus, number> = {
    complete: 0,
    due: 0,
    overdue: 0,
    upcoming: 0,
  }
  for (const row of rows) {
    if (row.status) counts[row.status]++
  }
  return counts
}

function StatusChip({ status, count }: { status: VaccStatus; count: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        statusChip[status]
      )}
    >
      {count} {statusWord[status]}
    </span>
  )
}

/** Order chips by urgency so the section header leads with what needs action. */
const CHIP_ORDER: VaccStatus[] = ["overdue", "due", "complete", "upcoming"]

export interface ImmunizationScheduleProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  groups: ImmunizationGroup[]
}

/**
 * VaccinationRecordRows grouped into collapsible sections (age band or vaccine
 * series), each header carrying its own due/overdue counts, with an overall
 * summary chip row on top. Group order follows the schedule the caller passes
 * in — the component imposes no schedule of its own.
 */
function ImmunizationSchedule({
  groups,
  className,
  ...props
}: ImmunizationScheduleProps) {
  const overall = countStatuses(groups.flatMap((g) => g.rows))
  const overallChips = CHIP_ORDER.filter((s) => overall[s] > 0)

  return (
    <div
      data-slot="immunization-schedule"
      className={cn("w-full max-w-md", className)}
      {...props}
    >
      {overallChips.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {overallChips.map((s) => (
            <StatusChip key={s} status={s} count={overall[s]} />
          ))}
        </div>
      )}

      <div className="divide-border/60 flex flex-col divide-y">
        {groups.map((group, gi) => {
          const counts = countStatuses(group.rows)
          const actionable = counts.overdue + counts.due > 0
          const headerChips = (["overdue", "due"] as VaccStatus[]).filter(
            (s) => counts[s] > 0
          )

          return (
            <Collapsible
              key={gi}
              defaultOpen={group.defaultOpen ?? actionable}
              className="py-1"
            >
              <CollapsibleTrigger className="group hover:bg-muted/50 focus-visible:ring-ring flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2">
                <span className="flex min-w-0 items-center gap-2">
                  <ChevronDownIcon
                    className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                  <span className="truncate text-sm font-semibold">
                    {group.label}
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {group.rows.length}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {headerChips.map((s) => (
                    <StatusChip key={s} status={s} count={counts[s]} />
                  ))}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="flex flex-col gap-2 px-2 pb-2 pt-2">
                  {group.rows.map((row, ri) => (
                    <VaccinationRecordRow key={ri} {...row} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}

export { ImmunizationSchedule }
