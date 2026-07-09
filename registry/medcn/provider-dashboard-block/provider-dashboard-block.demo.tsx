"use client"

import { BellRing, CalendarCheck, ListTodo, Users } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { ProviderDashboardBlock } from "@/registry/medcn/provider-dashboard-block/provider-dashboard-block"

export default function ProviderDashboardBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <ProviderDashboardBlock
        className="min-h-[640px]"
        stats={[
          { label: "Patients today", value: 18, icon: <Users />, delta: { value: "+3", direction: "up", intent: "neutral" }, trend: [12, 14, 13, 16, 18] },
          { label: "Open tasks", value: 6, icon: <ListTodo />, delta: { value: "-2", direction: "down", intent: "good" } },
          { label: "Active alerts", value: 2, icon: <BellRing />, delta: { value: "+1", direction: "up", intent: "bad" } },
          { label: "Visits done", value: "92%", icon: <CalendarCheck />, delta: { value: "+4%", direction: "up", intent: "good" }, trend: [84, 86, 90, 92] },
        ]}
        roster={{
          title: "ED census",
          patients: [
            { name: "John Mensah", age: 54, sex: "M", level: 2, complaint: "Chest pain radiating to left arm", waitingMinutes: 12, targetMinutes: 10, actions: <Button size="sm">Assign</Button> },
            { name: "Grace Bello", age: 71, sex: "F", level: 3, complaint: "Shortness of breath, worsening", waitingMinutes: 40, targetMinutes: 60 },
            { name: "Ada Obi", age: 33, sex: "F", level: 4, complaint: "Ankle sprain", waitingMinutes: 68, targetMinutes: 120 },
          ],
        }}
        alerts={{
          items: [
            { id: "a1", severity: "critical", title: "Critical potassium 6.4", category: "Critical lab", time: "12:41", onDismiss: () => {}, onAcknowledge: () => {} },
            { id: "a2", severity: "warning", title: "Interaction: warfarin + ibuprofen", category: "Drug interaction", time: "11:03", onDismiss: () => {} },
          ],
        }}
        appointments={{
          title: "Today’s agenda",
          items: [
            { time: "09:00", duration: "30 min", patient: { name: "Ada Obi" }, type: "New patient", location: "Rm 4", status: "checked-in", actions: <Button size="sm">Start</Button> },
            { time: "09:30", duration: "15 min", patient: { name: "John Mensah" }, type: "Follow-up", telehealth: true, location: "Video", status: "scheduled" },
          ],
        }}
        tasks={{
          items: [
            { id: "t1", title: "Draw morning labs — CBC, BMP", detail: "Bed 4B · Ada Obi", priority: "stat", due: "Due 08:00", overdue: true, assignee: { name: "N. Yusuf" } },
            { id: "t2", title: "Sign discharge summary", detail: "Room 12", priority: "urgent", due: "14:30", assignee: { name: "Dr. Adeyemi" } },
          ],
        }}
        inbox={{
          items: [
            { id: "m1", sender: { name: "Lab · Chemistry" }, subject: "Critical result: Potassium 6.4", preview: "Ada Obi · collected 09:50", time: "09:58", unread: true, priority: "urgent", category: "Result", hasAttachment: true },
            { id: "m2", sender: { name: "Pharmacy" }, subject: "Refill request — metformin", preview: "Awaiting approval", time: "Yesterday", category: "Refill" },
          ],
        }}
      />
    </div>
  )
}
