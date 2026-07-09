"use client"

import * as React from "react"
import { Users } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { SectionHeader } from "@/registry/medcn/section-header/section-header"
import { CareTeamList } from "@/registry/medcn/care-team-list/care-team-list"
import { EmergencyContactCard } from "@/registry/medcn/emergency-contact-card/emergency-contact-card"

export interface CareTeamPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  members: React.ComponentProps<typeof CareTeamList>["members"]
  /** Collapse the team to N before a "+N more". */
  max?: number
  /** Emergency contacts shown below the care team. */
  emergencyContacts?: (React.ComponentProps<typeof EmergencyContactCard> & {
    id?: string
  })[]
}

/**
 * The care team plus emergency contacts as a panel. Composes WidgetPanel +
 * CareTeamList + EmergencyContactCard.
 */
function CareTeamPanel({
  members,
  max,
  emergencyContacts,
  title = "Care team",
  icon = <Users />,
  empty = "No care team assigned.",
  state,
  className,
  ...props
}: CareTeamPanelProps) {
  const effectiveState =
    state ??
    (members.length === 0 && !emergencyContacts?.length ? "empty" : "ready")

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
        {members.length > 0 && <CareTeamList members={members} max={max} />}
        {emergencyContacts && emergencyContacts.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionHeader as="h3" title="Emergency contacts" className="gap-0" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {emergencyContacts.map(({ id, ...c }, i) => (
                <EmergencyContactCard key={id ?? i} {...c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </WidgetPanel>
  )
}

export { CareTeamPanel }
