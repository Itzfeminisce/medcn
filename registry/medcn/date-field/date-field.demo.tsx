"use client"

import * as React from "react"

import { DateField } from "@/registry/medcn/date-field/date-field"
import { Field } from "@/registry/medcn/field/field"

export default function DateFieldDemo() {
  const [iso, setIso] = React.useState<string | undefined>("1990-06-15")

  return (
    <div className="w-full max-w-xs">
      <Field
        label="Date of birth"
        description={
          iso ? `Parsed: ${iso}` : "Enter a complete, valid date."
        }
      >
        {() => <DateField value={iso} onValueChange={setIso} />}
      </Field>
    </div>
  )
}
