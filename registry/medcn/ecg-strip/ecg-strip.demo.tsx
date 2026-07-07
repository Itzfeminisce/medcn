import { EcgStrip } from "@/registry/medcn/ecg-strip/ecg-strip"

export default function EcgStripDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <EcgStrip rate={72} lead="II" />
      <EcgStrip rate={88} lead="V1" color="success" beats={5} />
    </div>
  )
}
