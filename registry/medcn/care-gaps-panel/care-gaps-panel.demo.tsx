import { Button } from "@/registry/medcn/button/button"
import { CareGapsPanel } from "@/registry/medcn/care-gaps-panel/care-gaps-panel"

export default function CareGapsPanelDemo() {
  return (
    <CareGapsPanel
      className="w-full max-w-lg"
      info="Gaps are ordered overdue → up to date."
      items={[
        {
          name: "Colorectal cancer screening",
          measure: "USPSTF Grade A · ages 45–75",
          status: "due",
          due: "Due this month",
          action: (
            <Button size="sm" variant="outline">
              Schedule
            </Button>
          ),
        },
        {
          name: "HbA1c test",
          measure: "HEDIS · Comprehensive Diabetes Care",
          status: "overdue",
          due: "Due 30 Jun · 9 days overdue",
          action: <Button size="sm">Order</Button>,
        },
        { name: "Influenza vaccine", status: "scheduled", due: "Booked 22 Jul" },
        { name: "Blood pressure check", status: "satisfied", due: "Done 14 Jul" },
      ]}
    />
  )
}
