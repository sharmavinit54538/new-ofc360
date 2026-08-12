import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus
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
import { useSuperAdminStore, PlatformHRAdmin } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function HRAdminsPage() {
  const { hrAdmins, companies, addHRAdmin, updateHRAdmin, deleteHRAdmin } = useSuperAdminStore();

  const [search, setSearch] = useState("");
  const [onboardingFilter, setOnboardingFilter] = useState("ALL");

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<PlatformHRAdmin | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]?.id || "COMP-101");
  const [onboardingStatus, setOnboardingStatus] = useState<PlatformHRAdmin["onboardingStatus"]>("Completed");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompanyId(companies[0]?.id || "COMP-101");
    setOnboardingStatus("Completed");
    setSelectedAdmin(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (admin: PlatformHRAdmin) => {
    setSelectedAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone);
    setCompanyId(admin.companyId);
    setOnboardingStatus(admin.onboardingStatus);
    setIsEditOpen(true);
  };

  const handleSaveNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter the administrator's full name and email.");
      return;
    }

    const comp = companies.find((c) => c.id === companyId);
    const companyName = comp ? comp.name : "Enterprise Workspace";

    addHRAdmin({
      name,
      email,
      phone: phone || "+1 (555) 000-0000",
      companyId,
      companyName,
      onboardingStatus,
    });

    toast.success(`HR Administrator "${name}" provisioned for ${companyName}.`);
    setIsAddOpen(false);
    resetForm();
  };

  const handleSaveEditAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    const comp = companies.find((c) => c.id === companyId);
    const companyName = comp ? comp.name : selectedAdmin.companyName;

    updateHRAdmin(selectedAdmin.id, {
      name,
      email,
      phone,
      companyId,
      companyName,
      onboardingStatus,
    });

    toast.success(`Administrator details for "${name}" updated.`);
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, adminName: string) => {
    if (confirm(`Remove administrator "${adminName}"?`)) {
      deleteHRAdmin(id);
      toast.success(`HR Administrator "${adminName}" removed.`);
    }
  };

  const filteredAdmins = hrAdmins.filter((a) => {
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = onboardingFilter === "ALL" || a.onboardingStatus === onboardingFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            HR Administrators
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Directory of tenant primary HR administrators, setup status, workspace assignments, and contact channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={handleOpenAdd} className="gradient-bg text-primary-foreground h-9 text-xs gap-1.5 font-medium shadow-sm">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Provision HR Admin</span>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search administrators, workspace, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={onboardingFilter} onValueChange={setOnboardingFilter}>
            <SelectTrigger className="h-9 text-xs w-[170px] bg-secondary/40">
              <SelectValue placeholder="Onboarding Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Setup Statuses</SelectItem>
              <SelectItem value="Completed">Setup Completed</SelectItem>
              <SelectItem value="In_Progress">In Progress</SelectItem>
              <SelectItem value="Pending">Pending Setup</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* HR Admins Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Administrator</TableHead>
                <TableHead className="text-xs font-semibold">Assigned Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Contact Info</TableHead>
                <TableHead className="text-xs font-semibold">Workspace Setup</TableHead>
                <TableHead className="text-xs font-semibold">Assigned Date</TableHead>
                <TableHead className="text-xs font-semibold">Activity</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No HR administrators found matching the filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((a) => (
                  <TableRow key={a.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {a.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground">{a.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{a.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {a.phone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          a.onboardingStatus === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : a.onboardingStatus === "In_Progress"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {a.onboardingStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {a.assignedAt}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {a.lastActive}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuLabel>Admin Options</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEdit(a)} className="gap-2 cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(a.id, a.name)}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            <span>Remove Admin</span>
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

      {/* Provision HR Admin Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Provision HR Administrator</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign a new workspace administrator to manage employee lifecycle and organizational configuration.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNewAdmin} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                required
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Email *</Label>
              <Input
                required
                type="email"
                placeholder="e.g. sarah.j@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Phone Number</Label>
              <Input
                placeholder="e.g. +1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Assigned Workspace</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Workspace Setup Status</Label>
              <Select value={onboardingStatus} onValueChange={(val: any) => setOnboardingStatus(val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In_Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gradient-bg text-primary-foreground text-xs shadow-sm">
                Provision Admin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Modal Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-primary" />
              <span>Edit Administrator Details</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify contact channels or reassign workspace mapping.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditAdmin} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Email</Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Assigned Workspace</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Status</Label>
              <Select value={onboardingStatus} onValueChange={(val: any) => setOnboardingStatus(val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In_Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
