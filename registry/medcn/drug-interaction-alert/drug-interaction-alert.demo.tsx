"use client"

import { DrugInteractionAlert } from "@/registry/medcn/drug-interaction-alert/drug-interaction-alert"

export default function DrugInteractionAlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <DrugInteractionAlert
        severity="contraindicated"
        drugs={["Sildenafil", "Isosorbide mononitrate"]}
        description="Concurrent use can cause severe, refractory hypotension."
        detail="Do not co-administer. Allow at least 24 hours after the last sildenafil dose before giving nitrates; seek an alternative anti-anginal if PDE5 therapy must continue."
      />
      <DrugInteractionAlert
        severity="major"
        drugs={["Warfarin", "Aspirin"]}
        description="Combined anticoagulant and antiplatelet effect raises bleeding risk."
        detail="If co-prescription is intended, use the lowest effective aspirin dose, add gastroprotection, and increase INR monitoring frequency."
      />
      <DrugInteractionAlert
        severity="moderate"
        drugs={["Lisinopril", "Ibuprofen"]}
        description="NSAIDs can blunt the antihypertensive effect and worsen renal function."
        onDismiss={() => {}}
      />
      <DrugInteractionAlert
        severity="minor"
        drugs={["Metformin", "Cimetidine"]}
        description="May modestly increase metformin levels."
        onDismiss={() => {}}
      />
    </div>
  )
}
