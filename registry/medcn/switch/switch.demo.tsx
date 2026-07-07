import { Label } from "@/registry/medcn/label/label"
import { Switch } from "@/registry/medcn/switch/switch"

export default function SwitchDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Label htmlFor="reminders" className="justify-between font-normal">
        Medication reminders
        <Switch id="reminders" defaultChecked />
      </Label>
      <Label htmlFor="share" className="justify-between font-normal">
        Share records with care team
        <Switch id="share" />
      </Label>
    </div>
  )
}
