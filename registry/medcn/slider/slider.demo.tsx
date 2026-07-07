import { Slider } from "@/registry/medcn/slider/slider"

export default function SliderDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Slider defaultValue={[4]} min={0} max={10} step={1} showMarks />
      <Slider
        defaultValue={[6]}
        min={0}
        max={10}
        step={1}
        showMarks
        markLabels={{ 0: "None", 5: "Moderate", 10: "Worst" }}
      />
    </div>
  )
}
