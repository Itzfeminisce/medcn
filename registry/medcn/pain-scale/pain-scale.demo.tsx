"use client"

import * as React from "react"

import { PainScale } from "@/registry/medcn/pain-scale/pain-scale"

export default function PainScaleDemo() {
  const [value, setValue] = React.useState<number | null>(6)

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <PainScale value={value} onValueChange={setValue} showFaces />
      <PainScale value={2} readOnly />
    </div>
  )
}
