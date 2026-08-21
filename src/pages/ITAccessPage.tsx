import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Key, Shield, Users, Mail, Lock, Settings, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function ITAccessPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const activeEmployees = employees.filter(
    (e) => (e?.status || "").toUpperCase() === "ACTIVE"
  );

  const [securitySettings, setSecuritySettings] = useState([
    { name: "Two-Factor Authentication (2FA)", description: "Require OTP verification for all workforce logins", enabled: true },
    { name: "Single Sign-On (SSO / OAuth)", description: "Enable Google & SAML identity provider federation", enabled: true },
    { name: "Session Inactivity Timeout", description: "Auto-logout secure sessions after 30 min idle", enabled: true },
    { name: "Security Audit Logging", description: "Log all administrative actions and role delegations", enabled: true },
  ]);

  const toggleSetting = (index: number) => {
    setSecuritySettings((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">IT & Access Management</h1>
        <p className="page-subheader">System access delegation, role-based permissions & security governance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Registered Workforce", value: String(employees.length), icon: Users },
          { label: "Active Access Accounts", value: String(activeEmployees.length), icon: Monitor },
          { label: "Identity Security", value: "Enforced", icon: Shield },
          { label: "Pending Access Grants", value: "0", icon: Key },
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

      <Tabs defaultValue="access">
        <TabsList>
          <TabsTrigger value="access">Workforce System Access</TabsTrigger>
          <TabsTrigger value="security">Security Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Identity & Access Provisioning</CardTitle></CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No employee profiles registered for IT access provisioning.
                </div>
              ) : (
                <div className="space-y-3">
                  {employees.map((e) => (
                    <div key={e.id} className="p-3.5 rounded-xl border border-border/50 bg-secondary/20 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.email || "No email"} · {e.role || "Staff Member"} ({e.department || "General"})</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {e.status || "Active"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Identity & Authentication Policy</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {securitySettings.map((s, idx) => (
                <div key={s.name} className="p-3.5 rounded-xl border border-border/40 bg-secondary/20 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  <Switch checked={s.enabled} onCheckedChange={() => toggleSetting(idx)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}