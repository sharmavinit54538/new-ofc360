import { useState } from "react";
import {
  ShieldCheck,
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
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
import { SuperAdminUser } from "@/types/superAdmin.types";
import {
  useGetSuperAdminUsersQuery,
  useGetSuperAdminOrganizationsQuery,
  useCreateSuperAdminUserMutation,
  useUpdateSuperAdminUserMutation,
  useDeleteSuperAdminUserMutation,
} from "@/features/super-admin/api/superAdminApi";
import { toast } from "sonner";

export default function HRAdminsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: hrAdmins = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSuperAdminUsersQuery({
    role: "hr_admin",
    search: search || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const { data: companies = [] } = useGetSuperAdminOrganizationsQuery();

  const [createUser, { isLoading: isCreating }] = useCreateSuperAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateSuperAdminUserMutation();
  const [deleteUser] = useDeleteSuperAdminUserMutation();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SuperAdminUser | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]?.id || "");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompanyId(companies[0]?.id || "");
    setSelectedAdmin(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (admin: SuperAdminUser) => {
    setSelectedAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone || "");
    setCompanyId(admin.companyId || admin.company_id || admin.organization_id || "");
    setIsEditOpen(true);
  };

  const handleSaveNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and email.");
      return;
    }

    try {
      await createUser({
        name,
        email,
        phone,
        companyId: companyId || undefined,
        role: "hr_admin",
      }).unwrap();

      toast.success(`HR Administrator "${name}" registered successfully.`);
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to register HR Admin.");
    }
  };

  const handleSaveEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      await updateUser({
        id: selectedAdmin.id,
        data: {
          name,
          phone,
        },
      }).unwrap();

      toast.success(`Administrator record for "${name}" updated.`);
      setIsEditOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update HR Admin.");
    }
  };

  const handleDelete = async (id: string, adminName: string) => {
    if (confirm(`Are you sure you want to deactivate HR Admin access for "${adminName}"?`)) {
      try {
        await deleteUser(id).unwrap();
        toast.success(`HR Admin access revoked for "${adminName}".`);
      } catch (err: any) {
        toast.error(err?.data?.detail || "Failed to revoke access.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            HR Administrators
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Designated tenant administrators, onboarding completion statuses, and workspace associations.
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
            <span>Add HR Admin</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-secondary/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Administrator</TableHead>
                <TableHead className="text-xs font-semibold">Associated Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Direct Phone</TableHead>
                <TableHead className="text-xs font-semibold">Account Status</TableHead>
                <TableHead className="text-xs font-semibold">Assigned Date</TableHead>
                <TableHead className="text-xs font-semibold">Last Active</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading HR Administrators from database...
                  </TableCell>
                </TableRow>
              ) : hrAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No HR Administrators found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                hrAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span>{admin.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <Mail className="w-3 h-3" />
                          <span>{admin.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{admin.companyName || admin.company_name || admin.organization || "Global Platform"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                        <Phone className="w-3 h-3" />
                        <span>{admin.phone || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          admin.is_active || admin.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {admin.is_active || admin.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {admin.createdAt || admin.created_at?.split("T")[0] || "2026-01-01"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {admin.lastLogin || admin.last_login || "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEdit(admin)} className="gap-2 cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Edit Record</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(admin.id, admin.name)}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            <span>Revoke Access</span>
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

      {/* Add Admin Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              <span>Designate Organization HR Admin</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign an executive or primary HR lead to manage a tenant workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNewAdmin} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Administrator Name *</Label>
              <Input
                required
                placeholder="e.g. Rachel Green"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Email Address *</Label>
              <Input
                required
                type="email"
                placeholder="e.g. rachel@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Direct Phone Number</Label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assign Organization</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger className="text-xs h-8">
                  <SelectValue placeholder="Select Organization" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isCreating} className="gradient-bg text-primary-foreground text-xs font-medium">
                {isCreating ? "Assigning..." : "Assign HR Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-primary" />
              <span>Modify HR Admin Contact</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update direct phone number and name information for this administrator.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditAdmin} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Email</Label>
              <Input
                disabled
                value={email}
                className="text-xs h-8 bg-muted font-mono opacity-80"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Direct Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-8"
              />
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