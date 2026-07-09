"use client"

import * as React from "react"
import { Inbox } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { MessageInboxRow } from "@/registry/medcn/message-inbox-row/message-inbox-row"

export type MessageEntry = React.ComponentProps<typeof MessageInboxRow> & {
  id?: string
}

const priorityOrder = { urgent: 0, high: 1, normal: 2 } as const

export interface MessagesInboxPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  items: MessageEntry[]
  /** Sort unread + higher priority to the top. Defaults to true. */
  unreadFirst?: boolean
}

/**
 * A secure-message / results inbox as a panel. Composes WidgetPanel +
 * MessageInboxRow, floating unread and higher-priority messages up.
 */
function MessagesInboxPanel({
  items,
  unreadFirst = true,
  title = "Inbox",
  icon = <Inbox />,
  empty = "You’re all caught up.",
  state,
  className,
  ...props
}: MessagesInboxPanelProps) {
  const rows = React.useMemo(() => {
    if (!unreadFirst) return items
    return [...items].sort((a, b) => {
      const unread = Number(b.unread ?? false) - Number(a.unread ?? false)
      if (unread !== 0) return unread
      return (
        priorityOrder[a.priority ?? "normal"] -
        priorityOrder[b.priority ?? "normal"]
      )
    })
  }, [items, unreadFirst])

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
          <MessageInboxRow key={id ?? i} {...item} />
        ))}
      </div>
    </WidgetPanel>
  )
}

export { MessagesInboxPanel }
