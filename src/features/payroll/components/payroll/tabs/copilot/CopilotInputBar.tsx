import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayrollContext } from "../../PayrollContext";

export function CopilotInputBar() {
  const c = usePayrollContext();
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-border/40">
      <Input placeholder="Ask Copilot..." value={c.copilotInput} onChange={(e) => c.setCopilotInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && c.handleSendCopilotMessage()} className="text-xs bg-secondary/30" />
      <Button size="sm" onClick={c.handleSendCopilotMessage} disabled={c.isCopilotThinking || !c.copilotInput.trim()} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"><Send className="w-3.5 h-3.5" /> Ask</Button>
    </div>
  );
}
