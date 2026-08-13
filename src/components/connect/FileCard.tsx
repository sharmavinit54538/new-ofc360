import { useState } from "react";
import { MessageAttachment } from "@/types/connect";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  Video as VideoIcon,
  Download,
  X,
  Eye,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  attachment: MessageAttachment;
  onRemove?: () => void;
  onPreview?: () => void;
  showProgress?: boolean;
  compact?: boolean;
  className?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFileIcon(type: string, name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";

  if (type.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) {
    return <ImageIcon className="w-5 h-5 text-indigo-500" />;
  }
  if (type.startsWith("video/") || ["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) {
    return <VideoIcon className="w-5 h-5 text-purple-500" />;
  }
  if (type.includes("pdf") || ext === "pdf") {
    return <FileText className="w-5 h-5 text-rose-500" />;
  }
  if (type.includes("sheet") || type.includes("excel") || ["xls", "xlsx", "csv"].includes(ext)) {
    return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
  }
  if (type.includes("zip") || type.includes("tar") || type.includes("rar") || ["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return <FileArchive className="w-5 h-5 text-amber-500" />;
  }
  if (["js", "ts", "tsx", "html", "css", "json", "py"].includes(ext)) {
    return <FileCode className="w-5 h-5 text-sky-500" />;
  }
  return <File className="w-5 h-5 text-slate-500" />;
}

export function FileCard({
  attachment,
  onRemove,
  onPreview,
  showProgress = false,
  compact = false,
  className = "",
}: FileCardProps) {
  const isImage = attachment.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].some((e) => attachment.name.toLowerCase().endsWith(e));
  const isVideo = attachment.type.startsWith("video/") || ["mp4", "webm", "mov"].some((e) => attachment.name.toLowerCase().endsWith(e));

  return (
    <div
      className={`group relative flex items-center gap-3 p-2.5 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/20 transition-all ${
        compact ? "py-1.5 px-2.5 text-xs" : ""
      } ${className}`}
    >
      {/* Icon or Thumbnail */}
      <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 overflow-hidden border border-border/40">
        {isImage && attachment.url ? (
          <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
        ) : (
          getFileIcon(attachment.type, attachment.name)
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs font-medium text-foreground truncate">{attachment.name}</p>
        <span className="text-[11px] text-muted-foreground">{formatFileSize(attachment.size)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {(isImage || isVideo || onPreview) && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onPreview}
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
        )}

        {attachment.url && (
          <a
            href={attachment.url}
            download={attachment.name}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        )}

        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
