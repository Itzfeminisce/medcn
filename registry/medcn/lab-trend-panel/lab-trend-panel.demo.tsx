import {
  LabTrendPanel,
  LabTrendRow,
} from "@/registry/medcn/lab-trend-panel/lab-trend-panel"

export default function LabTrendPanelDemo() {
  return (
    <LabTrendPanel title="Renal & metabolic" collectedDate="2026-07-05">
      <LabTrendRow
        label="HbA1c"
        value={7.1}
        unit="%"
        referenceMin={4}
        referenceMax={5.6}
        showRangeBar
        history={[
          { value: 8.4, date: "2026-01-10" },
          { value: 7.9, date: "2026-03-12" },
          { value: 7.5, date: "2026-05-08" },
          { value: 7.1, date: "2026-07-05" },
        ]}
      />
      <LabTrendRow
        label="eGFR"
        value={58}
        unit="mL/min"
        referenceMin={60}
        referenceMax={120}
        history={[
          { value: 72, date: "2026-01-10" },
          { value: 66, date: "2026-03-12" },
          { value: 61, date: "2026-05-08" },
          { value: 58, date: "2026-07-05" },
        ]}
      />
      <LabTrendRow
        label="Potassium"
        value={4.2}
        unit="mmol/L"
        referenceMin={3.5}
        referenceMax={5.1}
        history={[
          { value: 4.0, date: "2026-03-12" },
          { value: 4.4, date: "2026-05-08" },
          { value: 4.2, date: "2026-07-05" },
        ]}
      />
    </LabTrendPanel>
  )
}
