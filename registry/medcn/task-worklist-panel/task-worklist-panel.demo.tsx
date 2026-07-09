"use client"

import * as React from "react"

import { Badge } from "@/registry/medcn/badge/badge"
import { TaskWorklistPanel } from "@/registry/medcn/task-worklist-panel/task-worklist-panel"

export default function TaskWorklistPanelDemo() {
  const [done, setDone] = React.useState<Record<string, boolean>>({ t3: true })
  const set = (id: string) => (v: boolean) =>
    setDone((d) => ({ ...d, [id]: v }))

  const openCount = ["t1", "t2", "t3", "t4"].filter((id) => !done[id]).length

  return (
    <TaskWorklistPanel
      className="w-full max-w-lg"
      action={<Badge variant="soft">{openCount} open</Badge>}
      items={[
        {
          id: "t1",
          title: "Draw morning labs — CBC, BMP",
          detail: "Bed 4B · Ada Obi",
          priority: "stat",
          due: "Due 08:00",
          overdue: true,
          assignee: { name: "N. Yusuf" },
          completed: !!done.t1,
          onCompletedChange: set("t1"),
        },
        {
          id: "t2",
          title: "Sign discharge summary",
          detail: "Room 12 · J. Mensah",
          priority: "urgent",
          due: "Due 14:30",
          assignee: { name: "Dr. Adeyemi" },
          completed: !!done.t2,
          onCompletedChange: set("t2"),
        },
        {
          id: "t3",
          title: "Record intake vitals",
          detail: "Triage",
          due: "09:15",
          assignee: { name: "K. Bello" },
          completed: !!done.t3,
          onCompletedChange: set("t3"),
        },
      ]}
    />
  )
}
