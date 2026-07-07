import { Input } from "@/registry/medcn/input/input"

export default function InputDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Input type="text" placeholder="Patient name" />
      <Input type="number" placeholder="Weight (kg)" defaultValue={72} />
      <Input type="email" placeholder="you@clinic.org" aria-invalid />
      <Input type="text" placeholder="Unavailable" disabled />
    </div>
  )
}
