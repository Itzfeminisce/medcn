import { Button } from "@/registry/medcn/button/button"
import { AppointmentRow } from "@/registry/medcn/appointment-row/appointment-row"

export default function AppointmentRowDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <AppointmentRow
        interactive
        time="09:00"
        duration="30 min"
        patient={{ name: "Ada Obi" }}
        type="New patient"
        location="Rm 4"
        status="checked-in"
        actions={<Button size="sm">Start visit</Button>}
      />
      <AppointmentRow
        interactive
        time="09:30"
        duration="15 min"
        patient={{ name: "John Mensah" }}
        type="Follow-up"
        telehealth
        location="Video"
        status="scheduled"
        actions={
          <Button size="sm" variant="outline">
            Check in
          </Button>
        }
      />
      <AppointmentRow
        interactive
        time="10:00"
        duration="30 min"
        patient={{ name: "Grace Bello" }}
        type="Annual physical"
        location="Rm 2"
        status="no-show"
      />
    </div>
  )
}
