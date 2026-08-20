import { ReactNode } from "react";
import { motion } from "framer-motion";

interface IntelligenceHubLayoutProps {
  children: ReactNode;
}

export function IntelligenceHubLayout({ children }: IntelligenceHubLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

