import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export default function TooltipDemo() {
  return (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Reference range: 4.0–5.6%</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="About this reading">
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">Fasting glucose</p>
          <p className="text-background/70 text-[11px]">
            Measured after an 8-hour fast
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
