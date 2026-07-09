"use client"

import * as React from "react"
import { Activity } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { VitalsCard } from "@/registry/medcn/vitals-card/vitals-card"

export type VitalEntry = React.ComponentProps<typeof VitalsCard> & {
  id?: string
}

export interface VitalsOverviewPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  vitals: VitalEntry[]
  /** Extra widgets (e.g. an Spo2Dial or BmiGauge) rendered beside the tiles. */
  extras?: React.ReactNode
}

/**
 * A vitals overview: a responsive grid of VitalsCard tiles plus an optional
 * slot for dial/gauge widgets. Composes WidgetPanel + VitalsCard.
 */
function VitalsOverviewPanel({
  vitals,
  extras,
  title = "Vitals",
  icon = <Activity />,
  empty = "No vitals recorded.",
  state,
  className,
  ...props
}: VitalsOverviewPanelProps) {
  const effectiveState =
    state ?? (vitals.length === 0 && !extras ? "empty" : "ready")

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
        {vitals.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vitals.map(({ id, ...v }, i) => (
              <VitalsCard key={id ?? i} {...v} className="w-full" />
            ))}
          </div>
        )}
        {extras && (
          <div className="flex flex-wrap items-center gap-6 border-t pt-4">
            {extras}
          </div>
        )}
      </div>
    </WidgetPanel>
  )
}

export { VitalsOverviewPanel }
