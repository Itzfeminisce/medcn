import { LabPanel, LabResultRow } from "@/registry/medcn/lab-result/lab-result"

export default function LabResultDemo() {
  return (
    <LabPanel title="Metabolic panel" collectedDate="2026-06-12">
      <LabResultRow
        label="HbA1c"
        value={6.1}
        unit="%"
        referenceMin={4.0}
        referenceMax={5.6}
        showRangeBar
      />
      <LabResultRow
        label="Fasting glucose"
        value={5.2}
        unit="mmol/L"
        referenceMin={3.9}
        referenceMax={5.5}
        showRangeBar
      />
      <LabResultRow
        label="Potassium"
        value={6.8}
        unit="mmol/L"
        referenceMin={3.5}
        referenceMax={5.2}
        flag="critical"
        showRangeBar
        note="Repeat sample requested to exclude haemolysis."
      />
      <LabResultRow
        label="Vitamin D"
        value={38}
        unit="nmol/L"
        referenceMin={50}
        referenceMax={125}
      />
    </LabPanel>
  )
}
