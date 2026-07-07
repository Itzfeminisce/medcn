import { Badge } from "@/registry/medcn/badge/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Normal</Badge>
      <Badge variant="warning">Elevated</Badge>
      <Badge variant="destructive">Critical</Badge>
      <Badge variant="info">Low</Badge>
    </div>
  )
}
