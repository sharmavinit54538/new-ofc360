import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon, Sparkles } from "lucide-react";

interface IntelligenceHubHeaderProps {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  badgeText?: string;
  showBack?: boolean;
  moduleName?: string;
}

export function IntelligenceHubHeader({
  title,
  subtitle,
  icon: Icon = Sparkles,
  showBack = false,
}: IntelligenceHubHeaderProps) {
  return (
    <div className="pb-3 border-b border-border/50">
      <div className="space-y-1">
        {showBack && (
          <div className="mb-1">
            <Link
              to="/intelligence"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Intelligence Hub
            </Link>
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          {title}
        </h1>

        <p className="text-xs md:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}