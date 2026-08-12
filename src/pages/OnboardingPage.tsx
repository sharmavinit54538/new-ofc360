import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, FileText, Shield, CheckCircle2, Circle, Clock, Upload, MessageSquare, Package, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useGetOnboardingTasksQuery, useGetOnboardingProgressQuery } from "@/services/api/onboardingApi";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { data: tasks = [], isLoading: isLoadingTasks } = useGetOnboardingTasksQuery(undefined);
  const { data: progressData } = useGetOnboardingProgressQuery(undefined);

  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: "Welcome to OFC360 Policy Intelligence. I can explain workspace policies, NDA clauses, leave structures, and IT onboarding setup.",
    },
  ]);

  const handleSendChat = (textToSend?: string) => {
    const q = textToSend || chatQuery;
    if (!q.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: q }]);
    if (!textToSend) setChatQuery("");

    setTimeout(() => {
      let reply = "All policies are configured in your organization settings.";
      if (q.toLowerCase().includes("leave")) reply = "Standard leave quota includes 12 Earned Leaves, 6 Casual Leaves, and 6 Sick Leaves annually.";
      if (q.toLowerCase().includes("hours") || q.toLowerCase().includes("work")) reply = "Standard working hours are 09:00 AM to 06:00 PM Monday through Friday.";
      if (q.toLowerCase().includes("dress")) reply = "Business casual attire is recommended for office workdays.";
      if (q.toLowerCase().includes("remote")) reply = "Hybrid and remote work arrangements require manager approval.";
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 500);
  };

  const invitesList = progressData?.invites || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Employee Onboarding Dashboard</h1>
        <p className="page-subheader">Monitor onboarding progress, active invitations, and document verification status.</p>
      </div>

      {/* Invites / New Hires Progress */}
      {invitesList.length > 0 ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {invitesList.map((hire, idx) => (
            <Card key={idx} className="glass-card-hover">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {hire.email.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{hire.email}</p>
                    <p className="text-xs text-muted-foreground">{hire.role || "Employee"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Invited</Badge>
                  </div>
                  <Progress value={35} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl glass-card border border-dashed border-border/60 text-center space-y-2">
          <Inbox className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-xs font-bold text-foreground">No active employee onboarding invites</p>
          <p className="text-[11px] text-muted-foreground">
            Invite new team members during HR Admin Onboarding or from the Employee Directory.
          </p>
        </div>
      )}

      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist">Joining Checklist</TabsTrigger>
          <TabsTrigger value="documents">Document Verification</TabsTrigger>
          <TabsTrigger value="chatbot">Policy AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Onboarding Tasks Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      {item.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${item.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{item.category} • Assigned to {item.assigned_to}</p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${item.is_completed ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                        {item.is_completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Package className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">No onboarding checklist tasks found</p>
                  <p className="text-[11px] text-muted-foreground">
                    Checklist tasks will automatically populate when new hires commence onboarding.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Document Compliance Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center space-y-2">
                <FileText className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                <p className="text-xs font-semibold text-foreground">No submitted verification documents pending audit</p>
                <p className="text-[11px] text-muted-foreground">
                  Employee uploaded identity proofs (Aadhaar, PAN, Bank details) will appear here for verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>OFC360 Policy Intelligence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto p-3 rounded-xl bg-secondary/20 border border-border/40">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && (
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`rounded-xl px-3 py-2 text-xs max-w-[80%] ${msg.sender === "user" ? "bg-primary text-primary-foreground font-medium" : "bg-card border border-border/60 text-foreground"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about company policies, leave rules..."
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  className="text-xs h-10"
                />
                <Button onClick={() => handleSendChat()} className="gradient-bg text-xs h-10 px-4">
                  Send
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Leave policy", "Work hours", "Dress code", "Remote work"].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSendChat(p)}
                    className="text-[11px] px-3 py-1 rounded-full border border-border/60 hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground font-medium"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
