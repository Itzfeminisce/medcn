import { Badge } from "@/registry/medcn/badge/badge"
import { MessagesInboxPanel } from "@/registry/medcn/messages-inbox-panel/messages-inbox-panel"

export default function MessagesInboxPanelDemo() {
  return (
    <MessagesInboxPanel
      className="w-full max-w-xl"
      action={<Badge variant="soft">2 unread</Badge>}
      items={[
        {
          id: "m1",
          sender: { name: "Pharmacy" },
          subject: "Refill request — metformin 500 mg",
          preview: "Awaiting your approval",
          time: "Yesterday",
          category: "Refill",
        },
        {
          id: "m2",
          sender: { name: "Lab · Chemistry" },
          subject: "Critical result: Potassium 6.4",
          preview: "Ada Obi · collected 09:50",
          time: "09:58",
          unread: true,
          priority: "urgent",
          category: "Result",
          hasAttachment: true,
        },
        {
          id: "m3",
          sender: { name: "Ada Obi" },
          subject: "Question about my new medication",
          preview: "Since starting the lisinopril I've had a dry cough…",
          time: "10:24",
          unread: true,
          priority: "high",
          category: "Patient message",
        },
      ]}
    />
  )
}
