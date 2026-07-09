import { Activity, ChevronRight } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"

export default function WidgetPanelDemo() {
  return (
    <WidgetPanel
      className="w-full max-w-sm"
      icon={<Activity />}
      tone="primary"
      accent
      title="Recent vitals"
      description="Last recorded 2h ago"
      info="Streamed from the bedside monitor; values older than 4h are dimmed."
      action={
        <Button size="sm" variant="ghost">
          View all <ChevronRight />
        </Button>
      }
      footer={<span>Updated from bedside monitor</span>}
    >
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <span className="text-muted-foreground">Blood pressure</span>
          <span className="font-medium tabular-nums">128/82 mmHg</span>
        </li>
        <li className="flex justify-between">
          <span className="text-muted-foreground">Heart rate</span>
          <span className="font-medium tabular-nums">74 bpm</span>
        </li>
        <li className="flex justify-between">
          <span className="text-muted-foreground">SpO₂</span>
          <span className="font-medium tabular-nums">98%</span>
        </li>
      </ul>
    </WidgetPanel>
  )
}
