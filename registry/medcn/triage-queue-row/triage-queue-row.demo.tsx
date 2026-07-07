import { TriageQueueRow } from "@/registry/medcn/triage-queue-row/triage-queue-row"

export default function TriageQueueRowDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <TriageQueueRow
        name="Marcus Bell"
        age={58}
        sex="M"
        level={2}
        complaint="Central chest pain, radiating to left arm"
        waitingMinutes={7}
        targetMinutes={10}
      />
      <TriageQueueRow
        name="Aisha Okafor"
        age={34}
        sex="F"
        level={3}
        complaint="Laceration to right forearm"
        waitingMinutes={48}
        targetMinutes={60}
      />
      <TriageQueueRow
        name="Ella Nguyen"
        age={71}
        sex="F"
        level={3}
        complaint="Shortness of breath since morning"
        waitingMinutes={72}
        targetMinutes={60}
      />
    </div>
  )
}
