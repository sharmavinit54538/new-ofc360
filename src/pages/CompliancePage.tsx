import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle2, Clock, Eye, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentStore } from "@/stores/documentStore";

export default function CompliancePage() {
  const { documents } = useDocumentStore();
  const complianceDocs = documents.filter((d) => d.category === "Compliance" || d.category === "Policy");

  const statutoryItems = [
    { law: "Employees Provident Fund (EPF)", code: "EPF-1952", status: "Active", frequency: "Monthly Filing" },
    { law: "Employees State Insurance (ESIC)", code: "ESI-1948", status: "Active", frequency: "Monthly Filing" },
    { law: "Tax Deducted at Source (TDS 24Q)", code: "IT-1961", status: "Active", frequency: "Quarterly Return" },
    { law: "Payment of Gratuity", code: "PGA-1972", status: "Compliant", frequency: "Annual Audit" },
    { law: "Prevention of Sexual Harassment (POSH)", code: "POSH-2013", status: "Compliant", frequency: "Annual Reporting" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Compliance & Legal Governance</h1>
        <p className="page-subheader">Statutory labor law compliance, organization policies & audit readiness</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Statutory Acts", value: String(statutoryItems.length), icon: Shield },
          { label: "Active Policy Docs", value: String(complianceDocs.length), icon: FileText },
          { label: "Audit Readiness", value: "100%", icon: ShieldCheck },
          { label: "Open Compliance Risks", value: "0", icon: AlertTriangle },
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

      <Tabs defaultValue="compliance">
        <TabsList>
          <TabsTrigger value="compliance">Labor Laws</TabsTrigger>
          <TabsTrigger value="policies">Policies & Docs</TabsTrigger>
          <TabsTrigger value="legal">Legal Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {statutoryItems.map((c) => (
                <div key={c.law} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.law}</p>
                    <p className="text-xs text-muted-foreground">Code: {c.code} · Schedule: {c.frequency}</p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {complianceDocs.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No policy or compliance documents uploaded yet. Upload documents in Documentation Vault.
                </div>
              ) : (
                complianceDocs.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category} · Updated {p.updatedAt}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{p.status || "Active"}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {["NDA Standard Agreement", "Employment Offer Contract", "Intellectual Property Agreement", "Separation & Release Agreement"].map((d) => (
                  <div key={d} className="p-4 rounded-lg border border-border bg-muted/20 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d}</p>
                      <p className="text-xs text-muted-foreground">Organization standard contract</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}