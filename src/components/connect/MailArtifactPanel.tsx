import { useState } from "react";
import { useConnect } from "@/features/connect/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  X,
  Copy,
  Check,
  Send,
  Save,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function MailArtifactPanel() {
  const {
    isMailArtifactOpen,
    mailArtifact,
    closeMailArtifact,
    updateMailArtifact,
  } = useConnect();

  const [showCcBcc, setShowCcBcc] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isMailArtifactOpen || !mailArtifact) return null;

  const handleCopy = () => {
    const fullEmailText = `To: ${mailArtifact.to}\n${mailArtifact.cc ? `CC: ${mailArtifact.cc}\n` : ""}${
      mailArtifact.bcc ? `BCC: ${mailArtifact.bcc}\n` : ""
    }Subject: ${mailArtifact.subject}\n\n${mailArtifact.body}`;

    navigator.clipboard.writeText(fullEmailText);
    setCopied(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    toast.success("Email draft saved locally");
  };

  const handleSend = () => {
    if (!mailArtifact.to.trim()) {
      toast.error("Please specify a recipient email address.");
      return;
    }
    toast.success(`Email sent to ${mailArtifact.to}`);
    closeMailArtifact();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full sm:w-[460px] h-full border-l border-border/80 bg-card/95 backdrop-blur-xl flex flex-col shadow-2xl z-30 shrink-0 select-none overflow-hidden"
      >
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Mail</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Artifact
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Draft or edit outgoing communication</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={closeMailArtifact}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Email Form Fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin text-xs">
          {/* To */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-semibold text-muted-foreground">To</Label>
              <button
                type="button"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
              >
                {showCcBcc ? "Hide CC/BCC" : "Add CC/BCC"}
                {showCcBcc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <Input
              value={mailArtifact.to}
              onChange={(e) => updateMailArtifact({ to: e.target.value })}
              placeholder="recipient@organization.com"
              className="text-xs h-8 rounded-lg bg-background"
            />
          </div>

          {/* CC / BCC */}
          {showCcBcc && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-2 pt-1 border-t border-border/40"
            >
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">CC</Label>
                <Input
                  value={mailArtifact.cc}
                  onChange={(e) => updateMailArtifact({ cc: e.target.value })}
                  placeholder="manager@organization.com"
                  className="text-xs h-8 rounded-lg bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">BCC</Label>
                <Input
                  value={mailArtifact.bcc}
                  onChange={(e) => updateMailArtifact({ bcc: e.target.value })}
                  placeholder="archive@organization.com"
                  className="text-xs h-8 rounded-lg bg-background"
                />
              </div>
            </motion.div>
          )}

          {/* Subject */}
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold text-muted-foreground">Subject</Label>
            <Input
              value={mailArtifact.subject}
              onChange={(e) => updateMailArtifact({ subject: e.target.value })}
              placeholder="e.g. Project Delivery Update"
              className="text-xs h-8 rounded-lg bg-background font-medium"
            />
          </div>

          {/* Body */}
          <div className="space-y-1 flex-1 flex flex-col pt-1">
            <Label className="text-[11px] font-semibold text-muted-foreground">Email Body</Label>
            <Textarea
              value={mailArtifact.body}
              onChange={(e) => updateMailArtifact({ body: e.target.value })}
              placeholder="Write your email draft here..."
              className="text-xs min-h-[220px] rounded-xl bg-background leading-relaxed resize-none p-3 scrollbar-thin"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 px-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs h-8 gap-1.5 rounded-lg border-border/80 cursor-pointer"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSaveDraft}
              className="text-xs h-8 gap-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              title="Save Draft"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleSend}
            className="gradient-bg text-primary-foreground text-xs h-8 gap-1.5 rounded-lg shadow-sm font-semibold cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
