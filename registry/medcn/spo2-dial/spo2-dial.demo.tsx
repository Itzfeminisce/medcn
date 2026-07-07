import { Spo2Dial } from "@/registry/medcn/spo2-dial/spo2-dial"

export default function Spo2DialDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Spo2Dial value={98} />
      <Spo2Dial value={92} supplemental />
      <Spo2Dial value={86} supplemental />
      <Spo2Dial value={97} size="sm" />
    </div>
  )
}
