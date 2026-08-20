import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageModalPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageName?: string;
}

export function ImageModalPreview({
  open,
  onOpenChange,
  imageUrl,
  imageName = "Image Preview",
}: ImageModalPreviewProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-2 bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl overflow-hidden shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between px-3 py-2 border-b border-border/40">
          <DialogTitle className="text-sm font-medium text-foreground truncate max-w-md">
            {imageName}
          </DialogTitle>
          <div className="flex items-center gap-1">
            <a
              href={imageUrl}
              download={imageName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </DialogHeader>
        <div className="relative flex items-center justify-center min-h-[300px] max-h-[75vh] p-4 bg-muted/20 overflow-auto">
          <img
            src={imageUrl}
            alt={imageName}
            className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}