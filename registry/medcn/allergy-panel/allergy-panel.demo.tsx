import { Pencil } from "lucide-react"

import { Button } from "@/registry/medcn/button/button"
import { AllergyPanel } from "@/registry/medcn/allergy-panel/allergy-panel"

export default function AllergyPanelDemo() {
  return (
    <AllergyPanel
      className="w-full max-w-md"
      info="Verified 14 Jul 2026. Report any new reactions."
      action={
        <Button size="sm" variant="ghost">
          <Pencil /> Edit
        </Button>
      }
      allergies={[
        { label: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
        { label: "Aspirin", severity: "moderate", reaction: "Bronchospasm" },
        { label: "Latex", severity: "moderate" },
        { label: "Pollen", severity: "mild" },
      ]}
    />
  )
}
