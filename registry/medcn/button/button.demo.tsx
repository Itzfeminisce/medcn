import { PlusIcon } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Book appointment</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Cancel visit</Button>
      <Button variant="link">Link</Button>
      <Button size="icon" aria-label="Add medication">
        <PlusIcon />
      </Button>
    </div>
  )
}
