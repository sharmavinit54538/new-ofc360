import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, FolderOpen, Download, Upload, Search, CreditCard, FileCheck, Plus, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/stores/documentStore";
import { type DocItem } from "@/types/hr";
import { toast } from "sonner";

const contracts = [
  { title: "Full-Time Employment Agreement", type: "Template", usedBy: 45, lastModified: "Mar 2026" },
  { title: "Contractor Agreement", type: "Template", usedBy: 12, lastModified: "Feb 2026" },
  { title: "NDA - Standard", type: "Template", usedBy: 65, lastModified: "Jan 2026" },
  { title: "Internship Agreement", type: "Template", usedBy: 8, lastModified: "Mar 2026" },
];

const offerTemplates = [
  { title: "Standard Offer Letter", level: "Mid-Level", department: "All" },
  { title: "Senior Offer Letter", level: "Senior", department: "Engineering" },
  { title: "Executive Offer Letter", level: "C-Suite", department: "Leadership" },
  { title: "Internship Offer", level: "Intern", department: "All" },
];

export default function DocumentsPage() {
  const { documents, searchQuery, categoryFilter, setSearchQuery, setCategoryFilter, deleteDocument } =
    useDocumentStore();

  const handleDownload = (doc: DocItem) => {
    const textContent = `DOCUMENT PREVIEW STATEMENT\n=========================\nDocument Name: ${doc.name}\nCategory: ${doc.category}\nUpdated: ${doc.updatedAt}\nAuthor: ${doc.author}\nStatus: Verified\n=========================\nHR Nexus Local Document Vault`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded "${doc.name}"`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteDocument(id);
    toast.success(`Document "${name}" removed`);
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Documentation Vault</h1>
          <p className="page-subheader">Local employee records, contracts, templates & ID card generator</p>
        </div>
        <UploadDocumentDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: String(documents.length), icon: FolderOpen },
          { label: "Templates", value: "24", icon: FileCheck },
          { label: "Pending Reviews", value: "2", icon: FileText },
          { label: "ID Cards Issued", value: "158", icon: CreditCard },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Document Library</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="offers">Offer Templates</TabsTrigger>
          <TabsTrigger value="idcard">ID Card Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <Card className="glass-card border border-border/50">
            <CardHeader className="pb-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search document vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent className="space-y-2 mt-2">
              {filteredDocs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No documents found in local vault.
                </div>
              ) : (
                filteredDocs.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.category} · {r.size} · Updated {r.updatedAt} · By {r.author}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30 w-fit">
                      {r.status || "Verified"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Download Document"
                        onClick={() => handleDownload(r)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete Document"
                        onClick={() => handleDelete(r.id, r.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {contracts.map((c) => (
                <div key={c.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/40">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Used by {c.usedBy} employees · Modified {c.lastModified}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {c.type}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const text = `CONTRACT TEMPLATE: ${c.title}\nHR Nexus Standard Agreement Format`;
                      const blob = new Blob([text], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${c.title}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success(`Downloaded ${c.title} Template`);
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Offer Letter Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {offerTemplates.map((o) => (
                <div key={o.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/40">
                  <FileCheck className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.level} · {o.department}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Offer template "${o.title}" loaded into editor`)}
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="idcard" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Employee ID Card Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="w-80 h-48 rounded-xl gradient-border p-4 flex gap-4 bg-card/80 border border-border">
                  <div className="w-20 h-24 bg-muted/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground font-semibold">
                    PHOTO
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="font-bold text-sm gradient-text">HR NEXUS AI</p>
                    <p className="font-semibold text-sm">Alex Mercer</p>
                    <p className="text-xs text-muted-foreground">VP of HR Analytics</p>
                    <p className="text-xs text-muted-foreground font-mono">EMP-001</p>
                    <div className="w-16 h-7 bg-muted/30 rounded mt-2 flex items-center justify-center text-[8px] text-muted-foreground font-mono border border-border">
                      QR CODE
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <Button onClick={() => toast.success("ID Card generated & exported to PDF format!")}>
                  <CreditCard className="w-4 h-4 mr-1" /> Export ID Card PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function UploadDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<DocItem["category"]>("Policy");
  const [author, setAuthor] = useState("HR Admin");
  const fileRef = useRef<HTMLInputElement>(null);
  const addDocument = useDocumentStore((s) => s.addDocument);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      addDocument({
        name: file.name,
        category,
        size: sizeFormatted,
        author: author || "HR Admin",
        url: reader.result as string,
      });
      toast.success(`Document "${file.name}" uploaded to local vault!`);
      setOpen(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File to Local Vault</DialogTitle>
        </DialogHeader>
        <input type="file" ref={fileRef} className="hidden" onChange={handleFile} />
        <div className="space-y-4 py-2">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DocItem["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Report">Report</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Author / Uploader</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Select file from your device</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, PNG up to 25MB</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}