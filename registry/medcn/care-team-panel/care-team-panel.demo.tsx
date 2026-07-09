import { Button } from "@/registry/medcn/button/button"
import { CareTeamPanel } from "@/registry/medcn/care-team-panel/care-team-panel"

export default function CareTeamPanelDemo() {
  return (
    <CareTeamPanel
      className="w-full max-w-lg"
      max={4}
      members={[
        {
          name: "Dr Sarah Chen",
          role: "Attending",
          specialty: "Cardiology",
          status: "online",
          contact: (
            <Button size="sm" variant="outline" className="w-full" asChild>
              <a href="tel:+10000000000">Message</a>
            </Button>
          ),
        },
        { name: "Dr James Patel", role: "Resident", specialty: "Internal Medicine", status: "busy" },
        { name: "Grace Adeyemi", role: "Named nurse", specialty: "Ward 4B", status: "online" },
        { name: "Tom Riley", role: "Pharmacist", specialty: "Clinical Pharmacy", status: "away" },
        { name: "Dr Lena Fischer", role: "Consultant", specialty: "Nephrology", status: "offline" },
      ]}
      emergencyContacts={[
        {
          name: "Adaeze Nwosu",
          relationship: "Spouse",
          phone: "+234 803 555 0117",
          isPrimary: true,
          note: "Reachable 24/7.",
        },
        { name: "Chinedu Nwosu", relationship: "Brother", phone: "+234 805 555 0182" },
      ]}
    />
  )
}
