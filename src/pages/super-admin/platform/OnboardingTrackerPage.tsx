import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  ArrowRight,
  Building2,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuperAdminStore, PlatformOnboardingItem } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function OnboardingTrackerPage() {
  const { onboardingItems, addOnboardingItem, deleteOnboardingItem, fastTrackOnboarding, updateOnboardingStatus } = useSuperAdminStore();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state for creating new onboarding request
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<PlatformOnboardingItem["tier"]>("Enterprise");
  const [notes, setNotes] = useState("");

  const handleFastTrack = (id: string, name: string) => {
    fastTrackOnboarding(id);
    toast.success(`Fast-track approved! Organization "${name}" has been provisioned and activated.`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteOnboardingItem(id);
    toast.success(`Onboarding application for "${name}" removed.`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    addOnboardingItem({
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      tier,
      progressPercentage: 25,
      currentStep: "Document Verification",
      status: "Pending_Review",
      notes: notes.trim() || undefined,
    });

    toast.success(`Onboarding request registered for ${companyName}!`);
    setIsAddOpen(false);
    setCompanyName("");
    setContactName("");
    setEmail("");
    setNotes("");
  };

  const filteredItems = useMemo(() => {
    return onboardingItems.filter(
      (item) =>
        !search ||
        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
        item.contactName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [onboardingItems, search]);

  const pendingCount = onboardingItems.filter((i) => i.status === "Pending_Review").length;
  const activeCount = onboardingItems.filter((i) => i.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Onboarding Tracker
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track pending enterprise workspace setups, stage verification, document uploads, and fast-track approvals.
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Application</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground font-medium">Pending Review</p>
            <div className="text-xl font-bold text-foreground">
              {pendingCount}
            </div>
            <p className="text-[11px] text-amber-600 font-medium">
              {pendingCount > 0 ? "Action Required" : "All Caught Up"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-4 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground font-medium">Fast-Track Active</p>
            <div className="text-xl font-bold text-foreground">
              {activeCount}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Operational Workspaces</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground font-medium">Avg. Completion Time</p>
            <div className="text-xl font-bold text-foreground">
              {onboardingItems.length > 0 ? "1.2 Days" : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground">Automated verification</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <FileCheck className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Search Toolbar */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pending onboardings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/40 text-xs h-9"
        />
      </div>

      {/* Onboarding Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Applicant</TableHead>
                <TableHead className="text-xs font-semibold">Requested Plan</TableHead>
                <TableHead className="text-xs font-semibold">Current Pipeline Step</TableHead>
                <TableHead className="text-xs font-semibold">Progress</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No onboarding applications found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{item.companyName}</p>
                        <p className="text-[11px] text-muted-foreground">Submitted: {item.submittedAt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-foreground">{item.contactName}</p>
                        <p className="text-[11px] text-muted-foreground">{item.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                        {item.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">{item.currentStep}</p>
                        {item.notes && <p className="text-[11px] text-muted-foreground">{item.notes}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="w-40">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                          <span>Progress</span>
                          <span>{item.progressPercentage}%</span>
                        </div>
                        <Progress value={item.progressPercentage} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          item.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : item.status === "Pending_Review"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "Active" ? (
                          <Button
                            size="sm"
                            onClick={() => handleFastTrack(item.id, item.companyName)}
                            className="gradient-bg text-primary-foreground h-7 text-xs gap-1 font-medium shadow-sm"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Fast-Track</span>
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            Approved & Active
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id, item.companyName)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Application Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Register Onboarding Application</DialogTitle>
              <DialogDescription className="text-xs">
                Submit an enterprise organization onboarding request to track setup progress and verification.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Company / Workspace Name *</Label>
                <Input
                  required
                  placeholder="e.g. Acme Global Industries"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Contact Person *</Label>
                  <Input
                    required
                    placeholder="e.g. John Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Work Email *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="john@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Subscription Tier</Label>
                <Select value={tier} onValueChange={(val: any) => setTier(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Notes / Details (Optional)</Label>
                <Input
                  placeholder="e.g. 500 employee migration"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs h-8">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gradient-bg text-primary-foreground text-xs h-8">
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
