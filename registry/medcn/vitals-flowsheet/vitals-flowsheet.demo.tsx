import { VitalsFlowsheet } from "@/registry/medcn/vitals-flowsheet/vitals-flowsheet"

const COLUMNS = [
  { key: "t0600", label: "06:00", sublabel: "Nurse J.O." },
  { key: "t1000", label: "10:00", sublabel: "Nurse J.O." },
  { key: "t1400", label: "14:00", sublabel: "Nurse A.M." },
  { key: "t1800", label: "18:00", sublabel: "Nurse A.M." },
  { key: "t2200", label: "22:00", sublabel: "Night" },
]

/**
 * The 18:00 round was missed. Those cells say "Not measured" — they do not sit
 * empty, because an empty cell reads as a normal one.
 */
const PARAMETERS = [
  {
    key: "hr",
    label: "Heart rate",
    unit: "bpm",
    values: {
      t0600: { value: 78 },
      t1000: { value: 92 },
      t1400: { value: 108, flag: "high" as const },
      t2200: { value: 124, flag: "critical" as const },
    },
  },
  {
    key: "rr",
    label: "Respiratory rate",
    unit: "breaths/min",
    values: {
      t0600: { value: 16 },
      t1000: { value: 18 },
      t1400: { value: 24, flag: "high" as const },
      t2200: { value: 28, flag: "critical" as const },
    },
  },
  {
    key: "spo2",
    label: "SpO₂",
    unit: "%",
    values: {
      t0600: { value: 97 },
      t1000: { value: 95 },
      t1400: { value: 92, flag: "low" as const },
      t2200: { value: 89, flag: "critical" as const, note: "On 2 L nasal" },
    },
  },
  {
    key: "temp",
    label: "Temperature",
    unit: "°C",
    values: {
      t0600: { value: 37.1 },
      t1000: { value: 37.8 },
      t1400: { value: 38.6, flag: "high" as const },
      t2200: {
        value: 38.9,
        flag: "high" as const,
        chartedLate: true,
        note: "Charted 23:40",
      },
    },
  },
  {
    key: "bp",
    label: "Blood pressure",
    unit: "mmHg",
    values: {
      t0600: { value: "128/78" },
      t1400: { value: "104/62", flag: "low" as const },
      t2200: { value: "92/54", flag: "critical" as const },
    },
  },
]

export default function VitalsFlowsheetDemo() {
  return (
    <VitalsFlowsheet
      className="max-h-96"
      caption="Observations · 12 Mar · bed 7. The 18:00 round was not charted."
      columns={COLUMNS}
      parameters={PARAMETERS}
    />
  )
}
