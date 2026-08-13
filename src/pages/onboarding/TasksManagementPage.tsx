import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListHRAdminTasksQuery,
  useCreateHRAdminTaskMutation,
  useUpdateHRAdminTaskMutation,
  useDeleteHRAdminTaskMutation,
} from "@/services/api/hrAdminOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ListChecks, Search, Plus, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, ClipboardList, Clock,
} from "lucide-react";
import { TaskStatus } from "@/types/hrAdminOnboardingApi.types";
import type { OnboardingTask, CreateTaskPayload, UpdateTaskPayload } from "@/types/hrAdminOnboardingApi.types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: TaskStatus.PENDING, label: "Pending" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.COMPLETED, label: "Completed" },
];

const taskBadgeVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED": return "default";
    case "IN_PROGRESS": return "secondary";
    case "PENDING": return "outline";
    default: return "outline";
  }
};

export default function TasksManagementPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearchFilter(val);
    clearTimeout((window as any).__taskSearchTimer);
    (window as any).__taskSearchTimer = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const queryFilters = useMemo(() => {
    const f: { status?: string; search?: string } = {};
    if (statusFilter) f.status = statusFilter;
    if (debouncedSearch) f.search = debouncedSearch;
    return f;
  }, [statusFilter, debouncedSearch]);

  const { data: tasks, isLoading, isError, refetch } = useListHRAdminTasksQuery(
    Object.keys(queryFilters).length > 0 ? queryFilters : undefined
  );

  const [createTask, { isLoading: isCreating }] = useCreateHRAdminTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateHRAdminTaskMutation();
  const [deleteTask] = useDeleteHRAdminTaskMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OnboardingTask | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OnboardingTask | null>(null);

  const [createForm, setCreateForm] = useState<CreateTaskPayload>({
    title: "", assigneeRole: "", dueDaysOffset: 1, description: "",
  });
  const [editForm, setEditForm] = useState<UpdateTaskPayload>({});

  const handleCreate = async () => {
    if (!createForm.title?.trim()) { toast.error("Title is required."); return; }
    try {
      await createTask(createForm).unwrap();
      toast.success("Task created!");
      setIsCreateOpen(false);
      setCreateForm({ title: "", assigneeRole: "", dueDaysOffset: 1, description: "" });
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const openEdit = (task: OnboardingTask) => {
    setEditTarget(task);
    setEditForm({
      title: task.title, assigneeRole: task.assigneeRole,
      dueDaysOffset: task.dueDaysOffset, description: task.description,
      status: task.status,
    });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    try {
      await updateTask({ id: editTarget.id, payload: editForm }).unwrap();
      toast.success("Task updated!");
      setEditTarget(null);
    } catch (err: any) {
      const norm = normalizeError(err);
      if (err?.status === 404 || norm.message?.toLowerCase().includes("not found")) {
        toast.error("This task was removed. Refreshing list...");
        refetch();
      } else {
        toast.error(norm.message);
      }
      setEditTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id).unwrap();
      toast.success("Task deleted.");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between"><Skeleton className="h-8 w-48" /><Skeleton className="h-10 w-40" /></div>
        <div className="flex gap-3"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-48" /></div>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-lg font-bold">Failed to load tasks</h2>
          <Button onClick={() => refetch()} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEOHead title="Onboarding Tasks | OFC360" description="Manage onboarding task templates." />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-primary" /> Onboarding Tasks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Define tasks assigned during onboarding.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 gradient-bg text-primary-foreground">
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title..." value={searchFilter} onChange={(e) => handleSearchChange(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>{STATUS_OPTIONS.map((opt) => <SelectItem key={opt.value || "all"} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {tasks && tasks.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"><ClipboardList className="w-10 h-10 text-primary" /></div>
          <h3 className="text-lg font-bold text-foreground">No Tasks Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{debouncedSearch || statusFilter ? "Try adjusting your filters." : "Create your first task template."}</p>
        </motion.div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {tasks?.map((task, i) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card border border-border/80 rounded-xl p-4 bg-card flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ListChecks className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">{task.title}</h4>
                  <Badge variant={taskBadgeVariant(task.status)} className="text-[10px] capitalize">{task.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {task.assigneeRole || "Unassigned"} • {task.description || "No description"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                  <Clock className="w-3 h-3" />
                  <span>Due +{task.dueDaysOffset}d</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(task)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(task)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title *</Label><Input value={createForm.title || ""} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} placeholder="e.g. Set up workstation" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Assignee Role</Label><Input value={createForm.assigneeRole || ""} onChange={(e) => setCreateForm({ ...createForm, assigneeRole: e.target.value })} placeholder="e.g. IT Admin" /></div>
              <div className="space-y-2"><Label>Due Days Offset</Label><Input type="number" min={0} value={createForm.dueDaysOffset || 1} onChange={(e) => setCreateForm({ ...createForm, dueDaysOffset: parseInt(e.target.value) || 1 })} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={createForm.description || ""} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating} className="gap-2 gradient-bg text-primary-foreground">
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title</Label><Input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Assignee Role</Label><Input value={editForm.assigneeRole || ""} onChange={(e) => setEditForm({ ...editForm, assigneeRole: e.target.value })} /></div>
              <div className="space-y-2"><Label>Due Days Offset</Label><Input type="number" min={0} value={editForm.dueDaysOffset ?? 1} onChange={(e) => setEditForm({ ...editForm, dueDaysOffset: parseInt(e.target.value) || 1 })} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status || ""} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating} className="gap-2 gradient-bg text-primary-foreground">
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
