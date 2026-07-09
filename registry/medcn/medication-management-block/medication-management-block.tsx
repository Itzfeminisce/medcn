"use client"

import * as React from "react"
import { CalendarClock, CheckSquare, Clock, Pill } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import { DashboardShell } from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { MedicationListPanel } from "@/registry/medcn/medication-list-panel/medication-list-panel"
import { AppointmentsPanel } from "@/registry/medcn/appointments-panel/appointments-panel"
import { DoseChecklist } from "@/registry/medcn/dose-checklist/dose-checklist"
import { MedicationTimingStrip } from "@/registry/medcn/medication-timing-strip/medication-timing-strip"

const nav = [
  { icon: Pill, label: "Medications", active: true },
  { icon: CheckSquare, label: "Today" },
  { icon: Clock, label: "Schedule" },
  { icon: CalendarClock, label: "Refills" },
]

export interface MedicationManagementBlockProps {
  medications: React.ComponentProps<typeof MedicationListPanel>
  /** Today's dose checklist (doses + onToggle). */
  doses: React.ComponentProps<typeof DoseChecklist>
  /** Per-medication timing strips. */
  schedule: (React.ComponentProps<typeof MedicationTimingStrip> & {
    id?: string
  })[]
  appointments: React.ComponentProps<typeof AppointmentsPanel>
  brand?: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * Medication Management — active meds with interactions and adherence, today's
 * dose checklist, per-drug dosing schedule, and related appointments.
 * DashboardShell + DashboardGrid composing the medication panels and atoms.
 */
function MedicationManagementBlock({
  medications,
  doses,
  schedule,
  appointments,
  brand = "Medications",
  sidebar,
  header,
  className,
}: MedicationManagementBlockProps) {
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
          <div className="px-4 py-3 text-sm font-medium md:px-6">
            Medication management
          </div>
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="twoThirds">
          <MedicationListPanel {...medications} />
        </DashboardGridItem>
        <DashboardGridItem span="third">
          <WidgetPanel icon={<CheckSquare />} title="Today’s doses" tone="success">
            <DoseChecklist {...doses} />
          </WidgetPanel>
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <WidgetPanel icon={<Clock />} title="Dosing schedule">
            <div className="flex flex-col gap-6">
              {schedule.map(({ id, ...s }, i) => (
                <MedicationTimingStrip key={id ?? i} {...s} />
              ))}
            </div>
          </WidgetPanel>
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <AppointmentsPanel {...appointments} />
        </DashboardGridItem>
      </DashboardGrid>
    </DashboardShell>
  )
}

export { MedicationManagementBlock }
