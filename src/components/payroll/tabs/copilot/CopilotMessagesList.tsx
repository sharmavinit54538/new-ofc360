import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function CopilotMessagesList() {
  const c = usePayrollContext();
  return (
    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
      {c.copilotMessages.map((m, i) => {
        const isUser = m.sender === "user";
        return (
          <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl p-3 rounded-2xl text-xs leading-relaxed ${isUser ? "bg-primary text-primary-foreground font-medium rounded-br-none" : "bg-secondary/40 border border-border/60 text-foreground rounded-bl-none"}`}>{m.text}</div>
          </div>
        );
      })}
      {c.isCopilotThinking && <div className="flex justify-start"><div className="bg-secondary/40 border border-border/60 p-3 rounded-2xl text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Analyzing...</div></div>}
    </div>
  );
}
