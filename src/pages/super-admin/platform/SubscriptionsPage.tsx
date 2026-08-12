import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  FileText,
  Building2,
  ArrowUpRight,
  MoreVertical,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuperAdminStore, PlatformSubscription } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function SubscriptionsPage() {
  const { subscriptions, updateSubscription } = useSuperAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<PlatformSubscription | null>(null);

  // Edit fields
  const [plan, setPlan] = useState<PlatformSubscription["plan"]>("Growth");
  const [billingCycle, setBillingCycle] = useState<PlatformSubscription["billingCycle"]>("Monthly");
  const [amount, setAmount] = useState("1800");
  const [status, setStatus] = useState<PlatformSubscription["status"]>("Active");
  const [maxLicenses, setMaxLicenses] = useState("300");

  const totalMRR = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((sum, s) => {
      const monthlyAmount = s.billingCycle === "Annual" ? s.amount / 12 : s.amount;
      return sum + monthlyAmount;
    }, 0);

  const totalActiveLicenses = subscriptions.reduce((sum, s) => sum + s.activeLicenses, 0);

  const handleOpenEdit = (sub: PlatformSubscription) => {
    setSelectedSub(sub);
    setPlan(sub.plan);
    setBillingCycle(sub.billingCycle);
    setAmount(String(sub.amount));
    setStatus(sub.status);
    setMaxLicenses(String(sub.maxLicenses));
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    updateSubscription(selectedSub.id, {
      plan,
      billingCycle,
      amount: parseInt(amount) || 1000,
      status,
      maxLicenses: parseInt(maxLicenses) || 100,
    });

    toast.success(`Subscription for "${selectedSub.companyName}" updated successfully.`);
    setIsEditOpen(false);
  };

  const filteredSubs = subscriptions.filter((s) => {
    const matchesSearch =
      !search ||
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesPlan = planFilter === "ALL" || s.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Subscriptions & Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage organization subscription tiers, billing renewal schedules, seat license limits, and contract values.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Contracted ARR</p>
            <div className="text-2xl font-bold text-foreground">
              ${(totalMRR * 12).toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              ${totalMRR.toLocaleString()}/mo MRR
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active User Seats</p>
            <div className="text-2xl font-bold text-foreground">{totalActiveLicenses.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground">Across {subscriptions.length} active contracts</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <CreditCard className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Payment Gateway Health</p>
            <div className="text-lg font-bold text-emerald-600">Stripe & Wire 100%</div>
            <p className="text-[11px] text-muted-foreground">Zero failed automatic retries</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions by company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Plans</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Past_Due">Past Due</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Contract ID</TableHead>
                <TableHead className="text-xs font-semibold">Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Plan Tier</TableHead>
                <TableHead className="text-xs font-semibold">Billing Frequency</TableHead>
                <TableHead className="text-xs font-semibold">License Usage</TableHead>
                <TableHead className="text-xs font-semibold">Billing Amount</TableHead>
                <TableHead className="text-xs font-semibold">Next Invoice Date</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-xs">
                    No subscriptions found matching the filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubs.map((s) => (
                  <TableRow key={s.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {s.id}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {s.companyName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                        {s.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {s.billingCycle}
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      <span className="font-semibold">{s.activeLicenses}</span> / {s.maxLicenses} seats
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ${s.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {s.nextBillingDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          s.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : s.status === "Past_Due"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(s)}
                        className="h-7 px-2 text-xs text-primary gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Modify</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modify Subscription Modal Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Modify Subscription Contract</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update billing amount, plan tier, license limits, and renewal status for {selectedSub?.companyName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Plan Tier</Label>
                <Select value={plan} onValueChange={(val: any) => setPlan(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Billing Frequency</Label>
                <Select value={billingCycle} onValueChange={(val: any) => setBillingCycle(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Contract Amount ($)</Label>
                <Input
                  required
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Max Seat Licenses</Label>
                <Input
                  required
                  type="number"
                  value={maxLicenses}
                  onChange={(e) => setMaxLicenses(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Contract Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Past_Due">Past Due</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gradient-bg text-primary-foreground text-xs shadow-sm">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
