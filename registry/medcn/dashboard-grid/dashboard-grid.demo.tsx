import { Activity, CalendarDays, Pill, TriangleAlert } from "lucide-react"

import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"

export default function DashboardGridDemo() {
  return (
    <DashboardGrid className="w-full">
      <DashboardGridItem span="twoThirds">
        <WidgetPanel icon={<Activity />} title="Vitals overview">
          <div className="h-24 rounded-lg bg-muted/50" />
        </WidgetPanel>
      </DashboardGridItem>
      <DashboardGridItem span="third">
        <WidgetPanel icon={<TriangleAlert />} title="Alerts">
          <div className="h-24 rounded-lg bg-muted/50" />
        </WidgetPanel>
      </DashboardGridItem>
      <DashboardGridItem span="half">
        <WidgetPanel icon={<Pill />} title="Medications">
          <div className="h-20 rounded-lg bg-muted/50" />
        </WidgetPanel>
      </DashboardGridItem>
      <DashboardGridItem span="half">
        <WidgetPanel icon={<CalendarDays />} title="Appointments">
          <div className="h-20 rounded-lg bg-muted/50" />
        </WidgetPanel>
      </DashboardGridItem>
    </DashboardGrid>
  )
}
