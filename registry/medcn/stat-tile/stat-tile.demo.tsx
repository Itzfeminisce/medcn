import { CalendarCheck, TriangleAlert, Users } from "lucide-react"

import { StatTile } from "@/registry/medcn/stat-tile/stat-tile"

export default function StatTileDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
      <StatTile
        interactive
        label="Patients today"
        value={18}
        icon={<Users />}
        info="Scheduled + walk-in encounters assigned to you today."
        delta={{
          value: "+3",
          direction: "up",
          intent: "neutral",
          tooltip: "3 more than the same weekday last week",
        }}
        caption="vs. yesterday"
        trend={[12, 14, 13, 16, 15, 18]}
      />
      <StatTile
        interactive
        label="Open care gaps"
        value={7}
        icon={<TriangleAlert />}
        delta={{
          value: "-2",
          direction: "down",
          intent: "good",
          tooltip: "2 gaps closed since Monday",
        }}
        caption="this week"
        trend={[12, 11, 10, 9, 9, 7]}
      />
      <StatTile
        interactive
        label="Visits completed"
        value="92"
        unit="%"
        icon={<CalendarCheck />}
        delta={{
          value: "+4%",
          direction: "up",
          intent: "good",
          tooltip: "Up from 88% last week",
        }}
        trend={[80, 84, 86, 85, 90, 92]}
      />
    </div>
  )
}
