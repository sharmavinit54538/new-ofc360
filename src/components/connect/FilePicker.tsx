import { useRef } from "react";
import { MessageAttachment } from "@/types/connect";
import { toast } from "sonner";

interface FilePickerProps {
  onFilesSelected: (attachments: MessageAttachment[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number; // default 50MB
  children: (props: { openPicker: () => void }) => React.ReactNode;
}

const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB

export function FilePicker({
  onFilesSelected,
  accept = "*/*",
  multiple = true,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  children,
}: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newAttachments: MessageAttachment[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.size > maxSizeBytes) {
        toast.error(`File "${file.name}" exceeds the 50MB limit.`);
        return;
      }

      // Generate local object URL for preview
      const objectUrl = URL.createObjectURL(file);
      newAttachments.push({
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        url: objectUrl,
        isLocal: true,
      });
    });

    if (newAttachments.length > 0) {
      onFilesSelected(newAttachments);
    }

    // Reset input value so same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      {children({ openPicker })}
    </>
  );
}
