"use client"

import * as React from "react"
import { ListTodo } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { ClinicalTaskRow } from "@/registry/medcn/clinical-task-row/clinical-task-row"

export type TaskEntry = React.ComponentProps<typeof ClinicalTaskRow> & {
  id?: string
}

const priorityOrder = { stat: 0, urgent: 1, routine: 2 } as const

export interface TaskWorklistPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  items: TaskEntry[]
  /** Sort by priority (STAT → routine), incomplete before complete. Default true. */
  prioritize?: boolean
}

/**
 * A task / order worklist as a panel. Composes WidgetPanel + ClinicalTaskRow,
 * sorting STAT/urgent and incomplete work to the top.
 */
function TaskWorklistPanel({
  items,
  prioritize = true,
  title = "Tasks",
  icon = <ListTodo />,
  empty = "No open tasks.",
  state,
  className,
  ...props
}: TaskWorklistPanelProps) {
  const rows = React.useMemo(() => {
    if (!prioritize) return items
    return [...items].sort((a, b) => {
      const done = Number(a.completed ?? false) - Number(b.completed ?? false)
      if (done !== 0) return done
      return (
        priorityOrder[a.priority ?? "routine"] -
        priorityOrder[b.priority ?? "routine"]
      )
    })
  }, [items, prioritize])

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
      <div className="flex flex-col gap-2">
        {rows.map(({ id, ...item }, i) => (
          <ClinicalTaskRow key={id ?? i} {...item} />
        ))}
      </div>
    </WidgetPanel>
  )
}

export { TaskWorklistPanel }
