import { Textarea } from "@/registry/medcn/textarea/textarea"

export default function TextareaDemo() {
  return (
    <div className="w-full max-w-sm">
      <Textarea
        placeholder="Clinical notes — history of presenting complaint, exam findings…"
        defaultValue="Patient reports 3 days of productive cough, no fever. Chest clear on auscultation."
        rows={4}
      />
    </div>
  )
}
