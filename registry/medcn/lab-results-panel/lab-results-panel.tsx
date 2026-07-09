"use client"

import * as React from "react"
import { FlaskConical } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { SectionHeader } from "@/registry/medcn/section-header/section-header"
import { LabTrendRow } from "@/registry/medcn/lab-trend-panel/lab-trend-panel"
import { LabOrderStatus } from "@/registry/medcn/lab-order-status/lab-order-status"

export type LabResultEntry = React.ComponentProps<typeof LabTrendRow> & {
  id?: string
}

export interface LabResultsPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children" | "results"> {
  results: LabResultEntry[]
  /** Optional pending orders shown below the results. */
  pendingOrders?: (React.ComponentProps<typeof LabOrderStatus> & {
    id?: string
  })[]
}

/**
 * Recent labs with in-row trends plus any pending orders. Composes WidgetPanel
 * + LabTrendRow + LabOrderStatus.
 */
function LabResultsPanel({
  results,
  pendingOrders,
  title = "Laboratory",
  icon = <FlaskConical />,
  empty = "No recent results.",
  state,
  className,
  ...props
}: LabResultsPanelProps) {
  const effectiveState =
    state ??
    (results.length === 0 && !pendingOrders?.length ? "empty" : "ready")

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
        {results.length > 0 && (
          <div className="flex flex-col divide-y divide-border/50">
            {results.map(({ id, ...r }, i) => (
              <LabTrendRow key={id ?? i} {...r} />
            ))}
          </div>
        )}
        {pendingOrders && pendingOrders.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionHeader as="h3" title="Pending orders" className="gap-0" />
            {pendingOrders.map(({ id, ...o }, i) => (
              <LabOrderStatus key={id ?? i} {...o} />
            ))}
          </div>
        )}
      </div>
    </WidgetPanel>
  )
}

export { LabResultsPanel }
