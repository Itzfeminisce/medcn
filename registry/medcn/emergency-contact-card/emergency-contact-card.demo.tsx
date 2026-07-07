import { EmergencyContactCard } from "@/registry/medcn/emergency-contact-card/emergency-contact-card"

export default function EmergencyContactCardDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <EmergencyContactCard
        name="Adaeze Nwosu"
        relationship="Spouse"
        phone="+234 803 555 0117"
        isPrimary
        note="Reachable 24/7. Speaks English and Igbo."
      />
      <EmergencyContactCard
        name="Chinedu Nwosu"
        relationship="Brother"
        phone="+234 805 555 0182"
      />
    </div>
  )
}
