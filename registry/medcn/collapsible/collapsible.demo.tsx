"use client"

import * as React from "react"
import { ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"

export default function CollapsibleDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Care plan — hypertension</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle care plan">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <p className="text-muted-foreground text-xs">
        Home BP monitoring, twice daily
      </p>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="text-muted-foreground mt-2 flex flex-col gap-1 border-l-2 pl-3 text-xs leading-relaxed">
          <span>Reduce sodium intake to under 2 g/day.</span>
          <span>Review medication at next appointment (12 Aug).</span>
          <span>Report readings above 140/90 to the care team.</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
