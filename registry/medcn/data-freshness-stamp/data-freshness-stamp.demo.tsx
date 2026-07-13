import { DataFreshnessStamp } from "@/registry/medcn/data-freshness-stamp/data-freshness-stamp"

export default function DataFreshnessStampDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <DataFreshnessStamp age="4 min ago" datetime="2026-03-12T09:12:00" />
        <DataFreshnessStamp
          status="stale"
          age="6 h ago"
          datetime="2026-03-12T03:20:00"
          detail="Last vitals round 03:20. Next round was due at 07:00."
        />
        <DataFreshnessStamp
          status="disconnected"
          age="No data since 06:40"
          label="Monitor"
          detail="Bedside monitor stopped reporting at 06:40. A flat trend here means no readings — not stable readings."
        />
      </div>

      <p className="text-muted-foreground max-w-sm text-xs">
        A monitor that has gone silent looks exactly like a patient whose values
        have stopped changing. The third state says which one it is.
      </p>
    </div>
  )
}
