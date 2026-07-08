"use client"

import * as React from "react"

import {
  SignaturePad,
  type SignatureValue,
} from "@/registry/medcn/signature-pad/signature-pad"

export default function SignaturePadDemo() {
  const [sig, setSig] = React.useState<SignatureValue | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <SignaturePad onChange={setSig} />
      <p className="text-muted-foreground text-xs">
        {sig
          ? `Signed (${sig.mode}) at ${new Date(sig.signedAt).toLocaleTimeString()}`
          : "Not signed yet."}
      </p>
    </div>
  )
}
