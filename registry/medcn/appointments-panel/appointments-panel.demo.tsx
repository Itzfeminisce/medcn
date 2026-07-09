import { Button } from "@/registry/medcn/button/button"
import { AppointmentsPanel } from "@/registry/medcn/appointments-panel/appointments-panel"

export default function AppointmentsPanelDemo() {
  return (
    <AppointmentsPanel
      className="w-full max-w-xl"
      title="Today’s agenda"
      info="Times shown in clinic local time."
      items={[
        {
          time: "09:00",
          duration: "30 min",
          patient: { name: "Ada Obi" },
          type: "New patient",
          location: "Rm 4",
          status: "checked-in",
          actions: <Button size="sm">Start</Button>,
        },
        {
          time: "09:30",
          duration: "15 min",
          patient: { name: "John Mensah" },
          type: "Follow-up",
          telehealth: true,
          location: "Video",
          status: "scheduled",
          actions: (
            <Button size="sm" variant="outline">
              Check in
            </Button>
          ),
        },
        {
          time: "10:00",
          duration: "30 min",
          patient: { name: "Grace Bello" },
          type: "Annual physical",
          location: "Rm 2",
          status: "no-show",
        },
      ]}
    />
  )
}
