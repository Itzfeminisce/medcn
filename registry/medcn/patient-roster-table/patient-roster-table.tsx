"use client"

import * as React from "react"
import { Users } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { TriageQueueRow } from "@/registry/medcn/triage-queue-row/triage-queue-row"

export type RosterEntry = React.ComponentProps<typeof TriageQueueRow> & {
  id?: string
}

export interface PatientRosterTableProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  patients: RosterEntry[]
  /** Sort by acuity (triage level 1 first), then longest wait. Defaults to true. */
  byAcuity?: boolean
}

/**
 * A multi-patient census / queue as a panel — acuity-sorted rows of patients.
 * Composes WidgetPanel + TriageQueueRow.
 */
function PatientRosterTable({
  patients,
  byAcuity = true,
  title = "Patient roster",
  icon = <Users />,
  empty = "No patients in this list.",
  state,
  className,
  ...props
}: PatientRosterTableProps) {
  const rows = React.useMemo(() => {
    if (!byAcuity) return patients
    return [...patients].sort((a, b) => {
      const lvl = Number(a.level) - Number(b.level)
      if (lvl !== 0) return lvl
      return (b.waitingMinutes ?? 0) - (a.waitingMinutes ?? 0)
    })
  }, [patients, byAcuity])

  const effectiveState = state ?? (patients.length === 0 ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <div className="flex flex-col gap-2">
        {rows.map(({ id, ...p }, i) => (
          <TriageQueueRow key={id ?? i} {...p} />
        ))}
      </div>
    </WidgetPanel>
  )
}

export { PatientRosterTable }
