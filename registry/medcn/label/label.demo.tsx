import { Input } from "@/registry/medcn/input/input"
import { Label } from "@/registry/medcn/label/label"

export default function LabelDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="mrn">
        Medical record number
        <span aria-hidden className="text-destructive">
          *
        </span>
      </Label>
      <Input id="mrn" placeholder="MRN-000000" />
    </div>
  )
}
