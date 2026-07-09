import { EncounterTimelinePanel } from "@/registry/medcn/encounter-timeline-panel/encounter-timeline-panel"

export default function EncounterTimelinePanelDemo() {
  return (
    <EncounterTimelinePanel
      className="w-full max-w-lg"
      info="Most recent encounters first."
      items={[
        {
          type: "office",
          title: "Hypertension follow-up — Dr. Adeyemi",
          meta: "Outpatient · Rm 4",
          date: "14 Jul",
          summary: "BP 128/82. Continue lisinopril 10 mg.",
        },
        {
          type: "lab",
          title: "Metabolic panel resulted",
          date: "9 Jul",
          summary: "HbA1c 6.1% · Lipid panel within range.",
        },
        {
          type: "ed",
          title: "Chest pain",
          meta: "Emergency · Dr. Okoro",
          date: "2 Jun",
          summary: "ACS ruled out. Discharged same day.",
        },
        {
          type: "immunization",
          title: "Influenza vaccine",
          date: "18 Oct 2025",
        },
      ]}
    />
  )
}
