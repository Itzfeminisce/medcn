"use client"

import * as React from "react"

import { DateOfBirthField } from "@/registry/medcn/date-of-birth-field/date-of-birth-field"

export default function DateOfBirthFieldDemo() {
  const [dob, setDob] = React.useState<string | undefined>("2009-05-20")

  return <DateOfBirthField value={dob} onValueChange={setDob} minAge={18} />
}
