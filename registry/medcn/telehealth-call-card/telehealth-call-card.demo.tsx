import { TelehealthCallCard } from "@/registry/medcn/telehealth-call-card/telehealth-call-card"

export default function TelehealthCallCardDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <TelehealthCallCard
        clinicianName="Dr Sarah Chen"
        specialty="Cardiology"
        scheduledTime="2026-07-07T14:30:00"
        timezone="BST"
        joinEnabled
        joinHref="#join"
        camera
        mic
      />
      <TelehealthCallCard
        clinicianName="Dr James Patel"
        specialty="Dermatology"
        scheduledTime="2026-07-09T09:15:00"
        timezone="BST"
        camera
        mic={false}
      />
    </div>
  )
}
