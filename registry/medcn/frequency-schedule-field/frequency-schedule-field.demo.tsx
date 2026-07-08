"use client"

import * as React from "react"

import {
  FrequencyScheduleField,
  type FrequencyScheduleValue,
} from "@/registry/medcn/frequency-schedule-field/frequency-schedule-field"

export default function FrequencyScheduleFieldDemo() {
  const [value, setValue] = React.useState<FrequencyScheduleValue>({
    frequency: "TDS",
    times: ["08:00", "14:00", "20:00"],
  })

  return <FrequencyScheduleField value={value} onValueChange={setValue} />
}
