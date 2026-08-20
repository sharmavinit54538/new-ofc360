import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Building2,
  FileCheck,
  Sparkles,
  RefreshCw,
  Plus,
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
import {
  useGetSuperAdminOnboardingQuery,
  useFastTrackSuperAdminOnboardingMutation,
  useCreateSuperAdminOrganizationMutation,
} from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function OnboardingTrackerPage() {
  const { data: onboardingItems = [], isLoading, isFetching, refetch } = useGetSuperAdminOnboardingQuery();
  const [fastTrack] = useFastTrackSuperAdminOnboardingMutation();
  const [createOrganization, { isLoading: isCreating }] = useCreateSuperAdminOrganizationMutation();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state for creating new onboarding request
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<string>("Enterprise");

  const handleFastTrack = async (id: string, name: string) => {
    try {
      await fastTrack(id).unwrap();
      toast.success(`Fast-track approved! Organization "${name}" has been provisioned and activated in database.`);
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to fast-track onboarding.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await createOrganization({
        name: companyName.trim(),
        domain: `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.ofc360.com`,
        hrAdminName: contactName.trim(),
        hrAdminEmail: email.trim(),
        plan: tier,
        status: "Trial",
      }).unwrap();

      toast.success(`Onboarding request registered for ${companyName}!`);
      setIsAddOpen(false);
      setCompanyName("");
      setContactName("");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to register onboarding organization.");
    }
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
            Tenant Onboarding Tracker
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time pipeline of new tenant registrations, document verification steps, and instant activation controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-xs gap-1.5 border-border/60"
            disabled={isFetching}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Organization Onboarding</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">In Review Pipeline</p>
            <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
            <p className="text-[11px] text-amber-600 font-medium">Requires Super Admin action</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Successfully Onboarded</p>
            <div className="text-2xl font-bold text-foreground">{activeCount}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Workspaces operational</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Fast-Track Approvals</p>
            <div className="text-2xl font-bold text-foreground">Instant</div>
            <p className="text-[11px] text-primary font-medium">Bypass manual steps anytime</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tenant onboarding pipeline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Tenant Organization</TableHead>
                <TableHead className="text-xs font-semibold">Primary Contact</TableHead>
                <TableHead className="text-xs font-semibold">Selected Tier</TableHead>
                <TableHead className="text-xs font-semibold">Onboarding Progress</TableHead>
                <TableHead className="text-xs font-semibold">Current Phase</TableHead>
                <TableHead className="text-xs font-semibold">Submitted Date</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading onboarding pipeline from database...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No onboarding applications match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {item.companyName.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground">{item.companyName}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{item.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs text-foreground font-medium">{item.contactName}</p>
                        <p className="text-[11px] text-muted-foreground">{item.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                        {item.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                          <span>{item.progressPercentage}%</span>
                        </div>
                        <Progress value={item.progressPercentage} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {item.status === "Active" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span className="text-xs text-foreground font-medium">{item.currentStep}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.submittedAt}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status !== "Active" ? (
                        <Button
                          size="sm"
                          onClick={() => handleFastTrack(item.id, item.companyName)}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Fast Track</span>
                        </Button>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Complete
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Onboarding Application Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Register New Onboarding Tenant</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a customer workspace into the pipeline for validation, setup, and automated provisioning.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Company Name *</Label>
              <Input
                required
                placeholder="e.g. Acme Tech Solutions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Primary Contact Name *</Label>
              <Input
                required
                placeholder="e.g. Alex Morgan"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Contact Email *</Label>
              <Input
                required
                type="email"
                placeholder="e.g. alex@acmetech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subscription Plan</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isCreating} className="gradient-bg text-primary-foreground text-xs font-medium">
                {isCreating ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}