"use client"

import * as React from "react"

import {
  GcsScoreInput,
  type GcsValue,
} from "@/registry/medcn/gcs-score-input/gcs-score-input"

export default function GcsScoreInputDemo() {
  const [value, setValue] = React.useState<GcsValue>({
    eye: 3,
    verbal: 4,
    motor: 5,
  })

  return <GcsScoreInput value={value} onValueChange={setValue} />
}
