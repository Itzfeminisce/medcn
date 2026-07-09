import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { PatientRosterTable } from "@/registry/medcn/patient-roster-table/patient-roster-table"

export default function PatientRosterTableDemo() {
  return (
    <PatientRosterTable
      className="w-full max-w-2xl"
      title="ED census"
      action={<Badge variant="soft">6 waiting</Badge>}
      patients={[
        {
          name: "John Mensah",
          age: 54,
          sex: "M",
          level: 2,
          complaint: "Chest pain radiating to left arm",
          waitingMinutes: 12,
          targetMinutes: 10,
          actions: <Button size="sm">Assign</Button>,
        },
        {
          name: "Ada Obi",
          age: 33,
          sex: "F",
          level: 4,
          complaint: "Ankle sprain, able to weight-bear",
          waitingMinutes: 68,
          targetMinutes: 120,
        },
        {
          name: "Grace Bello",
          age: 71,
          sex: "F",
          level: 3,
          complaint: "Shortness of breath, worsening",
          waitingMinutes: 40,
          targetMinutes: 60,
        },
      ]}
    />
  )
}
