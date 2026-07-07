import { Button } from "@/registry/medcn/button/button"
import { PrescriptionCard } from "@/registry/medcn/prescription-card/prescription-card"

export default function PrescriptionCardDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <PrescriptionCard
        drugName="Amoxicillin"
        strength="500 mg capsule"
        sig="Take 1 capsule three times daily for 7 days, with food."
        quantity="21 capsules"
        refillsRemaining={0}
        prescriber="Dr. A. Okafor"
        issuedDate="2026-06-28"
        status="active"
        actions={
          <Button size="sm" variant="outline">
            Request refill
          </Button>
        }
      />
      <PrescriptionCard
        drugName="Lisinopril"
        strength="10 mg tablet"
        sig="Take 1 tablet once daily in the morning."
        quantity="28 tablets"
        refillsRemaining={3}
        prescriber="Dr. A. Okafor"
        issuedDate="2026-05-02"
        status="completed"
      />
    </div>
  )
}
