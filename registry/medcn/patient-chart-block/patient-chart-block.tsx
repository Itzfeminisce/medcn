"use client"

import * as React from "react"
import {
  Activity,
  CalendarDays,
  FileText,
  FlaskConical,
  Pill,
  Printer,
  Share2,
  User,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import {
  DashboardHeader,
  DashboardShell,
} from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { PatientSummaryPanel } from "@/registry/medcn/patient-summary-panel/patient-summary-panel"
import { VitalsOverviewPanel } from "@/registry/medcn/vitals-overview-panel/vitals-overview-panel"
import { MedicationListPanel } from "@/registry/medcn/medication-list-panel/medication-list-panel"
import { ProblemListPanel } from "@/registry/medcn/problem-list-panel/problem-list-panel"
import { AllergyPanel } from "@/registry/medcn/allergy-panel/allergy-panel"
import { LabResultsPanel } from "@/registry/medcn/lab-results-panel/lab-results-panel"
import { EncounterTimelinePanel } from "@/registry/medcn/encounter-timeline-panel/encounter-timeline-panel"

const defaultNav = [
  { icon: User, label: "Summary", active: true },
  { icon: Activity, label: "Vitals" },
  { icon: Pill, label: "Medications" },
  { icon: FlaskConical, label: "Labs" },
  { icon: CalendarDays, label: "Encounters" },
  { icon: FileText, label: "Notes" },
]

function BlockNav({ brand }: { brand: React.ReactNode }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      <div className="px-2 py-3 text-sm font-semibold">{brand}</div>
      {defaultNav.map(({ icon: Icon, label, active }) => (
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

export interface PatientChartBlockProps {
  summary: React.ComponentProps<typeof PatientSummaryPanel>
  vitals: React.ComponentProps<typeof VitalsOverviewPanel>
  medications: React.ComponentProps<typeof MedicationListPanel>
  problems: React.ComponentProps<typeof ProblemListPanel>
  allergies: React.ComponentProps<typeof AllergyPanel>
  labs: React.ComponentProps<typeof LabResultsPanel>
  encounters: React.ComponentProps<typeof EncounterTimelinePanel>
  /** Sidebar brand label. */
  brand?: React.ReactNode
  /** Override the whole sidebar / header. */
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * Patient Chart / 360 Summary — a single-patient clinical face sheet. A
 * PatientSummaryPanel hero over the deep-dive sections (vitals, medications,
 * problems, allergies, labs, encounters), arranged in a DashboardShell +
 * DashboardGrid. Pass each panel its own props object.
 */
function PatientChartBlock({
  summary,
  vitals,
  medications,
  problems,
  allergies,
  labs,
  encounters,
  brand = "Petals Health",
  sidebar,
  header,
  className,
}: PatientChartBlockProps) {
  return (
    <DashboardShell
      className={className}
      sidebar={sidebar ?? <BlockNav brand={brand} />}
      header={
        header ?? (
          <DashboardHeader
            icon={<User />}
            title="Patient chart"
            actions={
              <>
                <Button size="sm" variant="outline">
                  <Printer /> Print
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 /> Share
                </Button>
              </>
            }
          />
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="full">
          <PatientSummaryPanel {...summary} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <VitalsOverviewPanel {...vitals} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <MedicationListPanel {...medications} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <ProblemListPanel {...problems} />
        </DashboardGridItem>
        <DashboardGridItem span="half">
          <LabResultsPanel {...labs} />
        </DashboardGridItem>
        <DashboardGridItem span="third">
          <AllergyPanel {...allergies} />
        </DashboardGridItem>
        <DashboardGridItem span="twoThirds">
          <EncounterTimelinePanel {...encounters} />
        </DashboardGridItem>
      </DashboardGrid>
    </DashboardShell>
  )
}

export { PatientChartBlock }
