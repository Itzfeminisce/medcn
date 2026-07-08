"use client"

import * as React from "react"

import { RouteOfAdministrationField } from "@/registry/medcn/route-of-administration-field/route-of-administration-field"

export default function RouteOfAdministrationFieldDemo() {
  const [route, setRoute] = React.useState<string | undefined>("PO")

  return <RouteOfAdministrationField value={route} onValueChange={setRoute} />
}
