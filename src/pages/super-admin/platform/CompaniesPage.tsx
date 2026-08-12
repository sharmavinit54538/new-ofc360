import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Power,
  Users,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Globe,
  HardDrive
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
  DialogTrigger,
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
import { useSuperAdminStore, PlatformCompany } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function CompaniesPage() {
  const { companies, addCompany, updateCompany, deleteCompany, toggleCompanyStatus } = useSuperAdminStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PlatformCompany | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState<"Starter" | "Growth" | "Enterprise">("Growth");
  const [status, setStatus] = useState<"Active" | "Suspended" | "Trial">("Active");
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

  const handleOpenEdit = (company: PlatformCompany) => {
    setSelectedCompany(company);
    setName(company.name);
    setDomain(company.domain);
    setPlan(company.plan);
    setStatus(company.status);
    setHrAdminName(company.hrAdminName);
    setHrAdminEmail(company.hrAdminEmail);
    setEmployeeCount(String(company.employeeCount));
    setMrr(String(company.mrr));
    setIndustry(company.industry);
    setLocation(company.location);
    setIsEditOpen(true);
  };

  const handleSaveNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim() || !hrAdminEmail.trim()) {
      toast.error("Please fill in the required company name, domain, and HR admin email.");
      return;
    }

    addCompany({
      name,
      domain,
      plan,
      status,
      hrAdminName: hrAdminName || "HR Admin",
      hrAdminEmail,
      employeeCount: parseInt(employeeCount) || 10,
      mrr: parseInt(mrr) || 1000,
      storageUsedGb: 15.0,
      industry,
      location,
    });

    toast.success(`Organization "${name}" has been successfully provisioned!`);
    setIsAddOpen(false);
    resetForm();
  };

  const handleSaveEditCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    updateCompany(selectedCompany.id, {
      name,
      domain,
      plan,
      status,
      hrAdminName,
      hrAdminEmail,
      employeeCount: parseInt(employeeCount) || 10,
      mrr: parseInt(mrr) || 1000,
      industry,
      location,
    });

    toast.success(`Organization "${name}" updated successfully.`);
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, compName: string) => {
    if (confirm(`Are you sure you want to delete workspace "${compName}"? This action cannot be undone.`)) {
      deleteCompany(id);
      toast.success(`Workspace "${compName}" removed.`);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase()) ||
      c.hrAdminEmail.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesPlan = planFilter === "ALL" || c.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

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
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                    No organizations found matching the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((c) => (
                  <TableRow key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{c.name}</p>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <Globe className="w-3 h-3 text-muted-foreground" />
                          <span>{c.domain}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50">
                        {c.plan}
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
                      {c.employeeCount} staff
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs text-foreground font-medium">{c.hrAdminName}</p>
                        <p className="text-[11px] text-muted-foreground">{c.hrAdminEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <HardDrive className="w-3.5 h-3.5 text-primary" />
                        <span>{c.storageUsedGb} GB</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ${c.mrr.toLocaleString()}
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
                          <DropdownMenuItem onClick={() => toggleCompanyStatus(c.id)} className="gap-2 cursor-pointer">
                            <Power className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{c.status === "Active" ? "Suspend Workspace" : "Activate Workspace"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(c.id, c.name)}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            <span>Delete Workspace</span>
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
              Configure tenant parameters, domain registration, and assign the primary HR administrator.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNewCompany} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Company Name *</Label>
                <Input
                  required
                  placeholder="e.g. Acme Global Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Domain *</Label>
                <Input
                  required
                  placeholder="e.g. acmecorp.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Subscription Plan</Label>
                <Select value={plan} onValueChange={(val: any) => setPlan(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter ($450/mo)</SelectItem>
                    <SelectItem value="Growth">Growth ($1,800/mo)</SelectItem>
                    <SelectItem value="Enterprise">Enterprise ($4,800/mo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Initial Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Trial">Trial (14 Days)</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">HR Admin Name</Label>
                <Input
                  placeholder="e.g. John Doe"
                  value={hrAdminName}
                  onChange={(e) => setHrAdminName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">HR Admin Email *</Label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. hr@acmecorp.com"
                  value={hrAdminEmail}
                  onChange={(e) => setHrAdminEmail(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Estimated Staff</Label>
                <Input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Monthly MRR ($)</Label>
                <Input
                  type="number"
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Industry</Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gradient-bg text-primary-foreground text-xs shadow-sm">
                Provision Workspace
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
              <span>Edit Organization Workspace</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify organization settings, subscription plan, and assigned administrator contact.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditCompany} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Company Name</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Domain</Label>
                <Input
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Plan</Label>
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
                <Label className="text-xs font-semibold">Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">HR Admin Name</Label>
                <Input
                  value={hrAdminName}
                  onChange={(e) => setHrAdminName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">HR Admin Email</Label>
                <Input
                  required
                  type="email"
                  value={hrAdminEmail}
                  onChange={(e) => setHrAdminEmail(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Staff Count</Label>
                <Input
                  type="number"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Monthly MRR ($)</Label>
                <Input
                  type="number"
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
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
