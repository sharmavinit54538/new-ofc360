import { useState } from "react";
import { Heart, Award, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { toast } from "sonner";

interface Kudos {
  id: string;
  from: string;
  to: string;
  message: string;
  date: string;
}

export default function ManagerEngagementPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const [kudosList, setKudosList] = useState<Kudos[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [kudosMsg, setKudosMsg] = useState("");

  const handleSendKudos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !kudosMsg.trim()) {
      toast.error("Please select a team member and type a recognition message.");
      return;
    }

    const newKudos: Kudos = {
      id: `k-${Date.now().toString().slice(-4)}`,
      from: "Manager",
      to: selectedRecipient,
      message: kudosMsg.trim(),
      date: "Just now",
    };

    setKudosList((prev) => [newKudos, ...prev]);
    setKudosMsg("");
    toast.success(`Kudos & Recognition sent to ${selectedRecipient}! 🎉`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Team Engagement & Morale Hub</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Send peer recognition kudos and review engagement feedback.
          </p>
        </div>
      </div>

      {/* Engagement Pulse Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Total Team Members</span>
          <p className="text-2xl font-extrabold text-foreground font-mono">{employees.length}</p>
          <span className="text-[11px] text-muted-foreground">Active Staff</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Kudos Sent</span>
          <p className="text-2xl font-extrabold text-primary font-mono">{kudosList.length}</p>
          <span className="text-[11px] text-muted-foreground">Team Recognitions</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Engagement Status</span>
          <p className="text-2xl font-extrabold text-emerald-500 font-mono">Active</p>
          <span className="text-[11px] text-muted-foreground">Pulse Tracking</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Send Kudos Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4 shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>Send Kudos & Recognition</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acknowledge great work and boost team morale.
            </p>
          </div>

          <form onSubmit={handleSendKudos} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold">Recipient Team Member *</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full h-9 rounded-lg border border-border/60 bg-secondary/30 px-3 text-xs"
              >
                <option value="">Select team member...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} — {emp.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold">Kudos Message *</label>
              <Input
                placeholder="Write an appreciative message..."
                value={kudosMsg}
                onChange={(e) => setKudosMsg(e.target.value)}
                className="text-xs bg-secondary/30 h-9"
              />
            </div>

            <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9 w-full gap-1.5 cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Send Recognition
            </Button>
          </form>
        </div>

        {/* Kudos Stream (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-foreground">Recent Team Recognition Feed</h3>

          {kudosList.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 text-xs text-muted-foreground">
              No kudos or recognitions sent yet. Select a team member to send the first recognition!
            </div>
          ) : (
            <div className="space-y-3">
              {kudosList.map((k) => (
                <div key={k.id} className="p-4 rounded-xl border border-border/60 bg-secondary/20 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">🎉 {k.to}</span>
                      <span className="text-[11px] text-muted-foreground">from {k.from}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{k.date}</span>
                  </div>
                  <p className="text-xs text-foreground/90 italic leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/40">
                    "{k.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}