import { MessageInboxRow } from "@/registry/medcn/message-inbox-row/message-inbox-row"

export default function MessageInboxRowDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <MessageInboxRow
        sender={{ name: "Ada Obi" }}
        subject="Question about my new medication"
        preview="Since starting the lisinopril I've had a dry cough…"
        time="10:24"
        unread
        priority="high"
        category="Patient message"
      />
      <MessageInboxRow
        sender={{ name: "Lab · Chemistry" }}
        subject="Critical result: Potassium 6.4"
        preview="Ada Obi · collected 09:50"
        time="09:58"
        unread
        priority="urgent"
        category="Result"
        hasAttachment
      />
      <MessageInboxRow
        sender={{ name: "Pharmacy" }}
        subject="Refill request — metformin 500 mg"
        preview="Awaiting your approval"
        time="Yesterday"
        category="Refill"
      />
    </div>
  )
}
