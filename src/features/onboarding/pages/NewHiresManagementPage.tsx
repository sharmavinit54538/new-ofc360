import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListHRAdminNewHiresQuery,
  useCreateHRAdminNewHireMutation,
  useUpdateHRAdminNewHireMutation,
  useDeleteHRAdminNewHireMutation,
} from "@/services/api/hrAdminOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";
import { toast } from "sonner";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  UserPlus, Search, Plus, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, Users,
} from "lucide-react";
import { NewHireStatus } from "@/types/hrAdminOnboardingApi.types";
import type { NewHire, CreateNewHirePayload, UpdateNewHirePayload } from "@/types/hrAdminOnboardingApi.types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: NewHireStatus.INVITED, label: "Invited" },
  { value: NewHireStatus.IN_PROGRESS, label: "In Progress" },
  { value: NewHireStatus.COMPLETED, label: "Completed" },
];

const statusBadgeVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED": return "default";
    case "IN_PROGRESS": return "secondary";
    case "INVITED": return "outline";
    default: return "outline";
  }
};

export default function NewHiresManagementPage() {
  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const handleSearchChange = (val: string) => {
    setSearchFilter(val);
    clearTimeout((window as any).__nhSearchTimer);
    (window as any).__nhSearchTimer = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const queryFilters = useMemo(() => {
    const f: { status?: string; search?: string } = {};
    if (statusFilter) f.status = statusFilter;
    if (debouncedSearch) f.search = debouncedSearch;
    return f;
  }, [statusFilter, debouncedSearch]);

  const { data: newHires, isLoading, isError, refetch } = useListHRAdminNewHiresQuery(
    Object.keys(queryFilters).length > 0 ? queryFilters : undefined
  );

  const [createNewHire, { isLoading: isCreating }] = useCreateHRAdminNewHireMutation();
  const [updateNewHire, { isLoading: isUpdating }] = useUpdateHRAdminNewHireMutation();
  const [deleteNewHire] = useDeleteHRAdminNewHireMutation();

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<NewHire | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewHire | null>(null);

  const [createForm, setCreateForm] = useState<CreateNewHirePayload>({
    fullName: "", email: "", department: "", role: "", startDate: "", workflowId: "",
  });
  const [editForm, setEditForm] = useState<UpdateNewHirePayload>({});

  const handleCreate = async () => {
    if (!createForm.fullName?.trim()) { toast.error("Full name is required."); return; }
    if (!createForm.email?.trim()) { toast.error("Email is required."); return; }
    try {
      await createNewHire(createForm).unwrap();
      toast.success("New hire added!");
      setIsCreateOpen(false);
      setCreateForm({ fullName: "", email: "", department: "", role: "", startDate: "", workflowId: "" });
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const openEdit = (hire: NewHire) => {
    setEditTarget(hire);
    setEditForm({
      fullName: hire.fullName, email: hire.email, department: hire.department,
      role: hire.role, startDate: hire.startDate, status: hire.status,
      progressPercentage: hire.progressPercentage,
    });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    try {
      await updateNewHire({ id: editTarget.id, payload: editForm }).unwrap();
      toast.success("New hire updated!");
      setEditTarget(null);
    } catch (err: any) {
      const norm = normalizeError(err);
      if (err?.status === 404 || norm.message?.toLowerCase().includes("not found")) {
        toast.error("This new hire was removed. Refreshing list...");
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
      await deleteNewHire(deleteTarget.id).unwrap();
      toast.success("New hire removed.");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
    setDeleteTarget(null);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between"><Skeleton className="h-8 w-48" /><Skeleton className="h-10 w-40" /></div>
        <div className="flex gap-3"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-48" /></div>
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass-card p-8 rounded-2xl border border-destructive/20 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-lg font-bold">Failed to load new hires</h2>
          <Button onClick={() => refetch()} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEOHead title="New Hires | OFC360" description="Manage onboarding new hires." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" /> New Hires
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Track and manage employees being onboarded.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 gradient-bg text-primary-foreground">
          <Plus className="w-4 h-4" /> Add New Hire
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchFilter}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => <SelectItem key={opt.value || "all"} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Empty */}
      {newHires && newHires.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"><Users className="w-10 h-10 text-primary" /></div>
          <h3 className="text-lg font-bold text-foreground">No New Hires Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{debouncedSearch || statusFilter ? "Try adjusting your filters." : "Add your first new hire to get started."}</p>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {newHires?.map((hire, i) => (
            <motion.div
              key={hire.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card border border-border/80 rounded-xl p-4 bg-card flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {hire.fullName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">{hire.fullName}</h4>
                  <Badge variant={statusBadgeVariant(hire.status)} className="text-[10px] capitalize">{hire.status?.replace("_", " ") || "Unknown"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{hire.email} • {hire.department} • {hire.role}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Progress value={hire.progressPercentage} className="h-1.5 flex-1 max-w-[200px]" />
                  <span className="text-[10px] font-medium text-muted-foreground">{hire.progressPercentage}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-muted-foreground mr-2 hidden lg:inline">Start: {hire.startDate}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(hire)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(hire)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add New Hire</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Full Name *</Label><Input value={createForm.fullName || ""} onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })} /></div>
              <div className="space-y-2 col-span-2"><Label>Email *</Label><Input type="email" value={createForm.email || ""} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Department</Label><Input value={createForm.department || ""} onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={createForm.role || ""} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} /></div>
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={createForm.startDate || ""} onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>Workflow ID</Label><Input value={createForm.workflowId || ""} onChange={(e) => setCreateForm({ ...createForm, workflowId: e.target.value })} placeholder="Optional" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isCreating} className="gap-2 gradient-bg text-primary-foreground">
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />} Add Hire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit New Hire</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Full Name</Label><Input value={editForm.fullName || ""} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} /></div>
              <div className="space-y-2 col-span-2"><Label>Email</Label><Input type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Department</Label><Input value={editForm.department || ""} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={editForm.role || ""} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} /></div>
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={editForm.startDate || ""} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status || ""} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NewHireStatus.INVITED}>Invited</SelectItem>
                    <SelectItem value={NewHireStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={NewHireStatus.COMPLETED}>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Progress %</Label><Input type="number" min={0} max={100} value={editForm.progressPercentage ?? 0} onChange={(e) => setEditForm({ ...editForm, progressPercentage: parseInt(e.target.value) || 0 })} /></div>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove New Hire?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>"{deleteTarget?.fullName}"</strong> from onboarding?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}