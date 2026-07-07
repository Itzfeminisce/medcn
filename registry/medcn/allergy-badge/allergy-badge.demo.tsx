import { AllergyBadge, AllergyList } from "@/registry/medcn/allergy-badge/allergy-badge"

export default function AllergyBadgeDemo() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-1.5">
        <AllergyBadge label="Penicillin" severity="severe" reaction="Anaphylaxis" />
        <AllergyBadge label="Latex" severity="moderate" reaction="Contact urticaria" />
        <AllergyBadge label="Pollen" severity="mild" />
        <AllergyBadge label="Shellfish" />
      </div>
      <AllergyList
        max={3}
        allergies={[
          { label: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
          { label: "Aspirin", severity: "moderate", reaction: "Bronchospasm" },
          { label: "Latex", severity: "moderate" },
          { label: "Pollen", severity: "mild" },
          { label: "Dust mites", severity: "mild" },
        ]}
      />
      <AllergyList allergies={[]} />
    </div>
  )
}
