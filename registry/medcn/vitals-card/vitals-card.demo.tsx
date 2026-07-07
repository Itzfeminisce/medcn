import { ActivityIcon, HeartPulseIcon, ThermometerIcon } from "lucide-react"

import { VitalsCard } from "@/registry/medcn/vitals-card/vitals-card"

export default function VitalsCardDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <VitalsCard
        label="Heart rate"
        icon={<HeartPulseIcon />}
        value="72"
        unit="bpm"
        status="normal"
        trend="down"
        trendLabel="-3 vs last week"
        trendDirection="good"
        referenceRange="Normal: 60–100"
        time="Today, 8:04 AM"
      />
      <VitalsCard
        label="Blood pressure"
        icon={<ActivityIcon />}
        value="138/89"
        unit="mmHg"
        status="elevated"
        trend="up"
        trendLabel="+6 vs last visit"
        trendDirection="bad"
        referenceRange="Normal: 90–120 / 60–80"
        time="Today, 8:06 AM"
      />
      <VitalsCard
        label="Temperature"
        icon={<ThermometerIcon />}
        value="36.8"
        unit="°C"
        status="normal"
        time="Yesterday, 9:12 PM"
      />
    </div>
  )
}
