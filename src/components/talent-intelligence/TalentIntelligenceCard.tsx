import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface TalentIntelligenceCardProps {
  title: string;
  description: string;
  icon: any;
  path: string;
  tag?: string;
}

export function TalentIntelligenceCard({
  title,
  description,
  icon: Icon,
  path,
  tag = "Intelligence"
}: TalentIntelligenceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card-hover rounded-2xl p-6 border border-border/50 bg-card flex flex-col justify-between space-y-4 group relative overflow-hidden shadow-sm"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          <Badge variant="outline" className="text-[10px] border-primary/20 text-primary font-mono">
            {tag}
          </Badge>
        </div>

        <div>
          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-border/30 flex items-center justify-between font-semibold text-xs text-primary">
        <Link to={path} className="flex items-center justify-between w-full">
          <span>Open Page</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
