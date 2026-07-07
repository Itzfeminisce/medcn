"use client"

import * as React from "react"

import { FastingStatusBanner } from "@/registry/medcn/fasting-status-banner/fasting-status-banner"

export default function FastingStatusBannerDemo() {
  // Stable target relative to mount so the demo always shows a live countdown.
  const [procedureTime] = React.useState(
    () => new Date(Date.now() + 95 * 60_000)
  )

  return (
    <FastingStatusBanner
      procedureTime={procedureTime}
      procedureLabel="Colonoscopy"
      restrictions={[
        { kind: "food", label: "No solid food", window: "since 22:00" },
        {
          kind: "fluids",
          label: "Clear fluids only",
          window: "until 2h before",
        },
        {
          kind: "medications",
          label: "Morning insulin — check with team",
        },
      ]}
    />
  )
}
