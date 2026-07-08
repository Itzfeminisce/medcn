"use client"

import * as React from "react"

import {
  EmergencyContactField,
  type EmergencyContactValue,
} from "@/registry/medcn/emergency-contact-field/emergency-contact-field"

export default function EmergencyContactFieldDemo() {
  const [contact, setContact] = React.useState<EmergencyContactValue>({
    name: "Jordan Rivera",
    relationship: "Spouse",
    phone: "+1 555 010 0134",
    isPrimary: true,
  })

  return <EmergencyContactField value={contact} onValueChange={setContact} />
}
