import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  CreditCard,
  TrendingUp,
  Building2,
  MoreVertical,
  Edit2,
  RefreshCw,
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
import { SuperAdminSubscription } from "@/types/superAdmin.types";
import {
  useGetSuperAdminSubscriptionsQuery,
  useUpdateSuperAdminSubscriptionMutation,
} from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function SubscriptionsPage() {
  const { data: rawSubscriptions = [], isLoading, isFetching, refetch } = useGetSuperAdminSubscriptionsQuery();
  const subscriptions = Array.isArray(rawSubscriptions)
    ? rawSubscriptions
    : Array.isArray((rawSubscriptions as any)?.items)
    ? (rawSubscriptions as any).items
    : Array.isArray((rawSubscriptions as any)?.data)
    ? (rawSubscriptions as any).data
    : [];
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSuperAdminSubscriptionMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SuperAdminSubscription | null>(null);

  // Edit fields
  const [plan, setPlan] = useState<string>("Growth");
  const [billingCycle, setBillingCycle] = useState<string>("Monthly");
  const [amount, setAmount] = useState("299");
  const [status, setStatus] = useState<string>("Active");
  const [maxLicenses, setMaxLicenses] = useState("100");

  const totalMRR = subscriptions
    .filter((s) => s?.status === "Active")
    .reduce((sum, s) => {
      const monthlyAmount = s?.billingCycle === "Annual" ? (s.amount || 0) / 12 : (s?.amount || 0);
      return sum + monthlyAmount;
    }, 0);

  const totalActiveLicenses = subscriptions.reduce((sum, s) => sum + (s?.activeLicenses || 0), 0);

  const handleOpenEdit = (sub: SuperAdminSubscription) => {
    setSelectedSub(sub);
    setPlan(sub.plan);
    setBillingCycle(sub.billingCycle);
    setAmount(String(sub.amount));
    setStatus(sub.status);
    setMaxLicenses(String(sub.maxLicenses));
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      await updateSubscription({
        id: selectedSub.id,
        data: {
          plan,
          billingCycle,
          amount: parseInt(amount) || 299,
          status,
          maxLicenses: parseInt(maxLicenses) || 100,
        },
      }).unwrap();

      toast.success(`Subscription terms for "${selectedSub.companyName}" updated in database.`);
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update subscription.");
    }
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
            Platform Subscriptions & Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-organization SaaS contracts, monthly recurring revenue metrics, license tiers, and renewal schedules.
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
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Contracted Platform MRR</p>
            <div className="text-2xl font-bold text-foreground">
              ${totalMRR.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">ARR: ${(totalMRR * 12).toLocaleString()}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active Subscriptions</p>
            <div className="text-2xl font-bold text-foreground">
              {subscriptions.filter((s) => s.status === "Active").length}
            </div>
            <p className="text-[11px] text-muted-foreground">Across {subscriptions.length} total tenants</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Provisioned Seats</p>
            <div className="text-2xl font-bold text-foreground">{totalActiveLicenses.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground">Live employee accounts</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <CreditCard className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Automatic Renewals</p>
            <div className="text-2xl font-bold text-foreground">100%</div>
            <p className="text-[11px] text-emerald-600 font-medium">Zero billing lapses</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Filter Toolbar */}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Past_Due">Past Due</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Tiers</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
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
                <TableHead className="text-xs font-semibold">Tenant Organization</TableHead>
                <TableHead className="text-xs font-semibold">Tier & Interval</TableHead>
                <TableHead className="text-xs font-semibold">Contract Amount</TableHead>
                <TableHead className="text-xs font-semibold">License Capacity</TableHead>
                <TableHead className="text-xs font-semibold">Next Invoice Date</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading subscriptions from PostgreSQL database...
                  </TableCell>
                </TableRow>
              ) : filteredSubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No subscriptions matching your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubs.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{sub.companyName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{sub.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                          {sub.plan}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">({sub.billingCycle})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ${sub.amount.toLocaleString()}{" "}
                      <span className="text-[11px] text-muted-foreground font-normal">
                        /{sub.billingCycle === "Annual" ? "yr" : "mo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">
                          {sub.activeLicenses} / {sub.maxLicenses} seats
                        </p>
                        <div className="w-28 bg-secondary/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round((sub.activeLicenses / (sub.maxLicenses || 1)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{sub.nextBillingDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          sub.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuLabel>Billing Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEdit(sub)} className="gap-2 cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Modify Terms</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span>Modify Tenant Subscription Plan</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Adjust licensing limits, pricing terms, and billing interval for {selectedSub?.companyName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subscription Tier</Label>
                <Select value={plan} onValueChange={setPlan}>
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

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Billing Frequency</Label>
                <Select value={billingCycle} onValueChange={setBillingCycle}>
                  <SelectTrigger className="text-xs h-8">
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
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contract Amount ($)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Max Licensed Seats</Label>
                <Input
                  type="number"
                  value={maxLicenses}
                  onChange={(e) => setMaxLicenses(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subscription Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Past_Due">Past Due</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isUpdating} className="gradient-bg text-primary-foreground text-xs font-medium">
                {isUpdating ? "Saving..." : "Save Terms"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}