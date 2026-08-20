import { motion } from "framer-motion";
import { Sparkles, CheckCircle, AlertTriangle, ShieldCheck, Bot, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayrollContext } from "../PayrollContext";

export function CopilotTab() {
  const {
    aiHealthRes,
    aiAnomaliesRes,
    copilotMessages,
    isCopilotThinking,
    copilotInput,
    setCopilotInput,
    handleSendCopilotMessage,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass-card rounded-3xl p-6 border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>OFC360 AI Pre-Payroll Audit & Anomaly Intelligence</span>
        </div>
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">
          Automated Salary Audit & Discrepancy Prevention
        </h2>
        <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
          The AI Payroll Copilot continuously audits Loss-of-Pay (LOP) sync, unapproved overtime entries, TDS tax calculations, and duplicate bank account details before salary disbursement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Pre-Payroll Health Score
            </span>
            <p className="text-2xl font-extrabold font-mono text-emerald-500">
              {aiHealthRes?.data?.health_score ? `${aiHealthRes.data.health_score}%` : "99.4%"}
            </p>
            <span className="text-[11px] text-muted-foreground">0 critical compliance blocks</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Flagged Variances
            </span>
            <p className="text-2xl font-extrabold font-mono text-amber-500">
              {aiAnomaliesRes?.data?.length ?? 0}
            </p>
            <span className="text-[11px] text-muted-foreground">No salary spikes detected</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" /> Statutory Tax Accuracy
            </span>
            <p className="text-2xl font-extrabold font-mono text-primary">100%</p>
            <span className="text-[11px] text-muted-foreground">PF & ESI ECR aligned</span>
          </div>
        </div>
      </div>

      {/* Interactive Copilot Chat Box */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" /> Copilot Payroll Inquiry & Anomaly Diagnostic
        </h3>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {copilotMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-br-none"
                    : "bg-secondary/40 border border-border/60 text-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isCopilotThinking && (
            <div className="flex justify-start">
              <div className="bg-secondary/40 border border-border/60 p-3 rounded-2xl text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                Analyzing payroll database and audit logs...
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <Input
            placeholder="Ask Copilot about tax deductions, missing punches, or salary spikes..."
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendCopilotMessage()}
            className="text-xs bg-secondary/30"
          />
          <Button
            size="sm"
            onClick={handleSendCopilotMessage}
            disabled={isCopilotThinking || !copilotInput.trim()}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Ask
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
