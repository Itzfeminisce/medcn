import { TrendSparkline } from "@/registry/medcn/trend-sparkline/trend-sparkline"

const restingHr = [68, 71, 69, 72, 70, 74, 73, 76, 75, 78]
const glucose = [5.4, 5.8, 6.1, 5.9, 6.4, 6.8, 7.1, 6.9]
const weight = [82.4, 82.1, 81.8, 81.9, 81.5, 81.2, 80.9]

export default function TrendSparklineDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground w-36">Resting heart rate</span>
        <TrendSparkline data={restingHr} />
        <span className="font-semibold tabular-nums">78 bpm</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground w-36">Fasting glucose</span>
        <TrendSparkline
          data={glucose}
          thresholdMax={7.0}
          color="warning"
        />
        <span className="font-semibold tabular-nums">6.9 mmol/L</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground w-36">Weight</span>
        <TrendSparkline data={weight} color="success" />
        <span className="font-semibold tabular-nums">80.9 kg</span>
      </div>
    </div>
  )
}
