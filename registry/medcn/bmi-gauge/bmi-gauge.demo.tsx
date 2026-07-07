import { BmiGauge } from "@/registry/medcn/bmi-gauge/bmi-gauge"

export default function BmiGaugeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BmiGauge height={178} weight={72} />
      <BmiGauge height={165} weight={48} />
      <BmiGauge height={70} weight={205} units="imperial" />
      <BmiGauge bmi={37.4} size="sm" />
      <BmiGauge height={180} weight={88} showCategoryLabel={false} />
    </div>
  )
}
