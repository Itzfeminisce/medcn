import { PregnancyWeekTracker } from "@/registry/medcn/pregnancy-week-tracker/pregnancy-week-tracker"

export default function PregnancyWeekTrackerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <PregnancyWeekTracker
        lmpDate="2026-01-01"
        asOf="2026-07-07"
        milestones={[
          { week: 12, label: "Dating scan" },
          { week: 20, label: "Anomaly scan" },
          { week: 28, label: "GTT / anti-D" },
        ]}
      />
      <PregnancyWeekTracker
        eddDate="2026-07-20"
        asOf="2026-07-07"
        milestones={[{ week: 36, label: "GBS swab" }]}
      />
    </div>
  )
}
