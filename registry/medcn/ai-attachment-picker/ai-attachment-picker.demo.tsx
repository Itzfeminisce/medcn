"use client"

import * as React from "react"
import { CameraIcon, FileTextIcon, ImageIcon } from "lucide-react"

import { AiAttachmentPicker } from "@/registry/medcn/ai-attachment-picker/ai-attachment-picker"

export default function AiAttachmentPickerDemo() {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <AiAttachmentPicker
        variant="outline"
        label="Attach to this encounter"
        restrictions="Attachments are stored against Mrs Adeyemi's record and are visible to her care team. Do not attach documents belonging to another patient."
        limitLabel="PDF, PNG, or JPEG · up to 20 MB per file · not shared outside the trust"
        types={[
          {
            id: "document",
            label: "Referral or report",
            description: "PDF letters, discharge summaries, lab reports.",
            icon: <FileTextIcon />,
            accept: "application/pdf",
            multiple: true,
          },
          {
            id: "image",
            label: "Image from this device",
            description: "Wound photos, ECG strips, scanned forms.",
            icon: <ImageIcon />,
            accept: "image/png,image/jpeg",
            multiple: true,
          },
          {
            id: "capture",
            label: "Take a photo",
            description: "Uses the device camera. Frame the wound, not the face.",
            icon: <CameraIcon />,
            accept: "image/*",
            capture: true,
          },
        ]}
        onSelect={(files, typeId) => {
          const first = files[0]
          setSelected(
            `${files.length} file${files.length === 1 ? "" : "s"} from "${typeId}"${
              first ? ` — ${first.name}` : ""
            }`
          )
        }}
      />

      <p className="text-muted-foreground text-xs">
        {selected
          ? `Handed to the caller: ${selected}`
          : "Nothing selected yet. Files are passed to the caller; this control uploads nothing."}
      </p>
    </div>
  )
}
