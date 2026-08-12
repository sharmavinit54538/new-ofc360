import { useState } from "react";
import { motion } from "framer-motion";
import { LifeBuoy, Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHelpdeskStore, SupportTicket } from "@/stores/helpdeskStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function EmployeeHelpdeskPage() {
  const { tickets, createTicket, addComment } = useHelpdeskStore();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<SupportTicket["category"]>("IT Hardware");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Filter tickets created ONLY by current logged-in employee
  const myTickets = tickets.filter(
    (t) => t.userName === user?.name || t.userEmail === user?.email
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in subject and description.");
      return;
    }

    createTicket({
      userName: user?.name || "Alex Mercer",
      userEmail: user?.email || "alex.mercer@nexahr.com",
      category,
      priority,
      subject: subject.trim(),
      description: description.trim(),
    });

    setSubject("");
    setDescription("");
    setIsModalOpen(false);
    toast.success("Support ticket created! IT & HR Support team notified.");
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyMessage.trim()) return;
    addComment(ticketId, user?.name || "Employee", replyMessage.trim());
    setReplyMessage("");
    toast.success("Reply added to ticket thread.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-primary" />
            <span>Employee Self-Service Helpdesk</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit support tickets for IT hardware, payroll queries, leave issues, and HR requests.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Create Support Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">My Support Tickets</h3>

        {myTickets.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-sm text-foreground">No active support tickets</p>
            <p className="text-xs text-muted-foreground">Click "Create Support Ticket" if you need help with IT access, salary, or HR.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-border/60 bg-secondary/20 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{t.id}</span>
                      <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                      <Badge className={t.priority === "Urgent" ? "bg-destructive/15 text-destructive text-[10px]" : "text-[10px]"}>
                        {t.priority}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm text-foreground mt-1">{t.subject}</h4>
                  </div>

                  <Badge className={t.status === "Resolved" ? "bg-emerald-500/15 text-emerald-500 text-[10px]" : "bg-amber-500/15 text-amber-500 text-[10px]"}>
                    {t.status}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed bg-background/50 p-3 rounded-lg border border-border/40">
                  {t.description}
                </p>

                {/* Comment Thread */}
                {t.comments && t.comments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <p className="text-[11px] font-bold text-muted-foreground">Comments & Activity:</p>
                    {t.comments.map((cmt) => (
                      <div key={cmt.id} className="text-xs bg-card p-2.5 rounded-lg border border-border/40 space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span className="font-bold text-foreground">{cmt.author}</span>
                          <span>{cmt.createdAt}</span>
                        </div>
                        <p className="text-muted-foreground">{cmt.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Type a reply to IT/HR support..."
                    value={activeTicket?.id === t.id ? replyMessage : ""}
                    onChange={(e) => {
                      setActiveTicket(t);
                      setReplyMessage(e.target.value);
                    }}
                    className="text-xs bg-background h-8"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSendReply(t.id)}
                    className="gradient-bg text-primary-foreground text-xs h-8 px-3 gap-1 font-bold"
                  >
                    <Send className="w-3 h-3" /> Reply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">New Support Ticket</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category *</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Hardware">IT Hardware & Laptop</SelectItem>
                    <SelectItem value="Payroll & Salary">Payroll & Payslip Query</SelectItem>
                    <SelectItem value="Leave & Attendance">Leave & Attendance Issue</SelectItem>
                    <SelectItem value="HR Query">HR Query & Policy</SelectItem>
                    <SelectItem value="General Support">General Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Priority</Label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Subject *</Label>
              <Input
                placeholder="Brief summary of the issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Description / Details *</Label>
              <Textarea
                placeholder="Describe your issue or request in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs bg-secondary/30"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9">
                Submit Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
