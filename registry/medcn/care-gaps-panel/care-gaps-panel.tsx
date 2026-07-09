"use client"

import * as React from "react"
import { ClipboardCheck } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { CareGapItem } from "@/registry/medcn/care-gap-item/care-gap-item"

export type CareGapEntry = React.ComponentProps<typeof CareGapItem> & {
  id?: string
}

const order = { overdue: 0, due: 1, scheduled: 2, satisfied: 3 } as const

export interface CareGapsPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  items: CareGapEntry[]
  /** Sort overdue → satisfied. Defaults to true. */
  urgentFirst?: boolean
}

/**
 * Open care gaps as a panel, overdue-first so the most actionable items lead.
 * Composes WidgetPanel + CareGapItem.
 */
function CareGapsPanel({
  items,
  urgentFirst = true,
  title = "Care gaps",
  icon = <ClipboardCheck />,
  tone = "warning",
  empty = "All care gaps up to date.",
  state,
  className,
  ...props
}: CareGapsPanelProps) {
  const rows = React.useMemo(() => {
    if (!urgentFirst) return items
    return [...items].sort(
      (a, b) => order[a.status ?? "due"] - order[b.status ?? "due"]
    )
  }, [items, urgentFirst])

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
          <CareGapItem key={id ?? i} {...item} />
        ))}
      </div>
    </WidgetPanel>
  )
}

export { CareGapsPanel }
