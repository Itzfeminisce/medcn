"use client"

import { BloodPressureChart } from "@/registry/medcn/blood-pressure-chart/blood-pressure-chart"

/** The pulse pressure narrows across the series — visible only because the pair is one mark. */
const READINGS = [
  { time: "02 Mar", systolic: 142, diastolic: 78, map: 99, position: "Seated" },
  { time: "09 Mar", systolic: 138, diastolic: 84, map: 102, position: "Seated" },
  { time: "16 Mar", systolic: 132, diastolic: 88, map: 103, position: "Seated" },
  { time: "23 Mar", systolic: 128, diastolic: 92, map: 104, position: "Standing" },
  { time: "30 Mar", systolic: 126, diastolic: 94, map: 105, position: "Seated" },
]

export default function BloodPressureChartDemo() {
  return (
    <BloodPressureChart
      className="max-w-2xl"
      data={READINGS}
      systolicTarget={130}
      diastolicTarget={80}
      showMap
      caption="Clinic readings, left arm. Position shown per reading — a standing measurement is not interchangeable with a seated one."
    />
  )
}
