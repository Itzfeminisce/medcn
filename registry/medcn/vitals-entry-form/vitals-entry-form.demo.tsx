"use client"

import { VitalsEntryForm } from "@/registry/medcn/vitals-entry-form/vitals-entry-form"

export default function VitalsEntryFormDemo() {
  return (
    <VitalsEntryForm
      defaultValue={{
        bp: { systolic: 128, diastolic: 82 },
        hr: 74,
        spo2: 97,
      }}
      onValueChange={(v) => console.log(v)}
    />
  )
}
