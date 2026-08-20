import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  KeyRound,
  Power,
  RefreshCw,
  Building2,
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
import { SuperAdminUser } from "@/types/superAdmin.types";
import { roleLabels, ROLE_OPTIONS } from "@/features/auth/authTypes";
import {
  useGetSuperAdminUsersQuery,
  useGetSuperAdminOrganizationsQuery,
  useCreateSuperAdminUserMutation,
  useUpdateSuperAdminUserMutation,
  useDeleteSuperAdminUserMutation,
  useToggleSuperAdminUserStatusMutation,
  useResetSuperAdminUserPasswordMutation,
} from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isFetching,
    refetch,
  } = useGetSuperAdminUsersQuery({
    search: search || undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    organization_id: companyFilter !== "ALL" ? companyFilter : undefined,
  });

  const { data: companies = [] } = useGetSuperAdminOrganizationsQuery();

  const [createUser, { isLoading: isCreating }] = useCreateSuperAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateSuperAdminUserMutation();
  const [deleteUser] = useDeleteSuperAdminUserMutation();
  const [toggleStatus] = useToggleSuperAdminUserStatusMutation();
  const [resetPassword] = useResetSuperAdminUserPasswordMutation();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]?.id || "");
  const [role, setRole] = useState<string>("employee");
  const [status, setStatus] = useState<string>("Active");

  const resetForm = () => {
    setName("");
    setEmail("");
    setCompanyId(companies[0]?.id || "");
    setRole("employee");
    setStatus("Active");
    setSelectedUser(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (user: SuperAdminUser) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setCompanyId(user.companyId || user.company_id || user.organization_id || "");
    setRole(user.role);
    setStatus(user.status);
    setIsEditOpen(true);
  };

  const handleSaveNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and email.");
      return;
    }

    try {
      await createUser({
        name,
        email,
        companyId: companyId || undefined,
        role,
      }).unwrap();

      toast.success(`User "${name}" created successfully in PostgreSQL.`);
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to create user.");
    }
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser({
        id: selectedUser.id,
        data: {
          name,
          role,
          status,
        },
      }).unwrap();

      toast.success(`User "${name}" updated successfully.`);
      setIsEditOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update user.");
    }
  };

  const handleToggleStatus = async (user: SuperAdminUser) => {
    try {
      await toggleStatus(user.id).unwrap();
      toast.success(`User "${user.name}" status updated.`);
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update user status.");
    }
  };

  const handleResetPassword = async (user: SuperAdminUser) => {
    try {
      await resetPassword(user.id).unwrap();
      toast.success(`Password reset instructions generated for "${user.email}".`);
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to trigger password reset.");
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (confirm(`Are you sure you want to deactivate user "${userName}"?`)) {
      try {
        await deleteUser(id).unwrap();
        toast.success(`User "${userName}" has been deactivated.`);
      } catch (err: any) {
        toast.error(err?.data?.detail || "Failed to delete user.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Users Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-tenant user directory, RBAC privilege management, account statuses, and credentials recovery.
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
            <span>Create User</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search Bar */}
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

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[120px] bg-secondary/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="h-9 text-xs w-[150px] bg-secondary/40">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Companies</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">User</TableHead>
                <TableHead className="text-xs font-semibold">Company / Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Assigned Role</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Last Active</TableHead>
                <TableHead className="text-xs font-semibold">Created Date</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isUsersLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading users from PostgreSQL database...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No platform users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{u.companyName || u.company_name || u.organization || "Global Platform"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold bg-secondary/50 gap-1">
                        <Shield className="w-2.5 h-2.5 text-primary" />
                        <span>{roleLabels[u.role as keyof typeof roleLabels] || u.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          u.is_active || u.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {u.is_active || u.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {u.lastLogin || u.last_login || "Never"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.createdAt || u.created_at?.split("T")[0] || "2026-01-01"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEdit(u)} className="gap-2 cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Edit Account</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(u)} className="gap-2 cursor-pointer">
                            <Power className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{u.is_active || u.status === "Active" ? "Deactivate Account" : "Activate Account"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(u)} className="gap-2 cursor-pointer">
                            <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Reset Credentials</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(u.id, u.name)}
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            <span>Delete User</span>
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

      {/* Add User Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Create Platform User Account</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provision a new user account across any organization tenant with specific role privileges.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNewUser} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address *</Label>
              <Input
                required
                type="email"
                placeholder="e.g. jdoe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">System Role</Label>
                <Select value={role} onValueChange={(val: any) => setRole(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Account Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isCreating} className="gradient-bg text-primary-foreground text-xs font-medium">
                {isCreating ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-primary" />
              <span>Modify User Privileges</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Adjust account permissions, assigned organization tenant, or status flag.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditUser} className="space-y-3.5 py-2">
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
              <Label className="text-xs font-semibold">Email Address (Read-only)</Label>
              <Input
                disabled
                value={email}
                className="text-xs h-8 bg-muted font-mono opacity-80"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assigned Role</Label>
                <Select value={role} onValueChange={(val: any) => setRole(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Account Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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