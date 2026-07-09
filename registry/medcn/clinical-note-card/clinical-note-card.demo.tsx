import { Button } from "@/registry/medcn/button/button"
import { ClinicalNoteCard } from "@/registry/medcn/clinical-note-card/clinical-note-card"

export default function ClinicalNoteCardDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <ClinicalNoteCard
        noteType="Progress note (SOAP)"
        author={{ name: "Dr. Adeyemi", role: "Internal Medicine" }}
        time="14 Jul · 10:42"
        status="signed"
        signedBy="Electronically signed by O. Adeyemi, MD on 14 Jul 2026 10:44"
        clamp={3}
        actions={
          <>
            <Button size="sm" variant="outline">
              View full note
            </Button>
            <Button size="sm" variant="ghost">
              Addendum
            </Button>
          </>
        }
      >
        <strong>S:</strong> 58F with T2DM and HTN, here for routine follow-up.
        Reports good adherence, no hypoglycemia. <strong>O:</strong> BP 128/82,
        HbA1c 6.1%. <strong>A/P:</strong> Diabetes well controlled — continue
        metformin; hypertension at goal — continue lisinopril. RTC 3 months.
      </ClinicalNoteCard>
      <ClinicalNoteCard
        noteType="Telephone encounter"
        author={{ name: "N. Yusuf", role: "RN" }}
        time="Today · 09:05"
        status="draft"
      >
        Patient called re: refill for lisinopril. Pending provider review.
      </ClinicalNoteCard>
    </div>
  )
}
