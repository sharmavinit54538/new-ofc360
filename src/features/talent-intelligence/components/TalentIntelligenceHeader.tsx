import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TalentIntelligenceHeaderProps {
  title: string;
  subtitle: string;
  icon?: any;
  badgeText?: string;
  parentPath?: string;
  parentTitle?: string;
}

export function TalentIntelligenceHeader({
  title,
  subtitle,
  icon: Icon,
  badgeText = "🎯 Talent Intelligence",
  parentPath = "/talent-intelligence",
  parentTitle = "Talent Intelligence"
}: TalentIntelligenceHeaderProps) {
  return (
    <div className="space-y-2 border-b border-border/40 pb-5">
      {parentPath && parentPath !== "/talent-intelligence" && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
          <Link to="/talent-intelligence" className="hover:text-primary transition-colors">
            Talent Intelligence
          </Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
          <span className="text-foreground">{title}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground shrink-0 shadow-md">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary font-semibold">
                {badgeText}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}