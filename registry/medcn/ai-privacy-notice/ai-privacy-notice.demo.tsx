import { AiPrivacyNotice } from "@/registry/medcn/ai-privacy-notice/ai-privacy-notice"
import { Button } from "@/registry/medcn/button/button"

export default function AiPrivacyNoticeDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <AiPrivacyNotice
        title="Before you send this prompt"
        facts={[
          {
            id: "use",
            kind: "use",
            label: "The prompt and the 2 attached documents are sent for processing.",
            detail:
              "The discharge summary (14 Mar) and the current medication list leave this device with your prompt. Nothing else from the record is included.",
          },
          {
            id: "identifiability",
            kind: "identifiability",
            label: "Identifiers are stripped before the request leaves the trust.",
            detail:
              "NHS number, name, and date of birth are removed by the gateway. Free text you type is not de-identified — do not paste identifiers into the prompt.",
          },
          {
            id: "external",
            kind: "external",
            label: "Processed by an external model provider in the EU.",
            detail:
              "Frankfurt region, under the trust's data processing agreement. The provider does not train on this data.",
          },
          {
            id: "retention",
            kind: "retention",
            label: "Prompts and responses are retained for 30 days.",
            detail:
              "Kept for audit and incident review, then deleted. Ask the information governance team to remove a prompt sooner.",
          },
        ]}
        detailHref="#"
        detailLabel="Trust privacy notice"
      />

      <div className="flex items-center gap-2">
        <Button size="sm">Send prompt</Button>
        <Button size="sm" variant="ghost" className="text-muted-foreground">
          Cancel
        </Button>
      </div>
    </div>
  )
}
