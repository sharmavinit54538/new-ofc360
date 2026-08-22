import { Building2, UserCheck, Lock, CreditCard } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsNavigation() {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 p-1 bg-secondary/50 rounded-xl border border-border/50">
      <TabsTrigger value="company" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"><Building2 className="w-3.5 h-3.5" /><span>Company Info</span></TabsTrigger>
      <TabsTrigger value="hr" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"><UserCheck className="w-3.5 h-3.5" /><span>HR Info</span></TabsTrigger>
      <TabsTrigger value="password" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"><Lock className="w-3.5 h-3.5" /><span>Password & Security</span></TabsTrigger>
      <TabsTrigger value="payment" className="gap-2 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"><CreditCard className="w-3.5 h-3.5" /><span>Payment & Billing</span></TabsTrigger>
    </TabsList>
  );
}
