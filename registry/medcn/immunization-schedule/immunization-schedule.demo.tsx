import { ImmunizationSchedule } from "@/registry/medcn/immunization-schedule/immunization-schedule"

export default function ImmunizationScheduleDemo() {
  return (
    <ImmunizationSchedule
      groups={[
        {
          label: "Childhood (complete)",
          rows: [
            {
              vaccine: "MMR",
              doseNumber: 2,
              doseTotal: 2,
              dateGiven: "2019-05-14",
              status: "complete",
            },
            {
              vaccine: "DTaP/IPV/Hib",
              doseNumber: 4,
              doseTotal: 4,
              dateGiven: "2018-11-02",
              status: "complete",
            },
          ],
        },
        {
          label: "Adolescent",
          rows: [
            {
              vaccine: "HPV",
              doseLabel: "Dose 2",
              status: "due",
              nextDueDate: "2026-08-01",
            },
            {
              vaccine: "Td/IPV booster",
              status: "overdue",
              nextDueDate: "2026-05-10",
            },
          ],
        },
        {
          label: "Seasonal",
          rows: [
            {
              vaccine: "Influenza",
              doseLabel: "2026–27",
              status: "upcoming",
              nextDueDate: "2026-10-01",
            },
          ],
        },
      ]}
    />
  )
}
