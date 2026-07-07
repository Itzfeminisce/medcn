import { Button } from "@/registry/medcn/button/button"
import { CareTeamList } from "@/registry/medcn/care-team-list/care-team-list"

export default function CareTeamListDemo() {
  return (
    <CareTeamList
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
        {
          name: "Dr James Patel",
          role: "Resident",
          specialty: "Internal Medicine",
          status: "busy",
        },
        {
          name: "Grace Adeyemi",
          role: "Named nurse",
          specialty: "Ward 4B",
          status: "online",
        },
        {
          name: "Tom Riley",
          role: "Pharmacist",
          specialty: "Clinical Pharmacy",
          status: "away",
        },
        {
          name: "Dr Lena Fischer",
          role: "Consultant",
          specialty: "Nephrology",
          status: "offline",
        },
        {
          name: "Priya Nair",
          role: "Physiotherapist",
          status: "online",
        },
      ]}
      max={4}
    />
  )
}
