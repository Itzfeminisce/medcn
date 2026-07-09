"use client"

import { ActivityIcon, HeartPulseIcon } from "lucide-react"

import { Badge } from "@/registry/medcn/badge/badge"
import { TriageBoardBlock } from "@/registry/medcn/triage-board-block/triage-board-block"

export default function TriageBoardBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <TriageBoardBlock
        className="min-h-[560px]"
        headerActions={<Badge variant="destructive">2 breaching target</Badge>}
        roster={{
          title: "Waiting — by acuity",
          patients: [
            { name: "John Mensah", age: 54, sex: "M", level: 2, complaint: "Chest pain radiating to left arm", waitingMinutes: 12, targetMinutes: 10 },
            { name: "Grace Bello", age: 71, sex: "F", level: 2, complaint: "SOB, sats 91% on air", waitingMinutes: 8, targetMinutes: 10 },
            { name: "Sam Idris", age: 45, sex: "M", level: 3, complaint: "Abdominal pain", waitingMinutes: 52, targetMinutes: 60 },
            { name: "Ada Obi", age: 33, sex: "F", level: 4, complaint: "Ankle sprain", waitingMinutes: 88, targetMinutes: 120 },
          ],
        }}
        risk={{
          title: "Selected: J. Mensah",
          scores: [
            { label: "qSOFA", value: "2", band: "high", percent: 66, scale: "≥2 = high risk." },
            { label: "NEWS2", value: "7", band: "critical", percent: 100, scale: "≥7 → urgent response." },
          ],
        }}
        vitals={{
          title: "J. Mensah — vitals",
          vitals: [
            { label: "Blood pressure", icon: <ActivityIcon />, value: "98/62", unit: "mmHg", status: "low", time: "now" },
            { label: "Heart rate", icon: <HeartPulseIcon />, value: "118", unit: "bpm", status: "high", time: "now" },
          ],
        }}
      />
    </div>
  )
}
