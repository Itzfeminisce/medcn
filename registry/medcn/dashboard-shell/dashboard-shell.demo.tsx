import {
  Activity,
  CalendarDays,
  LayoutDashboard,
  Pill,
  Search,
  Users,
} from "lucide-react"

import {
  DashboardGrid,
  DashboardGridItem,
} from "@/registry/medcn/dashboard-grid/dashboard-grid"
import { DashboardShell } from "@/registry/medcn/dashboard-shell/dashboard-shell"
import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Patients" },
  { icon: CalendarDays, label: "Schedule" },
  { icon: Pill, label: "Orders" },
]

export default function DashboardShellDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <DashboardShell
        className="min-h-[420px]"
        sidebar={
          <nav className="flex flex-col gap-1 p-3">
            <div className="px-2 py-3 text-sm font-semibold">Petals Clinic</div>
            {nav.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm " +
                  (active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent")
                }
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        }
        header={
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LayoutDashboard className="size-4 text-primary lg:hidden" />
              Today’s overview
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-sm text-muted-foreground">
              <Search className="size-4" /> Search patients
            </div>
          </div>
        }
      >
        <DashboardGrid>
          <DashboardGridItem span="twoThirds">
            <WidgetPanel icon={<Activity />} title="Census & vitals">
              <div className="h-28 rounded-lg bg-muted/50" />
            </WidgetPanel>
          </DashboardGridItem>
          <DashboardGridItem span="third">
            <WidgetPanel icon={<CalendarDays />} title="Today’s schedule">
              <div className="h-28 rounded-lg bg-muted/50" />
            </WidgetPanel>
          </DashboardGridItem>
        </DashboardGrid>
      </DashboardShell>
    </div>
  )
}
