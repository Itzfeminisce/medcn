import { AdherenceRing } from "@/registry/medcn/adherence-ring/adherence-ring"

const week = (pattern: number[]): { date: string; taken: number; scheduled: number; skipped?: number }[] =>
  pattern.map((taken, i) => ({
    date: `2026-07-0${i + 1}`,
    taken,
    scheduled: 2,
  }))

export default function AdherenceRingDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <AdherenceRing data={week([2, 2, 2, 2, 2, 2, 2])} windowLabel="7 days" />
      <AdherenceRing data={week([2, 1, 2, 0, 2, 1, 2])} windowLabel="7 days" />
      <AdherenceRing
        data={week([1, 0, 1, 0, 2, 1, 0])}
        windowLabel="7 days"
        size="sm"
      />
    </div>
  )
}
