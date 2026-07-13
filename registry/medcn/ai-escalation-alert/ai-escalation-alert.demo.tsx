import { AiEscalationAlert } from "@/registry/medcn/ai-escalation-alert/ai-escalation-alert"
import { Button } from "@/registry/medcn/button/button"

export default function AiEscalationAlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <AiEscalationAlert
        title="Answer withheld — chest pain with red-flag features"
        action={<Button size="sm">Open the local chest-pain pathway</Button>}
      >
        The question described crushing chest pain radiating to the jaw. This
        assistant does not triage. Follow your local protocol.
      </AiEscalationAlert>

      <AiEscalationAlert
        severity="priority"
        title="Potassium 6.1 mmol/L in the attached result"
        action={
          <Button size="sm" variant="outline">
            Open the result
          </Button>
        }
      >
        Flagged by your lab-rules service, not by the assistant. Confirm the
        sample and act on the reading, not on this summary.
      </AiEscalationAlert>
    </div>
  )
}
