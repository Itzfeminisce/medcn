import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { PatientBanner } from "@/registry/medcn/patient-banner/patient-banner"

const allergies = [
  { label: "Penicillin", severity: "severe" as const, reaction: "Anaphylaxis" },
  { label: "Latex", severity: "moderate" as const },
  { label: "Pollen", severity: "mild" as const },
  { label: "Dust mites", severity: "mild" as const },
]

export default function PatientBannerDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <PatientBanner
        name="Adaeze Nwosu"
        dob="1992-03-12"
        sex="female"
        mrn="PT-048291"
        allergies={allergies}
        tags={<Badge variant="soft">28 weeks pregnant</Badge>}
        actions={
          <Button size="sm" variant="outline">
            View chart
          </Button>
        }
      />
      <PatientBanner
        variant="compact"
        name="Adaeze Nwosu"
        age={34}
        sex="female"
        mrn="PT-048291"
        allergies={allergies}
      />
    </div>
  )
}
