"use client"

import { ClinicalAlertItem } from "@/registry/medcn/clinical-alert-item/clinical-alert-item"

export default function ClinicalAlertItemDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <ClinicalAlertItem
        severity="critical"
        title="Critical potassium 6.4 mmol/L"
        category="Critical lab"
        source="Auto-flagged by lab rule LAB-K-HIGH (≥6.0 mmol/L)"
        message="Ada Obi · Bed 4B. Repeat sample and notify the covering physician."
        time="12:41"
        onAcknowledge={() => {}}
        onDismiss={() => {}}
      />
      <ClinicalAlertItem
        severity="warning"
        title="Potential interaction: warfarin + ibuprofen"
        category="Drug interaction"
        source="First DataBank severity: major"
        message="Increased bleeding risk. Consider acetaminophen for analgesia."
        time="11:03"
        onDismiss={() => {}}
      />
      <ClinicalAlertItem
        severity="info"
        title="New result: Lipid panel"
        category="Result"
        time="09:20"
        onDismiss={() => {}}
      />
    </div>
  )
}
