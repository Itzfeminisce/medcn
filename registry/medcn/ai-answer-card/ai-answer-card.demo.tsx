import { AiAnswerCard } from "@/registry/medcn/ai-answer-card/ai-answer-card"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"

export default function AiAnswerCardDemo() {
  return (
    <AiAnswerCard
      className="w-full max-w-md"
      title="Encounter summary"
      metadata="Drafted 14:02 · from the 12 Mar note"
      confidence="0.78"
      limitations="Covers the 12 Mar encounter note only. Medications, allergies, and results were not read."
      evidence={
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-semibold">Sources</span>
          <Badge variant="outline" className="font-normal">
            Encounter note · 12 Mar
          </Badge>
          <Badge variant="outline" className="font-normal">
            Vitals · 12 Mar
          </Badge>
        </div>
      }
      actions={
        <>
          <Button size="sm">Insert into note</Button>
          <Button size="sm" variant="outline">
            Copy
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Discard
          </Button>
        </>
      }
    >
      Follow-up for hypertension. Reports improved exercise tolerance since the
      4 Feb dose increase, with no orthopnoea and no ankle swelling. BP 128/78,
      HR 72 and regular. Plan recorded as: continue current dose, review in
      three months.
    </AiAnswerCard>
  )
}
