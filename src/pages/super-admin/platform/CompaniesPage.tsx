import { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  HardDrive,
  Globe,
  Power,
  RefreshCw,
  Clock,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuperAdminOrganization } from "@/types/superAdmin.types";
import {
  useGetSuperAdminOrganizationsQuery,
  useCreateSuperAdminOrganizationMutation,
  useUpdateSuperAdminOrganizationMutation,
  useDeleteSuperAdminOrganizationMutation,
  useSuspendOrganizationAccessMutation,
  useReactivateOrganizationAccessMutation,
  useExtendOrganizationAccessMutation,
} from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  const {
    data: companies = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSuperAdminOrganizationsQuery({
    search: search || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    plan: planFilter !== "ALL" ? planFilter : undefined,
  });

  const [createOrganization, { isLoading: isCreating }] = useCreateSuperAdminOrganizationMutation();
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateSuperAdminOrganizationMutation();
  const [deleteOrganization] = useDeleteSuperAdminOrganizationMutation();
  const [suspendAccess] = useSuspendOrganizationAccessMutation();
  const [reactivateAccess] = useReactivateOrganizationAccessMutation();
  const [extendAccess] = useExtendOrganizationAccessMutation();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<SuperAdminOrganization | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState<string>("Growth");
  const [status, setStatus] = useState<string>("Active");
  const [hrAdminName, setHrAdminName] = useState("");
  const [hrAdminEmail, setHrAdminEmail] = useState("");
  const [employeeCount, setEmployeeCount] = useState("50");
  const [mrr, setMrr] = useState("1500");
  const [industry, setIndustry] = useState("Technology");
  const [location, setLocation] = useState("Global");

  const resetForm = () => {
    setName("");
    setDomain("");
    setPlan("Growth");
    setStatus("Active");
    setHrAdminName("");
    setHrAdminEmail("");
    setEmployeeCount("50");
    setMrr("1500");
    setIndustry("Technology");
    setLocation("Global");
    setSelectedCompany(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (company: SuperAdminOrganization) => {
    setSelectedCompany(company);
    setName(company.name);
    setDomain(company.domain || "");
    setPlan(company.plan || "Growth");
    setStatus(company.status || "Active");
    setHrAdminName(company.hr_admin?.name || company.hrAdminName || "");
    setHrAdminEmail(company.hr_admin?.email || company.hrAdminEmail || "");
    setEmployeeCount(String(company.employeeCount || company.employee_count || 10));
    setMrr(String(company.mrr || 0));
    setIndustry(company.industry || "Technology");
    setLocation(company.location || "Global");
    setIsEditOpen(true);
  };

  const handleSaveNewCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hrAdminEmail.trim()) {
      toast.error("Please fill in the required company name and HR admin email.");
      return;
    }

    try {
      await createOrganization({
        name: name.trim(),
        domain: domain.trim() || undefined,
        plan,
        status,
        hrAdminName: hrAdminName.trim() || "HR Administrator",
        hrAdminEmail: hrAdminEmail.trim().toLowerCase(),
        employeeCount: parseInt(employeeCount) || 10,
        mrr: parseFloat(mrr) || 0,
        industry,
        location,
      }).unwrap();

      toast.success(`Organization "${name}" has been successfully provisioned in PostgreSQL!`);
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to create organization.");
    }
  };

  const handleSaveEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    if (!name.trim()) {
      toast.error("Organization name is required.");
      return;
    }

    try {
      await updateOrganization({
        id: selectedCompany.id,
        data: {
          name: name.trim(),
          domain: domain.trim() || undefined,
          plan,
          status,
          hrAdminName: hrAdminName.trim() || undefined,
          hrAdminEmail: hrAdminEmail.trim().toLowerCase() || undefined,
          employeeCount: parseInt(employeeCount) || 0,
          mrr: parseFloat(mrr) || 0,
          industry,
          location,
        },
      }).unwrap();

      toast.success(`Organization "${name}" updated successfully in database.`);
      setIsEditOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update organization.");
    }
  };

  const handleToggleStatus = async (comp: SuperAdminOrganization) => {
    try {
      if (comp.status === "Active") {
        await suspendAccess(comp.id).unwrap();
        toast.success(`Workspace "${comp.name}" suspended.`);
      } else {
        await reactivateAccess(comp.id).unwrap();
        toast.success(`Workspace "${comp.name}" reactivated.`);
      }
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update status.");
    }
  };

  const handleExtendAccess = async (comp: SuperAdminOrganization) => {
    try {
      await extendAccess({ id: comp.id, days: 30 }).unwrap();
      toast.success(`Extended access for "${comp.name}" by 30 days.`);
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to extend access.");
    }
  };

  const handleDelete = async (id: string, compName: string) => {
    if (confirm(`Are you sure you want to deactivate workspace "${compName}"? This will revoke active platform licenses.`)) {
      try {
        await deleteOrganization(id).unwrap();
        toast.success(`Workspace "${compName}" deactivated.`);
      } catch (err: any) {
        toast.error(err?.data?.detail || "Failed to deactivate workspace.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Companies & Workspaces
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage organization tenants, configure subscription tiers, assign primary administrators, and monitor usage.
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
          <Button onClick={handleOpenAdd} className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Organization</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations, domains, admins..."
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
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Trial">Trial</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </div>

      {/* Companies Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Organization</TableHead>
                <TableHead className="text-xs font-semibold">Tier</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Headcount</TableHead>
                <TableHead className="text-xs font-semibold">HR Admin</TableHead>
                <TableHead className="text-xs font-semibold">Storage</TableHead>
                <TableHead className="text-xs font-semibold">MRR</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading tenants from database...
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                    No organizations found matching the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((c) => (
                  <TableRow key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{c.name}</p>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
                          {c.domain ? (
                            <span>{c.domain}</span>
                          ) : (
                            <span className="italic text-muted-foreground/70">No domain configured</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                        {c.plan || "No Plan"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          c.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : c.status === "Trial"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {c.employeeCount || c.employee_count || 0} staff
                    </TableCell>
                    <TableCell>
                      {c.hr_admin || (c.hrAdminName && c.hrAdminName.trim()) || (c.hrAdminEmail && c.hrAdminEmail.trim()) ? (
                        <div className="space-y-0.5">
                          <p className="text-xs text-foreground font-medium">
                            {c.hr_admin?.name || c.hrAdminName || "HR Admin"}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {c.hr_admin?.email || c.hrAdminEmail}
                          </p>
                          {c.hr_admins && c.hr_admins.length > 1 && (
                            <span className="inline-block text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full">
                              +{c.hr_admins.length - 1} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/70 italic">No HR Admin assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <HardDrive className="w-3.5 h-3.5 text-primary" />
                        <span>{c.storageUsedGb || 0.0} GB</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ${(c.mrr || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuLabel>Workspace Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEdit(c)} className="gap-2 cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExtendAccess(c)} className="gap-2 cursor-pointer">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Extend 30 Days</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(c)} className="gap-2 cursor-pointer">
                            <Power className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{c.status === "Active" ? "Suspend Workspace" : "Activate Workspace"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(c.id, c.name)}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            <span>Deactivate Workspace</span>
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

      {/* Add Company Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span>Provision New Organization Workspace</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a dedicated tenant environment, allocate licenses, and assign initial administrator access.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNewCompany} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company Name *</Label>
                <Input
                  required
                  placeholder="e.g. Acme Global Inc"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Workspace Domain (Optional)</Label>
                <Input
                  placeholder="e.g. acme.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary HR Admin Name</Label>
                <Input
                  placeholder="e.g. Sarah Connor"
                  value={hrAdminName}
                  onChange={(e) => setHrAdminName(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">HR Admin Email *</Label>
                <Input
                  required
                  type="email"
                  placeholder="admin@acme.com"
                  value={hrAdminEmail}
                  onChange={(e) => setHrAdminEmail(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subscription Tier</Label>
                <Select value={plan} onValueChange={(val: any) => setPlan(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter ($99/mo)</SelectItem>
                    <SelectItem value="Growth">Growth ($299/mo)</SelectItem>
                    <SelectItem value="Enterprise">Enterprise ($1500/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Initial Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Allocated Seats</Label>
                <Input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Industry Vertical</Label>
                <Input
                  placeholder="e.g. Fintech, Healthcare"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">HQ Location</Label>
                <Input
                  placeholder="e.g. San Francisco, US"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isCreating} className="gradient-bg text-primary-foreground text-xs font-medium">
                {isCreating ? "Provisioning..." : "Provision Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Company Modal Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-primary" />
              <span>Modify Workspace Configuration</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update organization profile details, subscription level, or assigned contact points.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditCompany} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company Name *</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Workspace Domain</Label>
                <Input
                  placeholder="e.g. acme.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="text-xs h-8 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary HR Admin Name</Label>
                <Input
                  value={hrAdminName}
                  onChange={(e) => setHrAdminName(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">HR Admin Email</Label>
                <Input
                  required
                  type="email"
                  value={hrAdminEmail}
                  onChange={(e) => setHrAdminEmail(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subscription Tier</Label>
                <Select value={plan} onValueChange={(val: any) => setPlan(val)}>
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
                <Label className="text-xs font-semibold">Workspace Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Seats Limit</Label>
                <Input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isUpdating} className="gradient-bg text-primary-foreground text-xs font-medium">
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
