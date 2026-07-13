import {
  AiMedicationCheck,
  type AiMedicationFinding,
} from "@/registry/medcn/ai-medication-check/ai-medication-check"
import { AiCitation } from "@/registry/medcn/ai-citation/ai-citation"
import { AiEvidencePanel } from "@/registry/medcn/ai-evidence-panel/ai-evidence-panel"
import { Button } from "@/registry/medcn/button/button"

const findings: AiMedicationFinding[] = [
  {
    id: "warfarin-ibuprofen",
    title: "Warfarin + Ibuprofen",
    severity: "major",
    medications: ["Warfarin 5 mg PO OD", "Ibuprofen 400 mg PO TDS"],
    description:
      "The source reports an increased risk of gastrointestinal bleeding, and a possible increase in INR, when an NSAID is added to warfarin.",
    recommendation:
      "whether an alternative analgesic is appropriate; if the NSAID is continued, whether INR monitoring and gastroprotection are needed.",
    documentation: "Established",
    evidence: (
      <AiEvidencePanel
        title="Source record"
        retrievedAt="12 Mar, 09:41"
        limitations="The monograph describes the interaction class. It does not account for this patient's INR, bleeding history, or renal function."
      >
        <AiCitation
          index={1}
          title="Warfarin–NSAID monograph"
          publisher="First Databank"
          date="v4.2 · 12 Mar"
          locator="Interaction ID 4416 · Severity: Major"
          excerpt="Concurrent use may increase the risk of bleeding. Monitor for signs of bleeding and consider INR monitoring."
        />
        <AiCitation
          index={2}
          title="Medication list · 12 Mar"
          publisher="Patient record"
          date="12 Mar, 09:38"
          locator="Active medications"
        />
      </AiEvidencePanel>
    ),
  },
  {
    id: "warfarin-amoxicillin",
    title: "Warfarin + Amoxicillin",
    severity: "moderate",
    medications: ["Warfarin 5 mg PO OD", "Amoxicillin 500 mg PO TDS"],
    description:
      "The source reports that some patients show an increased anticoagulant effect during courses of broad-spectrum antibiotics.",
    recommendation: "whether an INR check is warranted during the course.",
    documentation: "Probable",
  },
]

export default function AiMedicationCheckDemo() {
  return (
    <AiMedicationCheck
      className="w-full max-w-lg"
      title="Medication review — proposed analgesia"
      source={{
        name: "First Databank",
        version: "v4.2",
        retrievedAt: "12 Mar, 09:41",
      }}
      screened={[
        "Warfarin 5 mg PO OD",
        "Amoxicillin 500 mg PO TDS",
        "Ibuprofen 400 mg PO TDS (proposed)",
      ]}
      findings={findings}
      actions={
        <>
          <Button size="sm">Review findings</Button>
          <Button size="sm" variant="outline">
            Open medication list
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Acknowledge and annotate
          </Button>
        </>
      }
    />
  )
}
