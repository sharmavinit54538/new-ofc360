import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListHRAdminDocumentsQuery,
  useCreateHRAdminDocumentMutation,
  useUpdateHRAdminDocumentMutation,
  useDeleteHRAdminDocumentMutation,
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText, Search, Plus, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, FileSearch,
} from "lucide-react";
import { DocumentStatus } from "@/types/hrAdminOnboardingApi.types";
import type { OnboardingDocument, CreateDocumentPayload, UpdateDocumentPayload } from "@/types/hrAdminOnboardingApi.types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: DocumentStatus.PENDING, label: "Pending" },
  { value: DocumentStatus.APPROVED, label: "Approved" },
  { value: DocumentStatus.REJECTED, label: "Rejected" },
];

const CATEGORIES = ["Identity", "Tax", "Education", "Employment", "Legal", "Other"];

const docBadgeVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED": return "default";
    case "REJECTED": return "destructive";
    case "PENDING": return "secondary";
    default: return "outline";
  }
};

export default function DocumentsManagementPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearchFilter(val);
    clearTimeout((window as any).__docSearchTimer);
    (window as any).__docSearchTimer = setTimeout(() => setDebouncedSearch(val), 300);
  };

  const queryFilters = useMemo(() => {
    const f: { status?: string; search?: string } = {};
    if (statusFilter) f.status = statusFilter;
    if (debouncedSearch) f.search = debouncedSearch;
    return f;
  }, [statusFilter, debouncedSearch]);

  const { data: documents, isLoading, isError, refetch } = useListHRAdminDocumentsQuery(
    Object.keys(queryFilters).length > 0 ? queryFilters : undefined
  );

  const [createDocument, { isLoading: isCreating }] = useCreateHRAdminDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] = useUpdateHRAdminDocumentMutation();
  const [deleteDocument] = useDeleteHRAdminDocumentMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<OnboardingDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OnboardingDocument | null>(null);

  const [createForm, setCreateForm] = useState<CreateDocumentPayload>({
    title: "", category: "", isRequired: false, description: "",
  });
  const [editForm, setEditForm] = useState<UpdateDocumentPayload>({});

  const handleCreate = async () => {
    if (!createForm.title?.trim()) { toast.error("Title is required."); return; }
    try {
      await createDocument(createForm).unwrap();
      toast.success("Document created!");
      setIsCreateOpen(false);
      setCreateForm({ title: "", category: "", isRequired: false, description: "" });
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const openEdit = (doc: OnboardingDocument) => {
    setEditTarget(doc);
    setEditForm({
      title: doc.title, category: doc.category, isRequired: doc.isRequired,
      description: doc.description, status: doc.status,
    });
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    try {
      await updateDocument({ id: editTarget.id, payload: editForm }).unwrap();
      toast.success("Document updated!");
      setEditTarget(null);
    } catch (err: any) {
      const norm = normalizeError(err);
      if (err?.status === 404 || norm.message?.toLowerCase().includes("not found")) {
        toast.error("This document was removed. Refreshing list...");
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
      await deleteDocument(deleteTarget.id).unwrap();
      toast.success("Document deleted.");
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
          <h2 className="text-lg font-bold">Failed to load documents</h2>
          <Button onClick={() => refetch()} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEOHead title="Onboarding Documents | OFC360" description="Manage onboarding document templates." />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Onboarding Documents
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Define required documents for new hires.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 gradient-bg text-primary-foreground">
          <Plus className="w-4 h-4" /> New Document
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

      {documents && documents.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"><FileSearch className="w-10 h-10 text-primary" /></div>
          <h3 className="text-lg font-bold text-foreground">No Documents Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{debouncedSearch || statusFilter ? "Try adjusting your filters." : "Create your first document template."}</p>
        </motion.div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {documents?.map((doc, i) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card border border-border/80 rounded-xl p-4 bg-card flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">{doc.title}</h4>
                  <Badge variant={docBadgeVariant(doc.status)} className="text-[10px] capitalize">{doc.status}</Badge>
                  {doc.isRequired && <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-600 dark:text-amber-400">Required</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{doc.category} • {doc.description || "No description"}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-muted-foreground mr-2 hidden lg:inline">{new Date(doc.createdAt).toLocaleDateString()}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(doc)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(doc)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title *</Label><Input value={createForm.title || ""} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={createForm.category || ""} onValueChange={(v) => setCreateForm({ ...createForm, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={createForm.description || ""} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} rows={3} /></div>
            <div className="flex items-center gap-3">
              <Switch id="docRequired" checked={createForm.isRequired || false} onCheckedChange={(checked) => setCreateForm({ ...createForm, isRequired: checked })} />
              <Label htmlFor="docRequired">Required document</Label>
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

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title</Label><Input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editForm.category || ""} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status || ""} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={DocumentStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={DocumentStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={DocumentStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="editDocRequired" checked={editForm.isRequired || false} onCheckedChange={(checked) => setEditForm({ ...editForm, isRequired: checked })} />
              <Label htmlFor="editDocRequired">Required document</Label>
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
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
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