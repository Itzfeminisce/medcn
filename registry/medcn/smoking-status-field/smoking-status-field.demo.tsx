"use client"

import * as React from "react"

import {
  SmokingStatusField,
  type SmokingStatusValue,
} from "@/registry/medcn/smoking-status-field/smoking-status-field"

export default function SmokingStatusFieldDemo() {
  const [value, setValue] = React.useState<SmokingStatusValue>({
    status: "current",
    cigsPerDay: 20,
    years: 15,
  })

  return <SmokingStatusField value={value} onValueChange={setValue} />
}
