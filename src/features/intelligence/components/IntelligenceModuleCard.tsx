import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface IntelligenceModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  tag?: string;
}

export function IntelligenceModuleCard({
  title,
  description,
  icon: Icon,
  path,
  tag = "AI Module",
}: IntelligenceModuleCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all flex flex-col justify-between h-full group relative overflow-hidden bg-card/80"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors -z-10" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50">
            <Sparkles className="w-3 h-3 text-primary" />
            {tag}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>

        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-border/40 flex items-center justify-end">
        <Link to={path}>
          <Button
            size="sm"
            className="gradient-bg text-primary-foreground hover:opacity-90 transition-opacity gap-1.5 font-medium text-xs rounded-lg px-4 shadow-sm"
          >
            <span>Open Page</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

    </motion.div>
  );
}