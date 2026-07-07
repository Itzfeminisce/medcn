import { Progress } from "@/registry/medcn/progress/progress"

export default function ProgressDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={66} />
      <Progress value={80} variant="success" size="sm" />
      <Progress value={45} variant="warning" />
      <Progress value={15} variant="destructive" size="lg" />
    </div>
  )
}
