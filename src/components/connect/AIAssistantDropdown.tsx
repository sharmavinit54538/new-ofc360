import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Mail,
  Briefcase,
  Minimize2,
  Maximize2,
  Smile,
  FileText,
  MessageSquareQuote,
  Flame,
} from "lucide-react";
import { useConnect } from "@/features/connect/hooks";
import { toast } from "sonner";

interface AIAssistantDropdownProps {
  currentText: string;
  onApplyText: (newText: string) => void;
  recipientName?: string;
  recipientEmail?: string;
}

export function AIAssistantDropdown({
  currentText,
  onApplyText,
  recipientName,
  recipientEmail,
}: AIAssistantDropdownProps) {
  const { openMailArtifact } = useConnect();

  const handleAction = (action: string, tone?: string) => {
    if (action === "write_email") {
      openMailArtifact({
        to: recipientEmail || "",
        subject: currentText ? `Regarding: ${currentText.slice(0, 30)}...` : "",
        body: currentText || "",
      });
      return;
    }

    if (!currentText.trim()) {
      if (action === "generate_reply") {
        onApplyText(
          recipientName
            ? `Hi ${recipientName}, thanks for reaching out. I'm currently reviewing this and will follow up shortly.`
            : "Thanks for sharing. I've received your note and will review it shortly."
        );
        toast.success("Generated reply suggestion");
        return;
      }
      toast.info("Type a message or draft first to apply AI transformations.");
      return;
    }

    // Local smart transformations
    let transformed = currentText;
    switch (action) {
      case "professional":
        transformed = `Dear ${recipientName || "Colleague"},\n\nI am writing to share an update regarding our current progress. ${currentText}\n\nPlease let me know if any further clarification is required.\n\nBest regards.`;
        break;
      case "shorten":
        transformed = currentText
          .split(".")
          .slice(0, 2)
          .join(".")
          .trim() + (currentText.includes(".") ? "." : "");
        break;
      case "expand":
        transformed = `${currentText}\n\nAdditionally, all associated team deliverables and milestones remain on schedule for this sprint.`;
        break;
      case "tone":
        if (tone === "friendly") {
          transformed = `Hey ${recipientName || "there"}! 😊 ${currentText} Thanks so much!`;
        } else if (tone === "urgent") {
          transformed = `⚠️ URGENT: ${currentText}\n\nPlease prioritize this at your earliest convenience.`;
        } else if (tone === "diplomatic") {
          transformed = `Thank you for bringing this up. Regarding your inquiry: ${currentText} Let's coordinate to ensure we achieve the best outcome.`;
        }
        break;
      case "summarize":
        transformed = `📌 Summary Key Points:\n• ${currentText.replace(/\n/g, "\n• ")}`;
        break;
      default:
        transformed = currentText;
    }

    onApplyText(transformed);
    toast.success(`Applied AI: ${action.replace("_", " ")}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 gap-1.5 text-xs font-semibold rounded-lg cursor-pointer"
          title="AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Copilot</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-xl border-border/80 text-xs">
        <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold px-2 py-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          AI Communication Tools
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleAction("write_email")}
          className="flex items-center gap-2 cursor-pointer font-medium text-foreground py-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-indigo-500" />
          <span>Write Email (Artifact)</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("professional")}
          className="flex items-center gap-2 cursor-pointer py-1.5"
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
          <span>Make Professional</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("generate_reply")}
          className="flex items-center gap-2 cursor-pointer py-1.5"
        >
          <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
          <span>Generate Quick Reply</span>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer py-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            <span>Change Tone</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-40 p-1 text-xs">
            <DropdownMenuItem onClick={() => handleAction("tone", "friendly")} className="cursor-pointer py-1.5">
              <Smile className="w-3 h-3 text-amber-500 mr-2" /> Friendly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("tone", "diplomatic")} className="cursor-pointer py-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-500 mr-2" /> Diplomatic
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("tone", "urgent")} className="cursor-pointer py-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500 mr-2" /> Urgent
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={() => handleAction("shorten")}
          className="flex items-center gap-2 cursor-pointer py-1.5"
        >
          <Minimize2 className="w-3.5 h-3.5 text-sky-500" />
          <span>Shorten Message</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("expand")}
          className="flex items-center gap-2 cursor-pointer py-1.5"
        >
          <Maximize2 className="w-3.5 h-3.5 text-purple-500" />
          <span>Expand Message</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleAction("summarize")}
          className="flex items-center gap-2 cursor-pointer py-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Summarize as Bullet Points</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}