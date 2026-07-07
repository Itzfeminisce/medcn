import { AppointmentCheckIn } from "@/registry/medcn/appointment-check-in/appointment-check-in"

export default function AppointmentCheckInDemo() {
  return (
    <AppointmentCheckIn
      estimatedWait="15–25 min"
      steps={[
        { label: "Checked in", status: "done", time: "9:02" },
        { label: "Registration & forms", status: "done", time: "9:08" },
        { label: "Vitals", status: "current", time: "~5 min" },
        { label: "Ready for provider", status: "upcoming" },
        { label: "With provider", status: "upcoming" },
      ]}
    />
  )
}
