import { motion } from "framer-motion";
import { Heart, Shield, Globe, Megaphone, FileText, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentStore } from "@/stores/documentStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function CulturePage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const { documents } = useDocumentStore();
  const policies = documents.filter((d) => d.category === "Policy");

  const cultureMetrics = [
    { label: "Total Organization Staff", value: String(employees.length), description: "Active members" },
    { label: "Active Culture Policies", value: String(policies.length), description: "Published in vault" },
    { label: "Safety & Compliance Score", value: "100%", description: "Verified standard" },
    { label: "Brand Portal Status", value: "Active", description: "OFC360 Employer brand" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Culture & Employer Branding</h1>
        <p className="page-subheader">Company values, organizational policies & employer branding governance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cultureMetrics.map((m) => (
          <Card key={m.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className="text-xs text-primary mt-1">{m.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">Organizational Policies</TabsTrigger>
          <TabsTrigger value="values">Core Values</TabsTrigger>
          <TabsTrigger value="branding">Employer Brand Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {policies.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No company policies uploaded yet. Upload organization policies in Documentation Vault.
                </div>
              ) : (
                policies.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Updated {p.updatedAt} · By {p.author}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> OFC360 Guiding Principles</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Customer & Mission Focus", desc: "Prioritize delivering value and measurable outcomes with integrity." },
                  { title: "Transparency & Trust", desc: "Open communication, candid feedback, and radical accountability." },
                  { title: "Innovation & Speed", desc: "Continuous learning, rapid iteration, and high engineering standards." },
                  { title: "Inclusion & Belonging", desc: "Equal opportunity, mutual respect, and collaborative empowerment." },
                ].map((v) => (
                  <div key={v.title} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-1">
                    <p className="text-sm font-bold text-foreground">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" /> Social Hiring & Employer Branding</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { platform: "LinkedIn Careers", status: "Connected" },
                  { platform: "Glassdoor Portal", status: "Connected" },
                  { platform: "Company Careers Hub", status: "Active" },
                ].map((p) => (
                  <div key={p.platform} className="p-4 rounded-lg border border-border bg-muted/20 text-center space-y-2">
                    <p className="font-semibold text-sm">{p.platform}</p>
                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30">{p.status}</Badge>
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