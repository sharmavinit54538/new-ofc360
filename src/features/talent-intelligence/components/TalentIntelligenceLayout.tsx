import { motion } from "framer-motion";

export function TalentIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4"
    >
      {children}
    </motion.div>
  );
}
