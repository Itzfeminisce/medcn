import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/medcn/card/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Upcoming appointment</CardTitle>
        <CardDescription>Dr. Adeyemi — General checkup</CardDescription>
        <CardAction>
          <Badge variant="soft">Confirmed</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Tuesday, 14 July · 10:30 AM · Room 4, Outpatient wing
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Check in</Button>
        <Button size="sm" variant="outline">
          Reschedule
        </Button>
      </CardFooter>
    </Card>
  )
}
