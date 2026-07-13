"use client"

import * as React from "react"
import { FlaskConicalIcon } from "lucide-react"

import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import {
  DashboardHeader,
  DashboardShell,
} from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { LabPanelTable } from "@/registry/medcn/lab-panel-table/lab-panel-table"
import {
  LabResultChart,
  type LabResultPoint,
} from "@/registry/medcn/lab-result-chart/lab-result-chart"
import { ChartInsufficientData } from "@/registry/medcn/chart-insufficient-data/chart-insufficient-data"

export interface AnalyteHistory {
  /** Must match a LabAnalyte key in `panels.groups`. */
  key: string
  analyte: string
  unit: string
  data: LabResultPoint[]
  range?: React.ComponentProps<typeof LabResultChart>["range"]
  significantChange?: number
}

export interface LabsReviewBlockProps {
  panels: React.ComponentProps<typeof LabPanelTable>
  /** History per analyte, keyed to the panel rows. */
  histories: AnalyteHistory[]
  /** The analyte shown on load. Defaults to the first history. */
  defaultAnalyte?: string
  /** Results below this count are listed, not trended. */
  minimumForTrend?: number
  title?: React.ReactNode
  headerActions?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

/**
 * The review loop a clinician actually performs: read the panel, pick the
 * result that moved, look at its history.
 *
 * Selection lives here rather than in the table, so the panel stays a record and
 * the chart stays a view of one analyte. Where an analyte has too few results to
 * trend, the block says so and lists them instead of drawing a confident line
 * through two points — the same refusal the round is built on.
 */
function LabsReviewBlock({
  panels,
  histories,
  defaultAnalyte,
  minimumForTrend = 3,
  title = "Laboratory review",
  headerActions,
  header,
  className,
}: LabsReviewBlockProps) {
  const [selected, setSelected] = React.useState(
    defaultAnalyte ?? histories[0]?.key
  )
  const history = histories.find((item) => item.key === selected)
  const measured =
    history?.data.filter((point) => point.value != null).length ?? 0

  return (
    <DashboardShell
      className={className}
      header={
        header ?? (
          <DashboardHeader
            icon={<FlaskConicalIcon />}
            title={title}
            actions={headerActions}
          />
        )
      }
    >
      <DashboardGrid>
        <DashboardGridItem span="half">
          <LabPanelTable {...panels} />
        </DashboardGridItem>

        <DashboardGridItem span="half">
          <div className="flex flex-col gap-3">
            <div
              role="group"
              aria-label="Analyte to trend"
              className="flex flex-wrap gap-1.5"
            >
              {histories.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={item.key === selected}
                  onClick={() => setSelected(item.key)}
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:border-transparent hover:bg-accent"
                >
                  {item.analyte}
                </button>
              ))}
            </div>

            {history && measured >= minimumForTrend ? (
              <LabResultChart
                analyte={history.analyte}
                data={history.data}
                unit={history.unit}
                range={history.range}
                significantChange={history.significantChange}
              />
            ) : history ? (
              <ChartInsufficientData count={measured} minimum={minimumForTrend}>
                <ul className="divide-border/60 divide-y">
                  {history.data.map((point) => (
                    <li
                      key={point.date}
                      className="flex justify-between px-2 py-1.5 text-sm"
                    >
                      <span className="text-muted-foreground">{point.date}</span>
                      <span className="font-mono tabular-nums">
                        {point.value ?? "—"} {history.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </ChartInsufficientData>
            ) : null}
          </div>
        </DashboardGridItem>
      </DashboardGrid>
    </DashboardShell>
  )
}

export { LabsReviewBlock }
