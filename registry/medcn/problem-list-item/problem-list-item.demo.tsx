import { MoreHorizontal } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { ProblemListItem } from "@/registry/medcn/problem-list-item/problem-list-item"

export default function ProblemListItemDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <ProblemListItem
        name="Type 2 diabetes mellitus"
        code="E11.9"
        status="active"
        severity="moderate"
        onset="Since 2019"
        lastReviewed="Reviewed 14 Jul"
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="Problem actions">
            <MoreHorizontal />
          </Button>
        }
      />
      <ProblemListItem
        name="Essential (primary) hypertension"
        code="I10"
        status="active"
        severity="mild"
        onset="Since 2021"
      />
      <ProblemListItem
        name="Community-acquired pneumonia"
        code="J18.9"
        status="resolved"
        onset="Mar 2024"
      />
    </div>
  )
}
