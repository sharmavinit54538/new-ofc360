export function SelectedDateInspectorHeader({ activeDateStr }: { activeDateStr: string | null }) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-border/40">
      <span className="text-xs font-bold text-foreground">Selected Date Details</span>
      <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
        {activeDateStr || "None"}
      </span>
    </div>
  );
}
