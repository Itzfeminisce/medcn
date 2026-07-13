import { AiAttachmentCard } from "@/registry/medcn/ai-attachment-card/ai-attachment-card"

export default function AiAttachmentCardDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2.5">
      <AiAttachmentCard
        name="discharge-summary-12mar.pdf"
        kind="document"
        size={412_000}
        status="ready"
        note="4 pages · text extracted for retrieval. Not clinically reviewed."
        onRemove={() => {}}
      />

      <AiAttachmentCard
        name="wound-left-heel-day3.jpg"
        kind="image"
        size={2_340_000}
        status="analyzing"
        note="Being read for text and metadata. Any findings appear in a sourced response, not here."
        onRemove={() => {}}
      />

      <AiAttachmentCard
        name="ecg-strip-0842.png"
        kind="image"
        size={1_120_000}
        status="uploading"
        progress={64}
        onRemove={() => {}}
      />

      <AiAttachmentCard
        name="clinic-letter-scan.pdf"
        kind="document"
        size={18_900_000}
        status="error"
        error="Upload failed: the file exceeds the 20 MB limit for this encounter."
        onRetry={() => {}}
        onRemove={() => {}}
      />
    </div>
  )
}
