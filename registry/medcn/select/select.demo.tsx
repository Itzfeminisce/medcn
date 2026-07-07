import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/medcn/select/select"

export default function SelectDemo() {
  return (
    <Select defaultValue="oral">
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Route of administration" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="oral">Oral (PO)</SelectItem>
        <SelectItem value="iv">Intravenous (IV)</SelectItem>
        <SelectItem value="im">Intramuscular (IM)</SelectItem>
        <SelectItem value="sc">Subcutaneous (SC)</SelectItem>
        <SelectItem value="pr">Rectal (PR)</SelectItem>
      </SelectContent>
    </Select>
  )
}
