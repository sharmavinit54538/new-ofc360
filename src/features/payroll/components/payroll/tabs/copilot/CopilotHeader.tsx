import { Bot } from "lucide-react";

export function CopilotHeader() {
  return (
    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
      <Bot className="w-4 h-4 text-primary" /> Copilot Inquiry & Diagnostic
    </h3>
  );
}
