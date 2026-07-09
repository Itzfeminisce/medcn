import { LabResultsPanel } from "@/registry/medcn/lab-results-panel/lab-results-panel"

export default function LabResultsPanelDemo() {
  return (
    <LabResultsPanel
      className="w-full max-w-lg"
      info="Most recent panel with 12-month trend."
      results={[
        {
          label: "HbA1c",
          value: 7.1,
          unit: "%",
          referenceMin: 4,
          referenceMax: 5.6,
          showRangeBar: true,
          history: [
            { value: 8.4, date: "2026-01-10" },
            { value: 7.9, date: "2026-03-12" },
            { value: 7.5, date: "2026-05-08" },
            { value: 7.1, date: "2026-07-05" },
          ],
        },
        {
          label: "eGFR",
          value: 58,
          unit: "mL/min",
          referenceMin: 60,
          referenceMax: 120,
          history: [
            { value: 72, date: "2026-01-10" },
            { value: 66, date: "2026-03-12" },
            { value: 58, date: "2026-07-05" },
          ],
        },
      ]}
      pendingOrders={[
        {
          current: "in-lab",
          times: {
            ordered: "2026-07-07T08:15:00",
            collected: "2026-07-07T09:40:00",
          },
        },
      ]}
    />
  )
}
