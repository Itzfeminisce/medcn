import { LabDeltaIndicator } from "@/registry/medcn/lab-delta-indicator/lab-delta-indicator"

export default function LabDeltaIndicatorDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* No threshold: a direction, not a verdict. */}
        <LabDeltaIndicator current={88} prior={85} unit="µmol/L" interval="28 days ago" />

        {/* With the assay's reference change value, the badge can say "significant". */}
        <LabDeltaIndicator
          current={152}
          prior={94}
          unit="µmol/L"
          interval="28 days ago"
          significantChange={20}
          concerningDirection="up"
        />

        <LabDeltaIndicator current={9.8} prior={12.4} unit="g/dL" interval="6 days ago" asPercent />
      </div>

      <p className="text-muted-foreground max-w-sm text-xs">
        A creatinine that moves 3 µmol/L has probably not moved at all. Without a
        significance threshold the badge reports the change and claims nothing.
      </p>
    </div>
  )
}
