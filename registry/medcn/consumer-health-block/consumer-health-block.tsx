"use client"

import * as React from "react"
import {
  Activity,
  CalendarDays,
  Heart,
  Inbox,
  Pill,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import {
  DashboardHeader,
  DashboardShell,
} from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { VitalsOverviewPanel } from "@/registry/medcn/vitals-overview-panel/vitals-overview-panel"
import { MedicationListPanel } from "@/registry/medcn/medication-list-panel/medication-list-panel"
import { AppointmentsPanel } from "@/registry/medcn/appointments-panel/appointments-panel"
import { CareGapsPanel } from "@/registry/medcn/care-gaps-panel/care-gaps-panel"
import { MessagesInboxPanel } from "@/registry/medcn/messages-inbox-panel/messages-inbox-panel"

const nav = [
  { icon: Heart, label: "Home", active: true },
  { icon: Activity, label: "My health" },
  { icon: Pill, label: "Medications" },
  { icon: CalendarDays, label: "Appointments" },
  { icon: Inbox, label: "Messages" },
]

export interface ConsumerHealthBlockProps {
  vitals: React.ComponentProps<typeof VitalsOverviewPanel>
  medications: React.ComponentProps<typeof MedicationListPanel>
  appointments: React.ComponentProps<typeof AppointmentsPanel>
  careGaps: React.ComponentProps<typeof CareGapsPanel>
  messages: React.ComponentProps<typeof MessagesInboxPanel>
  /** Greeting shown in the header. */
  greeting?: React.ReactNode
  brand?: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * Patient / Consumer Health Dashboard — a friendly patient-facing home:
 * upcoming appointments, open care gaps, my vitals, my medications + adherence,
 * and messages. DashboardShell + DashboardGrid of M2 panels.
 */
function ConsumerHealthBlock({
  vitals,
  medications,
  appointments,
  careGaps,
  messages,
  greeting = "Good morning",
  brand = "My Health",
  sidebar,
  header,
  className,
}: ConsumerHealthBlockProps) {
  return (
    <DashboardShell
      className={className}
      sidebar={
        sidebar ?? (
          <nav className="flex flex-col gap-1 p-3">
            <div className="px-2 py-3 text-sm font-semibold">{brand}</div>
            {nav.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        )
      }
      header={
        header ?? (
          <DashboardHeader icon={<Heart />} title={greeting} />
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="twoThirds">
          <AppointmentsPanel {...appointments} />
        </DashboardGridItem>
        <DashboardGridItem span="third">
          <CareGapsPanel {...careGaps} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <VitalsOverviewPanel {...vitals} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <MedicationListPanel {...medications} />
        </DashboardGridItem>
        <DashboardGridItem span="full">
          <MessagesInboxPanel {...messages} />
        </DashboardGridItem>
      </DashboardGrid>
    </DashboardShell>
  )
}

export { ConsumerHealthBlock }
