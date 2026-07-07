import { Separator } from "@/registry/medcn/separator/separator"

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-sm font-semibold">Current medications</p>
      <p className="text-muted-foreground text-xs">3 active prescriptions</p>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Amoxicillin</span>
        <Separator orientation="vertical" />
        <span>Lisinopril</span>
        <Separator orientation="vertical" />
        <span>Metformin</span>
      </div>
    </div>
  )
}
