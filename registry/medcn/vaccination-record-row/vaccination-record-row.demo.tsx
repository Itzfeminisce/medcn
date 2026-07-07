import { VaccinationRecordRow } from "@/registry/medcn/vaccination-record-row/vaccination-record-row"

export default function VaccinationRecordRowDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <VaccinationRecordRow
        vaccine="Tdap"
        doseLabel="Booster"
        status="complete"
        dateGiven="2024-11-02"
        lotNumber="UJ349AA"
        provider="Riverside Clinic"
      />
      <VaccinationRecordRow
        vaccine="Hepatitis B"
        doseNumber={2}
        doseTotal={3}
        status="due"
        dateGiven="2026-01-15"
        nextDueDate="2026-07-15"
      />
      <VaccinationRecordRow
        vaccine="HPV"
        doseNumber={1}
        doseTotal={2}
        status="overdue"
        dateGiven="2025-09-20"
        nextDueDate="2026-03-20"
      />
      <VaccinationRecordRow
        vaccine="Influenza (seasonal)"
        status="upcoming"
        nextDueDate="2026-10-01"
      />
    </div>
  )
}
