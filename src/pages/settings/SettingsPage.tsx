import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs } from "@/components/ui/tabs";
import { SettingsNavigation } from "./components/SettingsNavigation";
import { CompanyTab } from "./components/company/CompanyTab";
import { HRTab } from "./components/hr/HRTab";
import { SecurityTab } from "./components/security/SecurityTab";
import { BillingTab } from "./components/billing/BillingTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <SettingsNavigation /><CompanyTab /><HRTab /><SecurityTab /><BillingTab />
      </Tabs>
    </motion.div>
  );
}