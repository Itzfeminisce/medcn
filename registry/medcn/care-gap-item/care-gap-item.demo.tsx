import { Button } from "@/registry/medcn/button/button"
import { CareGapItem } from "@/registry/medcn/care-gap-item/care-gap-item"

export default function CareGapItemDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <CareGapItem
        name="HbA1c test"
        measure="HEDIS · Comprehensive Diabetes Care"
        status="overdue"
        due="Due 30 Jun · 9 days overdue"
        action={<Button size="sm">Order</Button>}
      />
      <CareGapItem
        name="Colorectal cancer screening"
        measure="USPSTF Grade A · ages 45–75"
        status="due"
        due="Due this month"
        action={
          <Button size="sm" variant="outline">
            Schedule
          </Button>
        }
      />
      <CareGapItem
        name="Influenza vaccine"
        status="scheduled"
        due="Booked 22 Jul"
      />
      <CareGapItem
        name="Blood pressure check"
        status="satisfied"
        due="Done 14 Jul"
      />
    </div>
  )
}
