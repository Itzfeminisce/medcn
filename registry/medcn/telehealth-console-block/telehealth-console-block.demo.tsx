"use client"

import { ActivityIcon, HeartPulseIcon } from "lucide-react"

import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { TelehealthConsoleBlock } from "@/registry/medcn/telehealth-console-block/telehealth-console-block"

export default function TelehealthConsoleBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <TelehealthConsoleBlock
        className="min-h-[620px]"
        title="Telehealth visit — Ada Obi"
        headerActions={<Badge variant="success">Connected</Badge>}
        call={{
          clinicianName: "Dr Sarah Chen",
          specialty: "Cardiology",
          scheduledTime: "2026-07-09T14:30:00",
          timezone: "BST",
          joinEnabled: true,
          joinHref: "#join",
          camera: true,
          mic: true,
        }}
        vitals={{
          title: "Home vitals",
          vitals: [
            { label: "Blood pressure", icon: <ActivityIcon />, value: "132/85", unit: "mmHg", status: "elevated", time: "Today" },
            { label: "Heart rate", icon: <HeartPulseIcon />, value: "76", unit: "bpm", status: "normal", time: "Today" },
          ],
        }}
        summary={{
          patient: {
            name: "Ada Obi",
            dob: "1990-08-04",
            sex: "female",
            mrn: "PT-100238",
            allergies: [{ label: "Penicillin", severity: "severe", reaction: "Anaphylaxis" }],
          },
          problems: [
            { name: "Essential hypertension", code: "I10", status: "active", severity: "mild" },
          ],
        }}
        note={{
          noteType: "Visit note (telehealth)",
          author: { name: "Dr Sarah Chen", role: "Cardiology" },
          time: "In progress",
          status: "draft",
          actions: (
            <>
              <Button size="sm">Sign &amp; close</Button>
              <Button size="sm" variant="outline">
                Save draft
              </Button>
            </>
          ),
          children:
            "Reviewing home BP diary — readings trending down on current therapy. Reinforced adherence and low-salt diet. Continue lisinopril 10 mg; recheck in 4 weeks.",
        }}
      />
    </div>
  )
}
