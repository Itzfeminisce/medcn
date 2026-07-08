"use client"

import * as React from "react"

import { BodyMapSelector } from "@/registry/medcn/body-map-selector/body-map-selector"

export default function BodyMapSelectorDemo() {
  const [regions, setRegions] = React.useState<string[]>(["chest", "l-arm"])

  return <BodyMapSelector value={regions} onValueChange={setRegions} />
}
