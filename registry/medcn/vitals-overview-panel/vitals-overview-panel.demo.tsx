import { ActivityIcon, HeartPulseIcon, ThermometerIcon } from "lucide-react"

import { Spo2Dial } from "@/registry/medcn/spo2-dial/spo2-dial"
import { VitalsOverviewPanel } from "@/registry/medcn/vitals-overview-panel/vitals-overview-panel"

export default function VitalsOverviewPanelDemo() {
  return (
    <VitalsOverviewPanel
      className="w-full max-w-xl"
      info="Latest recorded values from the bedside monitor."
      vitals={[
        {
          label: "Heart rate",
          icon: <HeartPulseIcon />,
          value: "72",
          unit: "bpm",
          status: "normal",
          trend: "down",
          trendLabel: "-3 vs last",
          trendDirection: "good",
          time: "08:04",
        },
        {
          label: "Blood pressure",
          icon: <ActivityIcon />,
          value: "138/89",
          unit: "mmHg",
          status: "elevated",
          trend: "up",
          trendLabel: "+6 vs last",
          trendDirection: "bad",
          time: "08:06",
        },
        {
          label: "Temperature",
          icon: <ThermometerIcon />,
          value: "36.8",
          unit: "°C",
          status: "normal",
          time: "08:04",
        },
      ]}
      extras={<Spo2Dial value={97} />}
    />
  )
}
