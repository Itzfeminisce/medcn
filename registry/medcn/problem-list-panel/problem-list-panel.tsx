"use client"

import * as React from "react"
import { ClipboardList } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { ProblemListItem } from "@/registry/medcn/problem-list-item/problem-list-item"

export type ProblemItem = React.ComponentProps<typeof ProblemListItem> & {
  id?: string
}

export interface ProblemListPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  items: ProblemItem[]
  /** Sort active problems before resolved/inactive. Defaults to true. */
  activeFirst?: boolean
}

/**
 * The patient's problem list as a panel: active problems first, resolved ones
 * de-emphasized below. Composes WidgetPanel + ProblemListItem and derives its
 * empty state from `items`.
 */
function ProblemListPanel({
  items,
  activeFirst = true,
  title = "Problem list",
  icon = <ClipboardList />,
  empty = "No problems recorded.",
  state,
  className,
  ...props
}: ProblemListPanelProps) {
  const rows = React.useMemo(() => {
    if (!activeFirst) return items
    const rank = (s?: string) => (s === undefined || s === "active" ? 0 : 1)
    return [...items].sort((a, b) => rank(a.status) - rank(b.status))
  }, [items, activeFirst])

  const effectiveState = state ?? (items.length === 0 ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <div className={cn("flex flex-col gap-2")}>
        {rows.map(({ id, ...item }, i) => (
          <ProblemListItem key={id ?? i} {...item} />
        ))}
      </div>
    </WidgetPanel>
  )
}

export { ProblemListPanel }
