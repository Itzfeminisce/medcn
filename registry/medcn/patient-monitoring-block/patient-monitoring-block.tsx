"use client"

import * as React from "react"
import { ActivityIcon } from "lucide-react"

import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import {
  DashboardHeader,
  DashboardShell,
} from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { DataFreshnessStamp } from "@/registry/medcn/data-freshness-stamp/data-freshness-stamp"
import { EarlyWarningScore } from "@/registry/medcn/early-warning-score/early-warning-score"
import { MedicationTimeline } from "@/registry/medcn/medication-timeline/medication-timeline"
import { VitalsFlowsheet } from "@/registry/medcn/vitals-flowsheet/vitals-flowsheet"
import { VitalsTrendChart } from "@/registry/medcn/vitals-trend-chart/vitals-trend-chart"

export interface PatientMonitoringBlockProps {
  /** The record: what was measured, when, and what was not. */
  flowsheet: React.ComponentProps<typeof VitalsFlowsheet>
  /** The shape: the same observations, over time. */
  trends: React.ComponentProps<typeof VitalsTrendChart>
  /** The trajectory: an aggregate score the consumer's logic computed. */
  score: React.ComponentProps<typeof EarlyWarningScore>
  /** Optional: doses on the same time axis as the trends. */
  medications?: React.ComponentProps<typeof MedicationTimeline>
  /** How current the data is — and whether the source is still reporting. */
  freshness?: React.ComponentProps<typeof DataFreshnessStamp>
  title?: React.ReactNode
  headerActions?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * The deterioration surface: the grid holds the record, the chart holds the
 * shape, and the score holds the trajectory.
 *
 * All three are present because none of them is sufficient. A flowsheet shows
 * every value and no trend; a chart shows the trend and hides what was never
 * measured; an aggregate score compresses both into a number that a rising
 * patient can sit inside for hours. Read together, a gap in the grid, a slope in
 * the chart, and a climbing score are one story.
 *
 * The freshness stamp sits in the header rather than beside a panel, because it
 * qualifies everything below it: none of this is current if the monitor stopped
 * reporting at six.
 */
function PatientMonitoringBlock({
  flowsheet,
  trends,
  score,
  medications,
  freshness,
  title = "Patient monitoring",
  headerActions,
  header,
  className,
}: PatientMonitoringBlockProps) {
  return (
    <DashboardShell
      className={className}
      header={
        header ?? (
          <DashboardHeader
            icon={<ActivityIcon />}
            title={title}
            actions={
              <>
                {freshness && <DataFreshnessStamp {...freshness} />}
                {headerActions}
              </>
            }
          />
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="twoThirds">
          <VitalsFlowsheet {...flowsheet} className="max-h-80" />
        </DashboardGridItem>

        <DashboardGridItem>
          <EarlyWarningScore {...score} />
        </DashboardGridItem>

        <DashboardGridItem span="full">
          <VitalsTrendChart {...trends} />
        </DashboardGridItem>

        {medications && (
          <DashboardGridItem span="full">
            <MedicationTimeline {...medications} />
          </DashboardGridItem>
        )}
      </DashboardGrid>
    </DashboardShell>
  )
}

export { PatientMonitoringBlock }
