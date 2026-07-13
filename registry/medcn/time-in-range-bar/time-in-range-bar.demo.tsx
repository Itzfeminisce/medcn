import { TimeInRangeBar } from "@/registry/medcn/time-in-range-bar/time-in-range-bar"

export default function TimeInRangeBarDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <TimeInRangeBar
        period="14 days"
        coverage="96% sensor wear"
        targetLabel="3.9–10.0 mmol/L"
        veryBelow={1}
        below={4}
        inRange={68}
        above={22}
        veryAbove={5}
      />

      {/* Same 68% in range — over four hours of wear, it means almost nothing. */}
      <TimeInRangeBar
        period="4 hours"
        coverage="18% sensor wear"
        targetLabel="3.9–10.0 mmol/L"
        below={5}
        inRange={68}
        above={27}
      />
    </div>
  )
}
