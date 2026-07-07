import { TriageLevelIndicator } from "@/registry/medcn/triage-level-indicator/triage-level-indicator"

export default function TriageLevelIndicatorDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <TriageLevelIndicator level={1} />
      <TriageLevelIndicator level={2} showLevel />
      <TriageLevelIndicator level={3} size="lg" />
      <TriageLevelIndicator level={4} size="sm" />
      <TriageLevelIndicator level={5} label="Routine review" />
    </div>
  )
}
