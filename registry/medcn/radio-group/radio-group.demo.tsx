import { Label } from "@/registry/medcn/label/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/medcn/radio-group/radio-group"

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="never" className="w-full max-w-xs">
      {[
        { value: "never", label: "Never smoked" },
        { value: "former", label: "Former smoker" },
        { value: "current", label: "Current smoker" },
      ].map((opt) => (
        <Label
          key={opt.value}
          htmlFor={opt.value}
          className="font-normal"
        >
          <RadioGroupItem id={opt.value} value={opt.value} />
          {opt.label}
        </Label>
      ))}
    </RadioGroup>
  )
}
