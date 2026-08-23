import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TalentIntelligenceModal } from "./TalentIntelligenceModal";

interface TalentIntelligenceFeatureCardProps {
  title: string;
  description: string;
  icon: any;
  category?: string;
}

export function TalentIntelligenceFeatureCard({
  title,
  description,
  icon: Icon,
  category = "Intelligence Section"
}: TalentIntelligenceFeatureCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        className="glass-card rounded-xl p-5 border border-border/50 bg-card space-y-3 flex flex-col justify-between shadow-sm"
      >
        <div className="space-y-2.5">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {category}
            </Badge>
          </div>

          <div>
            <h4 className="font-bold text-sm text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

      </motion.div>

      <TalentIntelligenceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={`Data Required for ${title}`}
        moduleName={title}
      />
    </>
  );
}