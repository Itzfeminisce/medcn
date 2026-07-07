import { BloodTypeBadge } from "@/registry/medcn/blood-type-badge/blood-type-badge"

export default function BloodTypeBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BloodTypeBadge group="O" rh="-" />
      <BloodTypeBadge group="A" rh="+" />
      <BloodTypeBadge group="AB" rh="+" />
      <BloodTypeBadge group="B" rh="-" unverified />
      <BloodTypeBadge group="O" rh="+" showCompatibility={false} />
    </div>
  )
}
