import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Star, Calendar, AlertTriangle, SmilePlus, Send, LifeBuoy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHelpdeskStore } from "@/stores/helpdeskStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

const priorityColors: Record<string, string> = {
  Urgent: "bg-destructive/10 text-destructive",
  High: "bg-destructive/10 text-destructive",
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
};

export default function EngagementPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const { tickets = [] } = useHelpdeskStore();
  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress");

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    {
      role: "bot",
      text: "Hi! I am OFC360 HR Copilot. Ask about leave policies, salary slips, holidays, or file an internal ticket.",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "bot", text: `I received your query regarding "${userMsg}". Your HR Operations team has been notified.` },
    ]);
    setChatInput("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Engagement & Employee Support</h1>
        <p className="page-subheader">Employee pulse, feedback surveys, helpdesk tickets & HR copilot assistant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Staff", value: String(employees.length), icon: Heart },
          { label: "Helpdesk Tickets", value: String(tickets.length), icon: LifeBuoy },
          { label: "Open Issues", value: String(openTickets.length), icon: AlertTriangle },
          { label: "Support Copilot", value: "Online", icon: Star },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Helpdesk & Support</TabsTrigger>
          <TabsTrigger value="surveys">Surveys & Feedback</TabsTrigger>
          <TabsTrigger value="chatbot">HR Copilot</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Support & Grievance Tickets</CardTitle></CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No support tickets logged. Employee helpdesk tickets will appear here for resolution.
                </div>
              ) : (
                <div className="space-y-2">
                  {tickets.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <span className="text-xs font-mono text-muted-foreground w-16">{c.id}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.subject}</p>
                        <p className="text-xs text-muted-foreground">{c.employeeName} · {c.category}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${priorityColors[c.priority] || ""}`}>{c.priority}</Badge>
                      <Badge variant="secondary" className="text-xs">{c.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Pulse Surveys</CardTitle></CardHeader>
            <CardContent>
              <div className="py-8 text-center text-xs text-muted-foreground">
                No active employee pulse surveys scheduled for the current period.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><SmilePlus className="w-4 h-4 text-primary" /> HR Support Copilot</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-56 overflow-y-auto mb-4 p-2 rounded-xl bg-secondary/20 border border-border/40">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "bot" && (
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`rounded-xl px-3.5 py-2 text-xs max-w-[80%] ${m.role === "user" ? "bg-primary text-primary-foreground font-medium" : "bg-card border border-border/60"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Ask about policies, leave balance, payslip..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs"
                />
                <Button type="submit" size="sm" className="gradient-bg text-primary-foreground"><Send className="w-4 h-4" /></Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}