import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataRequiredModal } from "./DataRequiredModal";
import { LucideIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface InsightCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export function InsightCard({
  title,
  subtitle,
  description,
  icon: Icon,
}: InsightCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-xl p-5 border border-border/60 flex flex-col justify-between h-full group hover:border-primary/30 hover:shadow-md transition-all"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Icon className="w-5 h-5" />
            </div>
          </div>

          <h4 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors mb-1">
            {title}
          </h4>
          <p className="text-[11px] font-medium text-primary/80 mb-2">
            {subtitle}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

      </motion.div>

      <DataRequiredModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        moduleName={title}
      />
    </>
  );
}

