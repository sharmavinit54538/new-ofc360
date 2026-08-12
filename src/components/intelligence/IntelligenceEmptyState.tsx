import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataRequiredModal } from "./DataRequiredModal";
import { Database, LucideIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface IntelligenceEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  moduleName?: string;
  compact?: boolean;
}

export function IntelligenceEmptyState({
  icon: Icon = Database,
  title,
  description,
  actionText = "Data Required",
  moduleName,
  compact = false,
}: IntelligenceEmptyStateProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full glass-card rounded-xl border border-border/60 text-center flex flex-col items-center justify-center ${
          compact ? "p-6" : "p-8 md:p-12"
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm group hover:scale-105 transition-transform">
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-base md:text-lg font-semibold text-foreground tracking-tight mb-1.5">
          {title}
        </h3>

        <p className="text-xs md:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
          {description}
        </p>

      </motion.div>

      <DataRequiredModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        moduleName={moduleName}
      />
    </>
  );
}
