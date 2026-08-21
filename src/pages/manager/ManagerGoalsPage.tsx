import { useState } from "react";
import { Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  assignee: string;
  targetDate: string;
  progress: number;
  category: string;
}

export default function ManagerGoalsPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const [goals, setGoals] = useState<Goal[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [targetDate, setTargetDate] = useState("Q4 2026");

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !assignee) {
      toast.error("Please provide goal title and select an assignee.");
      return;
    }

    const newGoal: Goal = {
      id: `g-${Date.now().toString().slice(-4)}`,
      title: goalTitle.trim(),
      assignee,
      targetDate,
      progress: 0,
      category: "Quarterly OKR",
    };

    setGoals((prev) => [newGoal, ...prev]);
    setGoalTitle("");
    setIsModalOpen(false);
    toast.success(`Assigned goal "${goalTitle}" to ${assignee}!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Team Goals & Performance OKRs</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Assign team key results, monitor completion percentages, and review quarterly progress.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Team Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 text-xs text-muted-foreground">
          No team goals assigned for the current cycle. Click "Create Team Goal" to assign key results to team members.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g) => (
            <div key={g.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                  {g.category}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{g.targetDate}</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm text-foreground leading-snug">{g.title}</h4>
                <p className="text-xs text-muted-foreground">Assigned to: <span className="font-semibold text-foreground">{g.assignee}</span></p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Completion Progress</span>
                  <span className="text-primary font-mono">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-2 bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Assign New Team Goal</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Goal Objective / Title *</Label>
              <Input
                placeholder="Describe key result objective..."
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Assign to Team Member *</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue placeholder="Select direct report..." /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.name} className="text-xs">
                      {emp.name} ({emp.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Target Timeline</Label>
              <Input value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="text-xs bg-secondary/30" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9 cursor-pointer">
                Assign Goal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}