import { Button } from "@/registry/medcn/button/button"
import { RefillCountdown } from "@/registry/medcn/refill-countdown/refill-countdown"

export default function RefillCountdownDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <RefillCountdown
        drugName="Metformin"
        strength="500 mg"
        quantityRemaining={48}
        dailyUse={2}
        supplyDays={30}
      />
      <RefillCountdown
        drugName="Levothyroxine"
        strength="50 mcg"
        daysRemaining={6}
        supplyDays={30}
        actions={
          <Button size="sm" variant="outline">
            Request refill
          </Button>
        }
      />
      <RefillCountdown
        drugName="Warfarin"
        strength="3 mg"
        daysRemaining={2}
        supplyDays={28}
        actions={
          <Button size="sm">Request refill</Button>
        }
      />
      <RefillCountdown drugName="Amlodipine" strength="5 mg" daysRemaining={0} />
    </div>
  )
}
