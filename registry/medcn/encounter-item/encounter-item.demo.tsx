import { EncounterItem } from "@/registry/medcn/encounter-item/encounter-item"

export default function EncounterItemDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <EncounterItem
        interactive
        type="office"
        title="Hypertension follow-up"
        provider="Dr. Adeyemi"
        location="Outpatient · Rm 4"
        date="14 Jul"
        status="completed"
        summary="BP 128/82. Continue lisinopril 10 mg."
      />
      <EncounterItem
        interactive
        type="ed"
        title="Chest pain"
        provider="Dr. Okoro"
        location="Emergency"
        date="2 Jun"
        status="completed"
        summary="ACS ruled out. Discharged same day."
      />
      <EncounterItem
        interactive
        type="telehealth"
        title="Medication review"
        provider="Dr. Adeyemi"
        date="22 Jul"
        status="scheduled"
      />
    </div>
  )
}
