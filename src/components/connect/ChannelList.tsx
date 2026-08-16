import { useState, useMemo } from "react";
import { useConnect } from "@/features/connect/hooks";
import { useGetChannelsQuery } from "@/services/api/connectApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hash, Lock, Plus, Search } from "lucide-react";
import { ConnectEmptyState } from "./ConnectEmptyState";

interface ChannelListProps {
  onSelectChannel?: (channelId: string) => void;
  className?: string;
}

export function ChannelList({ onSelectChannel, className = "" }: ChannelListProps) {
  const [search, setSearch] = useState("");
  const { activeChannelId, setActiveChannelId, setIsNewChannelOpen } = useConnect();

  // RTK Query hook
  const { data: channels = [], isLoading } = useGetChannelsQuery();

  const filteredChannels = useMemo(() => {
    const activeList = channels.filter((c) => c?.name && !c.isArchived);
    if (!search.trim()) return activeList;
    const q = search.toLowerCase();
    return activeList.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
    );
  }, [channels, search]);

  const publicChannels = filteredChannels.filter((c) => !c.isPrivate);
  const privateChannels = filteredChannels.filter((c) => c.isPrivate);

  const handleSelect = (id: string) => {
    setActiveChannelId(id);
    onSelectChannel?.(id);
  };

  return (
    <div className={`h-full flex flex-col bg-card/60 border-r border-border/70 select-none ${className}`}>
      {/* Header & Create Channel Button */}
      <div className="p-3.5 border-b border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground tracking-tight">Channels</span>
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
            {channels.filter((c) => !c.isArchived).length}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => setIsNewChannelOpen(true)}
          className="gradient-bg text-primary-foreground h-7 px-2.5 rounded-lg text-xs gap-1 shadow-sm font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Channel</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-border/40 bg-muted/20">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="pl-8 text-xs h-8 bg-background/80 rounded-xl border-border/60"
          />
        </div>
      </div>

      {/* Channels Stream */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 rounded-xl bg-card/60 animate-pulse border border-border/40" />
            ))}
          </div>
        ) : channels.filter((c) => !c.isArchived).length === 0 ? (
          <ConnectEmptyState
            variant="channels"
            actionLabel="Create a Channel"
            onAction={() => setIsNewChannelOpen(true)}
          />
        ) : filteredChannels.length === 0 ? (
          <p className="text-center py-8 text-xs text-muted-foreground">No channels match "{search}"</p>
        ) : (
          <>
            {/* Public Channels */}
            {publicChannels.length > 0 && (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                  <span>Public Channels</span>
                  <span>{publicChannels.length}</span>
                </div>
                {publicChannels.map((chn) => {
                  const isActive = activeChannelId === chn.id;
                  return (
                    <button
                      key={chn.id}
                      type="button"
                      onClick={() => handleSelect(chn.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left text-xs ${
                        isActive
                          ? "bg-primary/15 text-primary font-bold border border-primary/30 shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Hash className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="truncate">{chn.name}</span>
                      </div>
                      <span className="text-[10px] opacity-75 shrink-0 ml-1">
                        {chn.members?.length || 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Private Channels */}
            {privateChannels.length > 0 && (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                  <span>Private Channels</span>
                  <span>{privateChannels.length}</span>
                </div>
                {privateChannels.map((chn) => {
                  const isActive = activeChannelId === chn.id;
                  return (
                    <button
                      key={chn.id}
                      type="button"
                      onClick={() => handleSelect(chn.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left text-xs ${
                        isActive
                          ? "bg-primary/15 text-primary font-bold border border-primary/30 shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Lock className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-500" : "text-muted-foreground"}`} />
                        <span className="truncate">{chn.name}</span>
                      </div>
                      <span className="text-[10px] opacity-75 shrink-0 ml-1">
                        {chn.members?.length || 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
