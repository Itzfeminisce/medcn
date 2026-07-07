import { Button } from "@/registry/medcn/button/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Reading details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-semibold">Blood pressure — 128/82</p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          Taken seated after 5 minutes of rest, left arm, standard cuff.
          Average of two readings.
        </p>
      </PopoverContent>
    </Popover>
  )
}
