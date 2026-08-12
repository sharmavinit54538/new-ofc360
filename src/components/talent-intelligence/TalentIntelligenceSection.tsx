import { Badge } from "@/components/ui/badge";

interface TalentIntelligenceSectionProps {
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
}

export function TalentIntelligenceSection({
  title,
  description,
  badge,
  children
}: TalentIntelligenceSectionProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between border-b border-border/30 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-foreground tracking-tight">{title}</h3>
            {badge && (
              <Badge variant="secondary" className="text-[10px]">
                {badge}
              </Badge>
            )}
          </div>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
