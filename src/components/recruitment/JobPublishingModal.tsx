import { useState } from "react";
import { Share2, Copy, Globe, Check, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { JobOpening } from "@/types/ats";
import { toast } from "sonner";

export function JobPublishingModal({ job }: { job: JobOpening }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const careersUrl = `${window.location.origin}/careers`;
  const embedCode = `<iframe src="${careersUrl}?embed=true" width="100%" height="700" frameborder="0"></iframe>`;

  const copyUrl = () => {
    navigator.clipboard.writeText(careersUrl);
    setCopiedLink(true);
    toast.success("Careers portal link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    toast.success("Embeddable iframe snippet copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
          <Share2 className="w-3.5 h-3.5" /> Publish & Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Multi-Channel Publishing Matrix</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <div className="space-y-3 bg-secondary/30 p-3 rounded-lg border border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <Label>Public Careers Portal</Label>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">LinkedIn Jobs Hook</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Indeed Publisher</span>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Direct Job Application Link</Label>
            <div className="flex gap-2">
              <input
                readOnly
                value={careersUrl}
                className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-xs font-mono"
              />
              <Button size="sm" onClick={copyUrl} className="gap-1">
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              <Code className="w-3.5 h-3.5" /> Embeddable Iframe Widget Snippet
            </Label>
            <div className="flex gap-2">
              <textarea
                readOnly
                rows={2}
                value={embedCode}
                className="flex-1 bg-background border border-border rounded-md p-2 text-[11px] font-mono"
              />
              <Button size="sm" onClick={copyEmbed} className="gap-1">
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}