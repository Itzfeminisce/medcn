"use client"

import * as React from "react"
import { Video } from "lucide-react"

import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import { DashboardShell } from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { TelehealthCallCard } from "@/registry/medcn/telehealth-call-card/telehealth-call-card"
import { PatientSummaryPanel } from "@/registry/medcn/patient-summary-panel/patient-summary-panel"
import { VitalsOverviewPanel } from "@/registry/medcn/vitals-overview-panel/vitals-overview-panel"
import { ClinicalNoteCard } from "@/registry/medcn/clinical-note-card/clinical-note-card"

export interface TelehealthConsoleBlockProps {
  call: React.ComponentProps<typeof TelehealthCallCard>
  summary: React.ComponentProps<typeof PatientSummaryPanel>
  vitals: React.ComponentProps<typeof VitalsOverviewPanel>
  note: React.ComponentProps<typeof ClinicalNoteCard>
  /** Header title (e.g. "Telehealth visit — Ada Obi"). */
  title?: React.ReactNode
  headerActions?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * Telehealth Visit Console — the live-visit workspace: the call card beside the
 * patient's vitals, with the summary chart and a visit note below for
 * documenting in-encounter. DashboardShell + DashboardGrid.
 */
function TelehealthConsoleBlock({
  call,
  summary,
  vitals,
  note,
  title = "Telehealth visit",
  headerActions,
  header,
  className,
}: TelehealthConsoleBlockProps) {
  return (
    <DashboardShell
      className={className}
      header={
        header ?? (
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Video className="size-4 text-primary" />
              {title}
            </div>
            {headerActions}
          </div>
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="twoThirds">
          <TelehealthCallCard {...call} className="w-full" />
        </DashboardGridItem>
        <DashboardGridItem span="third">
          <VitalsOverviewPanel {...vitals} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <PatientSummaryPanel {...summary} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <ClinicalNoteCard {...note} />
        </DashboardGridItem>
      </DashboardGrid>
    </DashboardShell>
  )
}

export { TelehealthConsoleBlock }
