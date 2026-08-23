import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListHRAdminWorkflowsQuery,
  useCreateHRAdminWorkflowMutation,
  useDeleteHRAdminWorkflowMutation,
} from "@/services/api/hrAdminOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GitBranch, Plus, Trash2, Loader2, AlertCircle, RefreshCw, Layers, Star,
} from "lucide-react";
import type { CreateWorkflowPayload, Workflow } from "@/types/hrAdminOnboardingApi.types";

export default function WorkflowsManagementPage() {
  const {
    data: workflows,
    isLoading,
    isError,
    refetch,
  } = useListHRAdminWorkflowsQuery();

  const [createWorkflow, { isLoading: isCreating }] = useCreateHRAdminWorkflowMutation();
  const [deleteWorkflow] = useDeleteHRAdminWorkflowMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);
  const [form, setForm] = useState<CreateWorkflowPayload>({
    title: "", description: "", stepsCount: 5, targetRole: "", isDefault: false,
  });

  const handleCreate = async () => {
    if (!form.title?.trim()) { toast.error("Title is required."); return; }
    try {
      await createWorkflow(form).unwrap();
      toast.success("Workflow created!");
      setIsCreateOpen(false);
      setForm({ title: "", description: "", stepsCount: 5, targetRole: "", isDefault: false });
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteWorkflow(deleteTarget.id).unwrap();
      toast.success("Workflow deleted.");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
    setDeleteTarget(null);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-lg font-bold">Failed to load workflows</h2>
          <p className="text-sm text-muted-foreground">Could not fetch workflow data.</p>
          <Button onClick={() => refetch()} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEOHead title="Onboarding Workflows | OFC360" description="Manage onboarding workflows for new hires." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-primary" /> Onboarding Workflows
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage onboarding workflow templates.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-bg text-primary-foreground"><Plus className="w-4 h-4" /> New Workflow</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Create Workflow</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Engineering Onboarding" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Steps Count</Label>
                  <Input type="number" min={1} value={form.stepsCount || 5} onChange={(e) => setForm({ ...form, stepsCount: parseInt(e.target.value) || 5 })} />
                </div>
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <Input value={form.targetRole || ""} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} placeholder="e.g. Engineer" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="isDefault" checked={form.isDefault || false} onCheckedChange={(checked) => setForm({ ...form, isDefault: checked })} />
                <Label htmlFor="isDefault">Set as default workflow</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={isCreating} className="gap-2 gradient-bg text-primary-foreground">
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />} Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {workflows && workflows.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"><Layers className="w-10 h-10 text-primary" /></div>
          <h3 className="text-lg font-bold text-foreground">No Workflows Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Create your first onboarding workflow to get started.</p>
        </motion.div>
      )}

      {/* Workflow Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {workflows?.map((wf, i) => (
            <motion.div
              key={wf.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card border border-border/80 rounded-2xl p-5 bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight">{wf.title}</h4>
                    {wf.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 px-1.5 py-0.5 rounded-full mt-0.5">
                        <Star className="w-2.5 h-2.5" /> Default
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(wf)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{wf.description || "No description provided."}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                <span className="font-medium">{wf.stepsCount} steps</span>
                <span>•</span>
                <span>{wf.targetRole || "All roles"}</span>
                <span>•</span>
                <span>{new Date(wf.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This action cannot be undone.
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