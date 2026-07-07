import { BloodPressureBadge } from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge"

export default function BloodPressureBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BloodPressureBadge systolic={114} diastolic={72} />
      <BloodPressureBadge systolic={132} diastolic={84} />
      <BloodPressureBadge systolic={186} diastolic={122} />
      <BloodPressureBadge systolic={148} diastolic={94} size="sm" />
      <BloodPressureBadge
        systolic={118}
        diastolic={76}
        showCategoryLabel={false}
      />
    </div>
  )
}
