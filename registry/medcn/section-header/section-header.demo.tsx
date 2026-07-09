import { ListFilter, Pill, Plus } from "lucide-react"

import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { SectionHeader } from "@/registry/medcn/section-header/section-header"

export default function SectionHeaderDemo() {
  return (
    <div className="w-full max-w-2xl">
      <SectionHeader
        icon={<Pill />}
        title="Active medications"
        description="Current prescriptions and adherence"
        badge={<Badge variant="soft">6</Badge>}
        info="Excludes discontinued and PRN-only medications."
        actions={
          <>
            <Button size="sm" variant="outline">
              <ListFilter /> Filter
            </Button>
            <Button size="sm">
              <Plus /> Add
            </Button>
          </>
        }
      />
    </div>
  )
}
