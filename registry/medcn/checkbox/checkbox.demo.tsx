"use client"

import { Checkbox } from "@/registry/medcn/checkbox/checkbox"

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox defaultChecked /> I consent to sharing my records with my
        care team
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox /> Send me appointment reminders
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Checkbox disabled /> Enroll in trial (unavailable)
      </label>
    </div>
  )
}
