"use client"

import { ActivityIcon, HeartPulseIcon } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { ConsumerHealthBlock } from "@/registry/medcn/consumer-health-block/consumer-health-block"

export default function ConsumerHealthBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <ConsumerHealthBlock
        className="min-h-[600px]"
        greeting="Good morning, Ada 👋"
        appointments={{
          title: "Upcoming",
          checkIn: {
            estimatedWait: "15–25 min",
            steps: [
              { label: "Checked in", status: "done", time: "9:02" },
              { label: "Vitals", status: "current", time: "~5 min" },
              { label: "With provider", status: "upcoming" },
            ],
          },
          items: [
            { time: "22 Jul", duration: "10:30", patient: { name: "Dr. Adeyemi" }, type: "Medication review", telehealth: true, location: "Video", status: "scheduled", actions: <Button size="sm">Join</Button> },
          ],
        }}
        careGaps={{
          items: [
            { name: "Flu vaccine", status: "due", due: "Due this month", action: <Button size="sm" variant="outline">Book</Button> },
            { name: "HbA1c test", status: "overdue", due: "9 days overdue" },
          ],
        }}
        vitals={{
          title: "My vitals",
          vitals: [
            { label: "Blood pressure", icon: <ActivityIcon />, value: "124/79", unit: "mmHg", status: "normal", time: "This morning" },
            { label: "Resting HR", icon: <HeartPulseIcon />, value: "68", unit: "bpm", status: "normal", time: "This morning" },
          ],
        }}
        medications={{
          title: "My medications",
          medications: [
            { drugName: "Lisinopril", strength: "10 mg", sig: "1 tablet each morning", quantity: "28 tablets", refillsRemaining: 3, prescriber: "Dr. Adeyemi", issuedDate: "2026-05-02", status: "active", actions: <Button size="sm" variant="outline">Refill</Button> },
          ],
          adherence: {
            data: [1, 1, 1, 0, 1, 1, 1].map((taken, i) => ({ date: `2026-07-0${i + 1}`, taken, scheduled: 1 })),
            windowLabel: "7 days",
          },
        }}
        messages={{
          title: "Messages",
          items: [
            { id: "m1", sender: { name: "Dr. Adeyemi" }, subject: "Your recent lab results", preview: "Everything looks good — let's review at your visit.", time: "2d", unread: true, category: "Result" },
          ],
        }}
      />
    </div>
  )
}
