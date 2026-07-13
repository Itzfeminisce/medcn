import { ChartInsufficientData } from "@/registry/medcn/chart-insufficient-data/chart-insufficient-data"

const READINGS = [
  { date: "02 Mar 08:10", value: "128/82 mmHg" },
  { date: "11 Mar 09:35", value: "134/86 mmHg" },
]

export default function ChartInsufficientDataDemo() {
  return (
    <div className="w-full max-w-md rounded-xl border p-2">
      <ChartInsufficientData count={2} minimum={5} period="30 days">
        <ul className="divide-border/60 divide-y">
          {READINGS.map((reading) => (
            <li key={reading.date} className="flex justify-between px-2 py-1.5">
              <span className="text-muted-foreground">{reading.date}</span>
              <span className="font-mono tabular-nums">{reading.value}</span>
            </li>
          ))}
        </ul>
      </ChartInsufficientData>
    </div>
  )
}
