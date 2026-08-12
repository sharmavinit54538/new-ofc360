import { useState, useEffect } from "react";
import { useDepartmentStore, DepartmentItem } from "@/stores/departmentStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Save, X } from "lucide-react";
import { toast } from "sonner";

export function DepartmentFormDialog() {
  const { isFormOpen, editingDepartment, closeForm, addDepartment, updateDepartment, departments } =
    useDepartmentStore();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    head: "",
    manager: "",
    location: "Headquarters",
    capacity: "",
    openPositions: "",
    budget: "",
    costCenter: "",
    status: "Active" as DepartmentItem["status"],
    hiringStatus: "Open" as DepartmentItem["hiringStatus"],
    parentDepartment: "",
    extension: "",
    color: "#0d9488",
    description: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name || "",
        code: editingDepartment.code || "",
        head: editingDepartment.head || "",
        manager: editingDepartment.manager || "",
        location: editingDepartment.location || "Headquarters",
        capacity: editingDepartment.capacity ? String(editingDepartment.capacity) : "",
        openPositions: editingDepartment.openPositions ? String(editingDepartment.openPositions) : "",
        budget: editingDepartment.budget || "",
        costCenter: editingDepartment.costCenter || "",
        status: editingDepartment.status || "Active",
        hiringStatus: editingDepartment.hiringStatus || "Open",
        parentDepartment: editingDepartment.parentDepartment || "",
        extension: editingDepartment.extension || "",
        color: editingDepartment.color || "#0d9488",
        description: editingDepartment.description || "",
        notes: editingDepartment.notes || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        head: "",
        manager: "",
        location: "Headquarters",
        capacity: "",
        openPositions: "",
        budget: "",
        costCenter: "",
        status: "Active",
        hiringStatus: "Open",
        parentDepartment: "",
        extension: "",
        color: "#0d9488",
        description: "",
        notes: "",
      });
    }
    setErrors({});
  }, [editingDepartment, isFormOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Department name is required";
    if (!formData.code.trim()) errs.code = "Department code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      head: formData.head.trim(),
      manager: formData.manager.trim(),
      location: formData.location.trim(),
      employeeCount: null,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
      openPositions: formData.openPositions ? parseInt(formData.openPositions, 10) : null,
      budget: formData.budget.trim(),
      costCenter: formData.costCenter.trim(),
      status: formData.status,
      hiringStatus: formData.hiringStatus,
      parentDepartment: formData.parentDepartment,
      extension: formData.extension.trim(),
      color: formData.color,
      description: formData.description.trim(),
      notes: formData.notes.trim(),
    };

    if (editingDepartment) {
      updateDepartment(editingDepartment.id, payload);
      toast.success("Department updated successfully");
    } else {
      addDepartment(payload);
      toast.success("Department created successfully");
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent className="sm:max-w-2xl border-border/60 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {editingDepartment ? "Edit Department" : "Create New Department"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure organizational parameters, leadership, capacity, and workforce status.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Department Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Engineering & Platform"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
                {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Department Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. ENG-01"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="h-9 text-xs font-mono uppercase"
                />
                {errors.code && <p className="text-[11px] text-destructive">{errors.code}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department Head</Label>
                <Input
                  placeholder="Name of Department Head"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Reporting Manager</Label>
                <Input
                  placeholder="Name of Senior Executive Manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Office Location</Label>
                <Input
                  placeholder="e.g. Headquarters - San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Workforce & Capacity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              Workforce & Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Employee Capacity</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Open Hiring Positions</Label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={formData.openPositions}
                  onChange={(e) => setFormData({ ...formData, openPositions: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Department Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Hiring">Hiring</SelectItem>
                    <SelectItem value="Growing">Growing</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hiring Requisition</Label>
                <Select
                  value={formData.hiringStatus}
                  onValueChange={(val: any) => setFormData({ ...formData, hiringStatus: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Hierarchy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              Financial & Hierarchy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Budget Allocation</Label>
                <Input
                  placeholder="e.g. $500,000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Cost Center Code</Label>
                <Input
                  placeholder="e.g. CC-104"
                  value={formData.costCenter}
                  onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">Parent Department</Label>
                <Select
                  value={formData.parentDepartment || "none"}
                  onValueChange={(val) =>
                    setFormData({ ...formData, parentDepartment: val === "none" ? "" : val })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Parent Department (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level Department)</SelectItem>
                    {departments
                      .filter((d) => d.id !== editingDepartment?.id)
                      .map((d) => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name} ({d.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 4: Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Description & Scope</Label>
            <Textarea
              rows={3}
              placeholder="Outline department responsibilities, key operational objectives, and organizational mission..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={closeForm} className="h-9 text-xs">
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
            <Button type="submit" className="h-9 text-xs gradient-bg text-primary-foreground gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>{editingDepartment ? "Save Changes" : "Create Department"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
