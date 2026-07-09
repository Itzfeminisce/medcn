"use client"

import * as React from "react"
import { Activity } from "lucide-react"

import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import { DashboardShell } from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { PatientRosterTable } from "@/registry/medcn/patient-roster-table/patient-roster-table"
import { RiskScoresPanel } from "@/registry/medcn/risk-scores-panel/risk-scores-panel"
import { VitalsOverviewPanel } from "@/registry/medcn/vitals-overview-panel/vitals-overview-panel"

export interface TriageBoardBlockProps {
  roster: React.ComponentProps<typeof PatientRosterTable>
  risk: React.ComponentProps<typeof RiskScoresPanel>
  vitals: React.ComponentProps<typeof VitalsOverviewPanel>
  /** Board title. */
  title?: React.ReactNode
  /** Right side of the header, e.g. a live clock or department switch. */
  headerActions?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * Triage / ED Board — a full-width wallboard: the acuity-sorted roster leading,
 * a risk-scores panel for the selected patient, and a vitals overview. No
 * sidebar (meant for a shared display). DashboardShell + DashboardGrid.
 */
function TriageBoardBlock({
  roster,
  risk,
  vitals,
  title = "Emergency Department — Live Board",
  headerActions,
  header,
  className,
}: TriageBoardBlockProps) {
  return (
    <DashboardShell
      className={className}
      contained={false}
      header={
        header ?? (
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4 text-destructive" />
              {title}
            </div>
            {headerActions}
          </div>
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="twoThirds">
          <PatientRosterTable {...roster} />
        </DashboardGridItem>
        <DashboardGridItem span="third">
          <RiskScoresPanel {...risk} />
        </DashboardGridItem>
        <DashboardGridItem span="full">
          <VitalsOverviewPanel {...vitals} />
        </DashboardGridItem>
      </DashboardGrid>
    </DashboardShell>
  )
}

export { TriageBoardBlock }
