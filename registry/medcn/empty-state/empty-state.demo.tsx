import { CalendarPlus, Inbox } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { EmptyState } from "@/registry/medcn/empty-state/empty-state"

export default function EmptyStateDemo() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card">
      <EmptyState
        icon={<Inbox />}
        title="No upcoming appointments"
        description="This patient has no scheduled visits. Book one to start their care plan."
        action={
          <Button size="sm">
            <CalendarPlus /> Schedule visit
          </Button>
        }
      />
    </div>
  )
}
