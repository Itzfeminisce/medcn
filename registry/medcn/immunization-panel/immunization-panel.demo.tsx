import { ImmunizationPanel } from "@/registry/medcn/immunization-panel/immunization-panel"

export default function ImmunizationPanelDemo() {
  return (
    <ImmunizationPanel
      className="w-full max-w-lg"
      info="Due and overdue vaccines are flagged."
      groups={[
        {
          label: "Adolescent",
          rows: [
            { vaccine: "HPV", doseLabel: "Dose 2", status: "due", nextDueDate: "2026-08-01" },
            { vaccine: "Td/IPV booster", status: "overdue", nextDueDate: "2026-05-10" },
          ],
        },
        {
          label: "Seasonal",
          rows: [
            { vaccine: "Influenza", doseLabel: "2026–27", status: "upcoming", nextDueDate: "2026-10-01" },
          ],
        },
      ]}
      recent={[
        {
          vaccine: "Tdap",
          doseLabel: "Booster",
          status: "complete",
          dateGiven: "2024-11-02",
          lotNumber: "UJ349AA",
          provider: "Riverside Clinic",
        },
      ]}
    />
  )
}
