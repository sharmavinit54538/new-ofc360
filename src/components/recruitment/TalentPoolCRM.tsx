import { useState } from "react";
import { Users, Mail, Sparkles, Tag, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function TalentPoolCRM() {
  const { talentPool } = useATSStore();
  const [search, setSearch] = useState("");

  const filtered = talentPool.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Passive Talent Pool & Candidate CRM</h2>
          <p className="text-sm text-muted-foreground">
            Archive silver-medalist candidates, custom tags (Ex-FAANG, Immediate Joiner), and email nurture sequences.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search talent database..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 text-xs" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tp) => (
          <div key={tp.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base">{tp.name}</h3>
                <p className="text-xs text-muted-foreground">{tp.role}</p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs font-mono">
                {tp.aiFitScore}% Fit
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1">
              {tp.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">
                  {t}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/30">
              <span>Nurture: {tp.nurtureSequence}</span>
              <Button size="sm" variant="ghost" onClick={() => toast.success(`Nurture email triggered to ${tp.email}`)} className="text-xs text-primary gap-1">
                <Mail className="w-3.5 h-3.5" /> Nurture
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
