import { GlucoseBadge } from "@/registry/medcn/glucose-badge/glucose-badge"

export default function GlucoseBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <GlucoseBadge value={5.4} unit="mmol/L" context="fasting" />
      <GlucoseBadge value={3.5} unit="mmol/L" context="fasting" />
      <GlucoseBadge value={168} unit="mg/dL" context="post-meal" />
      <GlucoseBadge value={288} unit="mg/dL" context="random" size="sm" />
      <GlucoseBadge
        value={6.1}
        unit="mmol/L"
        context="bedtime"
        showCategoryLabel={false}
      />
    </div>
  )
}
