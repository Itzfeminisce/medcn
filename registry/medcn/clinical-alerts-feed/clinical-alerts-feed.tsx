"use client"

import * as React from "react"
import { BellRing } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { ClinicalAlertItem } from "@/registry/medcn/clinical-alert-item/clinical-alert-item"

export type AlertEntry = React.ComponentProps<typeof ClinicalAlertItem> & {
  id?: string
}

const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 } as const

export interface ClinicalAlertsFeedProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  items: AlertEntry[]
  /** Sort critical → success. Defaults to true. */
  severityFirst?: boolean
}

/**
 * A feed of clinical alerts as a panel, most-severe first. Composes
 * WidgetPanel + ClinicalAlertItem; wire each item's onAcknowledge / onDismiss
 * to your own store.
 */
function ClinicalAlertsFeed({
  items,
  severityFirst = true,
  title = "Alerts",
  icon = <BellRing />,
  tone = "destructive",
  empty = "No active alerts.",
  state,
  className,
  ...props
}: ClinicalAlertsFeedProps) {
  const rows = React.useMemo(() => {
    if (!severityFirst) return items
    return [...items].sort(
      (a, b) =>
        severityOrder[a.severity ?? "info"] - severityOrder[b.severity ?? "info"]
    )
  }, [items, severityFirst])

  const effectiveState = state ?? (items.length === 0 ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      tone={tone}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <div className="flex flex-col gap-2">
        {rows.map(({ id, ...item }, i) => (
          <ClinicalAlertItem key={id ?? i} {...item} />
        ))}
      </div>
    </WidgetPanel>
  )
}

export { ClinicalAlertsFeed }
