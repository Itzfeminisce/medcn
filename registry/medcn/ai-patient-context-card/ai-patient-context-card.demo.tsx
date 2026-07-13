import { AiPatientContextCard } from "@/registry/medcn/ai-patient-context-card/ai-patient-context-card"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"

export default function AiPatientContextCardDemo() {
  return (
    <AiPatientContextCard
      className="w-full max-w-md"
      name="A. Okonkwo"
      initials="AO"
      identifiers="54F · MRN 4471-882"
      encounter="Follow-up · 12 Mar 2026"
      lastUpdated="14:01, 2 minutes ago"
      alerts={
        <>
          <Badge variant="destructive" className="text-[10px]">
            Penicillin — anaphylaxis
          </Badge>
          <Badge variant="warning" className="text-[10px]">
            eGFR 38 — renal dosing
          </Badge>
        </>
      }
      actions={
        <Button size="sm" variant="outline">
          Change
        </Button>
      }
    />
  )
}
