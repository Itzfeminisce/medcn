import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"

export default function FieldDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Field
        label="Systolic pressure"
        description="Measured at rest, seated, mmHg."
        required
      >
        <Input type="number" placeholder="120" />
      </Field>
      <Field
        label="Dose (mg)"
        error="Dose exceeds the maximum for this weight."
      >
        <Input type="number" defaultValue={950} />
      </Field>
    </div>
  )
}
