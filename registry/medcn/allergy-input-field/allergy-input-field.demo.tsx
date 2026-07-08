"use client"

import * as React from "react"

import {
  AllergyInputField,
  type AllergyInputValue,
} from "@/registry/medcn/allergy-input-field/allergy-input-field"

export default function AllergyInputFieldDemo() {
  const [value, setValue] = React.useState<AllergyInputValue>({
    nka: false,
    allergies: [
      { label: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
      { label: "Peanuts", severity: "moderate", reaction: "Hives" },
    ],
  })

  return (
    <AllergyInputField
      value={value}
      onValueChange={setValue}
      suggestions={["Penicillin", "Aspirin", "Ibuprofen", "Latex", "Peanuts"]}
    />
  )
}
