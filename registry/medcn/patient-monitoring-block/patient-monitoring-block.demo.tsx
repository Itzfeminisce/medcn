"use client"

import { PatientMonitoringBlock } from "@/registry/medcn/patient-monitoring-block/patient-monitoring-block"

const TIMES = ["06:00", "10:00", "14:00", "18:00", "22:00"]

/** The 18:00 round was missed — visible as a gap in the grid AND in the chart. */
const OBSERVATIONS = [
  { time: "06:00", heartRate: 78, respiratoryRate: 16, spo2: 97 },
  { time: "10:00", heartRate: 92, respiratoryRate: 18, spo2: 95 },
  { time: "14:00", heartRate: 108, respiratoryRate: 24, spo2: 92 },
  { time: "18:00", heartRate: null, respiratoryRate: null, spo2: null },
  { time: "22:00", heartRate: 124, respiratoryRate: 28, spo2: 89 },
]

export default function PatientMonitoringBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border">
      <PatientMonitoringBlock
        className="min-h-[900px]"
        title="Bed 7 · A. Okonkwo · 54F"
        freshness={{
          status: "stale",
          age: "Last obs 22:00",
          label: "Observations",
          detail: "The 18:00 round was not charted. Next round due 02:00.",
        }}
        flowsheet={{
          caption: "Observations · 12 Mar · bed 7",
          columns: TIMES.map((time) => ({ key: time, label: time })),
          parameters: [
            {
              key: "hr",
              label: "Heart rate",
              unit: "bpm",
              values: {
                "06:00": { value: 78 },
                "10:00": { value: 92 },
                "14:00": { value: 108, flag: "high" },
                "22:00": { value: 124, flag: "critical" },
              },
            },
            {
              key: "rr",
              label: "Respiratory rate",
              unit: "breaths/min",
              values: {
                "06:00": { value: 16 },
                "10:00": { value: 18 },
                "14:00": { value: 24, flag: "high" },
                "22:00": { value: 28, flag: "critical" },
              },
            },
            {
              key: "spo2",
              label: "SpO₂",
              unit: "%",
              values: {
                "06:00": { value: 97 },
                "10:00": { value: 95 },
                "14:00": { value: 92, flag: "low" },
                "22:00": { value: 89, flag: "critical", note: "On 2 L nasal" },
              },
            },
          ],
        }}
        trends={{
          label: "Heart rate, respiratory rate and oxygen saturation, 12 Mar",
          caption: "No observations at 18:00 — the gap is drawn as a gap.",
          data: OBSERVATIONS,
          series: [
            {
              key: "heartRate",
              label: "Heart rate",
              unit: "bpm",
              domain: [50, 140],
              range: { low: 60, high: 100, label: "Adult, at rest" },
            },
            {
              key: "respiratoryRate",
              label: "Respiratory rate",
              unit: "breaths/min",
              domain: [8, 32],
              range: { low: 12, high: 20, label: "Adult, at rest" },
            },
            {
              key: "spo2",
              label: "Oxygen saturation",
              unit: "%",
              domain: [85, 100],
              range: { low: 94, criticalBelow: 90, label: "On room air" },
            },
          ],
        }}
        score={{
          system: "NEWS2",
          score: 8,
          band: "high",
          escalationThreshold: 7,
          guidance:
            "Urgent review by a clinician with critical-care competencies. Follow local protocol.",
          parameters: [
            { label: "Respiratory rate", value: "28 breaths/min", points: 3 },
            { label: "SpO₂", value: "89%", points: 2 },
            { label: "Supplemental oxygen", value: "2 L nasal", points: 2 },
            { label: "Systolic BP", value: "92 mmHg", points: 1 },
            { label: "Heart rate", value: "124 bpm", points: 0 },
          ],
          history: [
            { time: "06:00", score: 1 },
            { time: "10:00", score: 3 },
            { time: "14:00", score: 5 },
            { time: "18:00", score: null },
            { time: "22:00", score: 8 },
          ],
        }}
        medications={{
          caption: "Doses · 12 Mar · same time axis as the trends above",
          times: TIMES,
          medications: [
            {
              key: "metoprolol",
              label: "Metoprolol 12.5 mg",
              doses: [
                { time: "06:00", state: "given", detail: "12.5 mg PO" },
                { time: "10:00", state: "held", detail: "Held — SBP 92" },
                { time: "14:00", state: "held", detail: "Held — SBP 88" },
                { time: "18:00", state: "held", detail: "Held — SBP 90" },
                { time: "22:00", state: "scheduled" },
              ],
            },
            {
              key: "furosemide",
              label: "Furosemide 40 mg",
              doses: [
                { time: "06:00", state: "given", detail: "40 mg IV" },
                { time: "14:00", state: "given", detail: "40 mg IV" },
              ],
            },
          ],
        }}
      />
    </div>
  )
}
