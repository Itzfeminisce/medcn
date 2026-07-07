import { LabOrderStatus } from "@/registry/medcn/lab-order-status/lab-order-status"

export default function LabOrderStatusDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <LabOrderStatus
        current="in-lab"
        times={{
          ordered: "2026-07-07T08:15:00",
          collected: "2026-07-07T09:40:00",
        }}
      />
      <LabOrderStatus
        current="reviewed"
        showReviewed
        times={{
          ordered: "2026-07-06T10:00:00",
          collected: "2026-07-06T10:20:00",
          "in-lab": "2026-07-06T11:05:00",
          resulted: "2026-07-06T15:30:00",
          reviewed: "2026-07-06T16:10:00",
        }}
      />
      <LabOrderStatus
        current="collected"
        terminal={{
          state: "rejected",
          reason: "Haemolysed sample",
          at: "2026-07-07T09:55:00",
        }}
      />
    </div>
  )
}
