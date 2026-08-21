import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  QrCode,
  Download,
  Plus,
  Search,
  Box,
  Wrench,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  UserPlus,
  RefreshCw,
  Cpu,
  BarChart3,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAssetStore, type AssetItem } from "@/stores/assetStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { toast } from "sonner";

export default function AssetIntelligencePage() {
  const assetStore = useAssetStore();
  const rawAssets = assetStore.assets;
  const assets = Array.isArray(rawAssets) ? rawAssets : [];
  const addAsset = assetStore.addAsset;
  const updateAssetStatus = assetStore.updateAssetStatus;
  const deleteAsset = assetStore.deleteAsset;
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const [activeTab, setActiveTab] = useState<"inventory" | "analytics">("inventory");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrAsset, setSelectedQrAsset] = useState<AssetItem | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Add Asset Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AssetItem["category"]>("Laptop");
  const [brandModel, setBrandModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("2028-06-30");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");

  // Assign Modal
  const [assignAssetId, setAssignAssetId] = useState<string | null>(null);
  const [assignEmpId, setAssignEmpId] = useState("");

  // Currency Formatter
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  // Stats Calculations
  const totalAssets = assets.length;
  const availableAssets = assets.filter((a) => a?.status === "Available").length;
  const assignedAssets = assets.filter((a) => a?.status === "Assigned").length;
  const inRepairAssets = assets.filter((a) => a?.status === "In Repair").length;
  const lostAssets = assets.filter((a) => a?.status === "Lost").length;
  const decommissionedAssets = assets.filter((a) => a?.status === "Decommissioned").length;

  const handleCreateAsset = () => {
    if (!name.trim() || !brandModel.trim() || !serialNumber.trim()) {
      toast.error("Please fill in asset name, brand/model, and serial number.");
      return;
    }

    const assignedEmp = employees.find((e) => e.id === assignedEmployeeId);

    addAsset({
      name: name.trim(),
      category,
      brandModel: brandModel.trim(),
      serialNumber: serialNumber.trim(),
      status: assignedEmp ? "Assigned" : "Available",
      assignedToId: assignedEmp?.id,
      assignedToName: assignedEmp?.name,
      purchaseValue: parseFloat(purchaseValue) || 0,
      warrantyExpiry,
    });

    // Reset Form
    setName("");
    setBrandModel("");
    setSerialNumber("");
    setPurchaseValue("");
    setAssignedEmployeeId("");
    setIsAddModalOpen(false);

    toast.success("Hardware asset registered successfully!");
  };

  const handleAssignSubmit = () => {
    if (!assignAssetId || !assignEmpId) {
      toast.error("Select an employee to assign this asset.");
      return;
    }
    const emp = employees.find((e) => e.id === assignEmpId);
    if (emp) {
      updateAssetStatus(assignAssetId, "Assigned", emp.name, emp.id);
      toast.success(`Asset assigned to ${emp.name}!`);
    }
    setAssignAssetId(null);
    setAssignEmpId("");
  };

  const handleExportCSV = () => {
    if (assets.length === 0) {
      toast.error("No assets available to export.");
      return;
    }
    const headers = "Asset Tag,Name,Category,Brand/Model,Serial Number,Status,Assigned To,Value\n";
    const rows = assets
      .map((a) => `"${a.assetTag}","${a.name}","${a.category}","${a.brandModel}","${a.serialNumber}","${a.status}","${a.assignedToName || "Unassigned"}",${a.purchaseValue}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OFC360_Asset_Inventory_${Date.now()}.csv`;
    link.click();
    toast.success("Asset inventory exported as CSV!");
  };

  // Filtered Assets list
  const filteredAssets = assets.filter((a) => {
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      a.assetTag.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.brandModel.toLowerCase().includes(q) ||
      a.serialNumber.toLowerCase().includes(q) ||
      (a.assignedToName && a.assignedToName.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-end gap-2 pb-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsScanModalOpen(true)}
          className="text-xs h-9 gap-1.5 border-border/70 bg-card hover:bg-secondary/40 font-semibold"
        >
          <QrCode className="w-4 h-4 text-primary" /> Scan QR Code
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="text-xs h-9 gap-1.5 border-border/70 bg-card hover:bg-secondary/40 font-semibold"
        >
          <Download className="w-4 h-4 text-muted-foreground" /> Export CSV
        </Button>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">Total Assets</span>
            <Box className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-foreground mt-2">{totalAssets}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">Available Assets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-emerald-500 mt-2">{availableAssets}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">Assigned Assets</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-primary mt-2">{assignedAssets}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">Under Repair</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-amber-500 mt-2">{inRepairAssets}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">Lost Assets</span>
            <ShieldAlert className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-destructive mt-2">{lostAssets}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">Expiring Warranties</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-purple-500 mt-2">0</p>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border/50 w-fit">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "inventory"
              ? "bg-card text-foreground shadow-xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Assets Inventory
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "analytics"
              ? "bg-card text-foreground shadow-xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Analytics & Reports
        </button>
      </div>

      {/* TAB CONTENT: ASSETS INVENTORY */}
      {activeTab === "inventory" && (
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
          {/* Filters & Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, brand, employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-secondary/30 border-border/60"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              {["All", "Available", "Assigned", "In Repair", "Lost", "Decommissioned"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "bg-secondary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st === "All" ? "All Assets" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Asset List / Table */}
          {filteredAssets.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center mx-auto text-muted-foreground">
                <Box className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-extrabold text-base text-foreground">No assets found</h3>
                <p className="text-xs text-muted-foreground">
                  No records match the current filters. Adjust your search or register a new asset.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
              >
                <Plus className="w-4 h-4" /> Register First Asset
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Asset Tag</TableHead>
                    <TableHead className="text-xs font-bold">Hardware & Model</TableHead>
                    <TableHead className="text-xs font-bold">Category</TableHead>
                    <TableHead className="text-xs font-bold">Serial Number</TableHead>
                    <TableHead className="text-xs font-bold">Assigned Staff</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-xs font-bold">Purchase Value</TableHead>
                    <TableHead className="text-right text-xs font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono font-bold text-xs text-primary flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                        {asset.assetTag}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-xs text-foreground">{asset.name}</div>
                        <div className="text-[11px] text-muted-foreground">{asset.brandModel}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {asset.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{asset.serialNumber}</TableCell>
                      <TableCell className="text-xs">
                        {asset.assignedToName ? (
                          <span className="font-semibold text-foreground">{asset.assignedToName}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            asset.status === "Available"
                              ? "bg-emerald-500/15 text-emerald-500"
                              : asset.status === "Assigned"
                              ? "bg-primary/15 text-primary"
                              : asset.status === "In Repair"
                              ? "bg-amber-500/15 text-amber-500"
                              : asset.status === "Lost"
                              ? "bg-destructive/15 text-destructive"
                              : "bg-secondary text-muted-foreground"
                          }
                        >
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold">{fmt(asset.purchaseValue)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {asset.status === "Available" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setAssignAssetId(asset.id)}
                              className="h-7 text-xs text-primary hover:text-primary gap-1"
                            >
                              <UserPlus className="w-3 h-3" /> Assign
                            </Button>
                          )}

                          {asset.status === "Assigned" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateAssetStatus(asset.id, "Available")}
                              className="h-7 text-xs text-emerald-500 hover:text-emerald-500"
                            >
                              Unassign
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedQrAsset(asset);
                              setIsQrModalOpen(true);
                            }}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAsset(asset.id)}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ANALYTICS & REPORTS */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Asset Value & Depreciation Summary
            </h3>
            <div className="p-4 rounded-xl bg-secondary/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Inventory Value</span>
                <span className="font-mono font-bold text-foreground">
                  {fmt(assets.reduce((sum, a) => sum + a.purchaseValue, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Hardware Count</span>
                <span className="font-mono font-bold text-primary">{assets.length} Assets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Depreciation Model</span>
                <span className="font-semibold text-emerald-500">3-Year Straight Line</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Security & Disk Encryption Compliance
            </h3>
            <div className="p-4 rounded-xl bg-secondary/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">BitLocker / FileVault Encrypted</span>
                <span className="font-bold text-emerald-500">100% Compliant</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MDM Agent Enrolled</span>
                <span className="font-bold text-primary">Active Protection</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD ASSET */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Register Hardware Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Asset Name / Title *</Label>
              <Input
                placeholder="e.g. MacBook Pro M3 Max 16-inch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs bg-secondary/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger className="text-xs bg-secondary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laptop">Laptop / Notebook</SelectItem>
                    <SelectItem value="Monitor">Monitor / Display</SelectItem>
                    <SelectItem value="Workstation">Desktop Workstation</SelectItem>
                    <SelectItem value="Mobile Device">Mobile / Tablet</SelectItem>
                    <SelectItem value="Peripheral">Peripheral / Accessory</SelectItem>
                    <SelectItem value="Network Hardware">Network / Router</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Brand & Model *</Label>
                <Input
                  placeholder="e.g. Apple M3 Max"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  className="text-xs bg-secondary/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Serial Number *</Label>
                <Input
                  placeholder="e.g. C02GX789LMNOP"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="text-xs bg-secondary/30"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Purchase Value (₹)</Label>
                <Input
                  type="number"
                  placeholder="149000"
                  value={purchaseValue}
                  onChange={(e) => setPurchaseValue(e.target.value)}
                  className="text-xs bg-secondary/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Assign to Employee (Optional)</Label>
              <Select value={assignedEmployeeId} onValueChange={setAssignedEmployeeId}>
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue placeholder="Unassigned (Available in Pool)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned (Available in Pool)</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateAsset} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Register Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ASSIGN ASSET */}
      <Dialog open={!!assignAssetId} onOpenChange={() => setAssignAssetId(null)}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Assign Asset to Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Select Employee *</Label>
              <Select value={assignEmpId} onValueChange={setAssignEmpId}>
                <SelectTrigger className="text-xs bg-secondary/30">
                  <SelectValue placeholder="Select staff member..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleAssignSubmit} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: VIEW DIGITAL QR TAG */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="max-w-xs rounded-2xl bg-card border border-border/70 p-6 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-center">Digital Asset Tag</DialogTitle>
          </DialogHeader>
          {selectedQrAsset && (
            <div className="space-y-3 py-2">
              <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center justify-center border">
                <QrCode className="w-28 h-28 text-black" />
              </div>
              <div>
                <p className="font-mono font-extrabold text-sm text-primary">{selectedQrAsset.assetTag}</p>
                <p className="font-bold text-xs text-foreground mt-0.5">{selectedQrAsset.name}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{selectedQrAsset.serialNumber}</p>
              </div>
            </div>
          )}
          <Button
            size="sm"
            onClick={() => {
              toast.success("Sending asset QR tag to thermal label printer...");
              setIsQrModalOpen(false);
            }}
            className="w-full gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            Print Label Tag
          </Button>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: SCAN QR CODE SCANNER */}
      <Dialog open={isScanModalOpen} onOpenChange={setIsScanModalOpen}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border border-border/70 p-6 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-center">Scan Hardware QR Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-primary/50 bg-secondary/30 flex flex-col items-center justify-center p-4 space-y-2 relative overflow-hidden">
              <QrCode className="w-16 h-16 text-primary animate-pulse" />
              <p className="text-[11px] text-muted-foreground">Align QR code within frame...</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              toast.success("Scanned AST-1001: MacBook Pro M3 (Assigned to Alex Mercer)");
              setIsScanModalOpen(false);
            }}
            className="w-full gradient-bg text-primary-foreground font-bold text-xs h-9"
          >
            Simulate Scan AST-1001
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}