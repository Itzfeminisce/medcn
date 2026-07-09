"use client"

import * as React from "react"
import {
  BellRing,
  CalendarDays,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Search,
  Users,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import { DashboardShell } from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { StatTile } from "@/registry/medcn/stat-tile/stat-tile"
import { PatientRosterTable } from "@/registry/medcn/patient-roster-table/patient-roster-table"
import { AppointmentsPanel } from "@/registry/medcn/appointments-panel/appointments-panel"
import { TaskWorklistPanel } from "@/registry/medcn/task-worklist-panel/task-worklist-panel"
import { ClinicalAlertsFeed } from "@/registry/medcn/clinical-alerts-feed/clinical-alerts-feed"
import { MessagesInboxPanel } from "@/registry/medcn/messages-inbox-panel/messages-inbox-panel"

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Patients" },
  { icon: CalendarDays, label: "Schedule" },
  { icon: ListTodo, label: "Tasks" },
  { icon: Inbox, label: "Inbox" },
  { icon: BellRing, label: "Alerts" },
]

export interface ProviderDashboardBlockProps {
  roster: React.ComponentProps<typeof PatientRosterTable>
  appointments: React.ComponentProps<typeof AppointmentsPanel>
  tasks: React.ComponentProps<typeof TaskWorklistPanel>
  alerts: React.ComponentProps<typeof ClinicalAlertsFeed>
  inbox: React.ComponentProps<typeof MessagesInboxPanel>
  /** Optional KPI strip across the top. */
  stats?: (React.ComponentProps<typeof StatTile> & { id?: string })[]
  brand?: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * Provider / Clinician Dashboard — a multi-patient command center: an optional
 * KPI strip over the roster, today's agenda, task worklist, alerts feed, and
 * inbox. DashboardShell + DashboardGrid of M2 panels.
 */
function ProviderDashboardBlock({
  roster,
  appointments,
  tasks,
  alerts,
  inbox,
  stats,
  brand = "Petals Clinic",
  sidebar,
  header,
  className,
}: ProviderDashboardBlockProps) {
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
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="text-sm font-medium">Today’s overview</div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-sm text-muted-foreground">
              <Search className="size-4" /> Search patients
            </div>
          </div>
        )
      }
    >
      <div className="@container/pdash flex flex-col gap-4">
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 @3xl/pdash:grid-cols-4">
            {stats.map(({ id, ...s }, i) => (
              <StatTile key={id ?? i} {...s} />
            ))}
          </div>
        )}
        <DashboardGrid>
          <DashboardGridItem span="twoThirds">
            <PatientRosterTable {...roster} />
          </DashboardGridItem>
          <DashboardGridItem span="third">
            <ClinicalAlertsFeed {...alerts} />
          </DashboardGridItem>
          <DashboardGridItem span="half">
            <AppointmentsPanel {...appointments} />
          </DashboardGridItem>
          <DashboardGridItem span="half">
            <TaskWorklistPanel {...tasks} />
          </DashboardGridItem>
          <DashboardGridItem span="full">
            <MessagesInboxPanel {...inbox} />
          </DashboardGridItem>
        </DashboardGrid>
      </div>
    </DashboardShell>
  )
}

export { ProviderDashboardBlock }
