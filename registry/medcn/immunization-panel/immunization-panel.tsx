"use client"

import * as React from "react"
import { Syringe } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { SectionHeader } from "@/registry/medcn/section-header/section-header"
import { ImmunizationSchedule } from "@/registry/medcn/immunization-schedule/immunization-schedule"
import { VaccinationRecordRow } from "@/registry/medcn/vaccination-record-row/vaccination-record-row"

export interface ImmunizationPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  groups: React.ComponentProps<typeof ImmunizationSchedule>["groups"]
  /** Recently administered doses shown below the schedule. */
  recent?: (React.ComponentProps<typeof VaccinationRecordRow> & {
    id?: string
  })[]
}

/**
 * Immunization status by schedule group, with an optional recently-administered
 * list. Composes WidgetPanel + ImmunizationSchedule + VaccinationRecordRow.
 */
function ImmunizationPanel({
  groups,
  recent,
  title = "Immunizations",
  icon = <Syringe />,
  empty = "No immunization records.",
  state,
  className,
  ...props
}: ImmunizationPanelProps) {
  const effectiveState =
    state ?? (groups.length === 0 && !recent?.length ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <div className="flex flex-col gap-4">
        {groups.length > 0 && <ImmunizationSchedule groups={groups} />}
        {recent && recent.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionHeader as="h3" title="Recently administered" className="gap-0" />
            {recent.map(({ id, ...r }, i) => (
              <VaccinationRecordRow key={id ?? i} {...r} />
            ))}
          </div>
        )}
      </div>
    </WidgetPanel>
  )
}

export { ImmunizationPanel }
