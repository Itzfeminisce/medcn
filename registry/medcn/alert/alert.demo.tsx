import { CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/medcn/alert/alert"

export default function AlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Fasting required</AlertTitle>
        <AlertDescription>
          This lipid panel needs a 9-hour fast. Confirm the last meal time before
          drawing.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Renal dosing applies</AlertTitle>
        <AlertDescription>
          eGFR is 38 mL/min/1.73m&sup2;. Check the dose against the renal
          adjustment table.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive" role="alert">
        <TriangleAlertIcon />
        <AlertTitle>Documented penicillin allergy</AlertTitle>
        <AlertDescription>
          Anaphylaxis recorded 2019. Select an alternative agent.
        </AlertDescription>
      </Alert>

      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Order signed</AlertTitle>
        <AlertDescription>Sent to the pharmacy queue at 14:02.</AlertDescription>
      </Alert>
    </div>
  )
}
