import { Activity, FlaskConical, Stethoscope, Syringe } from "lucide-react"

import { Timeline, TimelineItem } from "@/registry/medcn/timeline/timeline"

export default function TimelineDemo() {
  return (
    <div className="w-full max-w-md">
      <Timeline>
        <TimelineItem
          interactive
          color="primary"
          marker={<Stethoscope />}
          markerTooltip="Office visit"
          title="Office visit — Dr. Adeyemi"
          time="14 Jul"
        >
          Follow-up for hypertension. BP 128/82. Plan unchanged.
        </TimelineItem>
        <TimelineItem
          interactive
          color="success"
          marker={<FlaskConical />}
          markerTooltip="Laboratory"
          title="Lab results resulted"
          time="9 Jul"
        >
          HbA1c 6.1% · Lipid panel within range.
        </TimelineItem>
        <TimelineItem
          interactive
          color="warning"
          marker={<Activity />}
          markerTooltip="Acute / ED encounter"
          title="ED visit"
          time="2 Jun"
        >
          Chest pain, ruled out ACS. Discharged same day.
        </TimelineItem>
        <TimelineItem
          interactive
          marker={<Syringe />}
          markerTooltip="Immunization"
          title="Influenza vaccine"
          time="18 Oct 2025"
          last
        >
          Administered, left deltoid.
        </TimelineItem>
      </Timeline>
    </div>
  )
}
