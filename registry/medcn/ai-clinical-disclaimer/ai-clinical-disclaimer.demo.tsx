import { AiClinicalDisclaimer } from "@/registry/medcn/ai-clinical-disclaimer/ai-clinical-disclaimer"

export default function AiClinicalDisclaimerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {/* Names what to check, and against what. */}
      <AiClinicalDisclaimer>
        Summarised from the 12 Mar encounter note only. Check the medication list
        against the chart before you document.
      </AiClinicalDisclaimer>

      <AiClinicalDisclaimer severity="warning" label="Not decision support">
        Dose figures here are drawn from the note text, not from a validated
        dosing service. Verify every dose before prescribing.
      </AiClinicalDisclaimer>
    </div>
  )
}
