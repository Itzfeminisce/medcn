import { MedicationTimingStrip } from "@/registry/medcn/medication-timing-strip/medication-timing-strip"

export default function MedicationTimingStripDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <MedicationTimingStrip
        medication="Metformin 500 mg"
        doses={[
          { time: "08:00", status: "taken", label: "With breakfast" },
          { time: "13:00", status: "taken" },
          { time: "18:00", status: "due" },
          { time: "22:00", status: "due" },
        ]}
      />
      <MedicationTimingStrip
        medication="Prednisolone 5 mg"
        doses={[
          { time: "07:00", status: "taken" },
          { time: "12:00", status: "missed" },
          { time: "19:00", status: "skipped", label: "Nausea" },
        ]}
      />
    </div>
  )
}
