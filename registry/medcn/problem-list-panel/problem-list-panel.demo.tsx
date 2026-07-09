import { Plus } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { ProblemListPanel } from "@/registry/medcn/problem-list-panel/problem-list-panel"

export default function ProblemListPanelDemo() {
  return (
    <ProblemListPanel
      className="w-full max-w-lg"
      info="Active problems first; resolved problems remain for history."
      action={
        <Button size="sm" variant="ghost">
          <Plus /> Add
        </Button>
      }
      items={[
        {
          name: "Type 2 diabetes mellitus",
          code: "E11.9",
          status: "active",
          severity: "moderate",
          onset: "Since 2019",
        },
        {
          name: "Essential hypertension",
          code: "I10",
          status: "active",
          severity: "mild",
          onset: "Since 2021",
        },
        {
          name: "Community-acquired pneumonia",
          code: "J18.9",
          status: "resolved",
          onset: "Mar 2024",
        },
      ]}
    />
  )
}
