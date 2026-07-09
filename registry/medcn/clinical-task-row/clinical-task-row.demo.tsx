"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { ClinicalTaskRow } from "@/registry/medcn/clinical-task-row/clinical-task-row"

export default function ClinicalTaskRowDemo() {
  const [done, setDone] = React.useState<Record<string, boolean>>({ vitals: true })

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <ClinicalTaskRow
        title="Draw morning labs — CBC, BMP"
        detail="Bed 4B · Ada Obi"
        priority="stat"
        due="Due 08:00"
        overdue
        assignee={{ name: "N. Yusuf" }}
        completed={!!done.labs}
        onCompletedChange={(v) => setDone((d) => ({ ...d, labs: v }))}
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="Task actions">
            <MoreHorizontal />
          </Button>
        }
      />
      <ClinicalTaskRow
        title="Sign discharge summary"
        detail="Room 12 · J. Mensah"
        priority="urgent"
        due="Due 14:30"
        assignee={{ name: "Dr. Adeyemi" }}
        completed={!!done.discharge}
        onCompletedChange={(v) => setDone((d) => ({ ...d, discharge: v }))}
      />
      <ClinicalTaskRow
        title="Record intake vitals"
        detail="Triage"
        due="09:15"
        assignee={{ name: "K. Bello" }}
        completed={!!done.vitals}
        onCompletedChange={(v) => setDone((d) => ({ ...d, vitals: v }))}
      />
    </div>
  )
}
