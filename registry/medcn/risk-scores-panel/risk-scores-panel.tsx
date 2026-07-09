"use client"

import * as React from "react"
import { Gauge } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { RiskScoreGauge } from "@/registry/medcn/risk-score-gauge/risk-score-gauge"

export type RiskEntry = React.ComponentProps<typeof RiskScoreGauge> & {
  id?: string
}

export interface RiskScoresPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  scores: RiskEntry[]
  /** Extra content (e.g. a FallRiskIndicator) rendered after the gauges. */
  extras?: React.ReactNode
}

/**
 * A row of clinical risk gauges as a panel. Composes WidgetPanel +
 * RiskScoreGauge; drop a FallRiskIndicator or similar into `extras`.
 */
function RiskScoresPanel({
  scores,
  extras,
  title = "Risk scores",
  icon = <Gauge />,
  empty = "No risk scores calculated.",
  state,
  className,
  ...props
}: RiskScoresPanelProps) {
  const effectiveState =
    state ?? (scores.length === 0 && !extras ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <div className="@container/rpanel flex flex-col gap-3">
        {scores.length > 0 && (
          <div className="grid grid-cols-2 gap-3 @lg/rpanel:grid-cols-3">
            {scores.map(({ id, ...s }, i) => (
              <RiskScoreGauge key={id ?? i} {...s} />
            ))}
          </div>
        )}
        {extras && <div className="flex flex-wrap gap-3">{extras}</div>}
      </div>
    </WidgetPanel>
  )
}

export { RiskScoresPanel }
