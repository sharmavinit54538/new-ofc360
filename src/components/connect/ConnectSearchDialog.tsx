import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Hash, MessageSquare, FileText, ArrowRight } from "lucide-react";
import { useConnect } from "@/features/connect/hooks";
import { useGlobalSearchQuery, useCreateConversationMutation } from "@/services/api/connectApi";
import { ConnectUser } from "@/types/connect";
import { formatFileSize } from "./FileCard";

interface ConnectSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToChat?: (conversationId: string) => void;
  onNavigateToChannel?: (channelId: string) => void;
}

export function ConnectSearchDialog({
  open,
  onOpenChange,
  onNavigateToChat,
  onNavigateToChannel,
}: ConnectSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "people" | "channels" | "messages" | "files">("all");

  const { setActiveConversationId, setActiveChannelId, setActiveTab } = useConnect();
  const [createConversation] = useCreateConversationMutation();

  // Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Only call API if query is >= 2 characters
  const shouldSearch = open && debouncedQuery.length >= 2;

  const { data: searchResults, isLoading } = useGlobalSearchQuery(
    {
      q: debouncedQuery,
      type: activeCategory,
    },
    { skip: !shouldSearch }
  );

  const peopleResults = searchResults?.people || [];
  const channelResults = searchResults?.channels || [];
  const messageResults = searchResults?.messages || [];
  const fileResults = searchResults?.files || [];

  const handleSelectPerson = async (emp: ConnectUser) => {
    try {
      const res = await createConversation({ targetUserId: emp.id }).unwrap();
      setActiveConversationId(res.id);
      setActiveTab("chat");
      onOpenChange(false);
      onNavigateToChat?.(res.id);
    } catch {
      const convId = `conv_${emp.id}`;
      setActiveConversationId(convId);
      setActiveTab("chat");
      onOpenChange(false);
      onNavigateToChat?.(convId);
    }
  };

  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveTab("channels");
    onOpenChange(false);
    onNavigateToChannel?.(channelId);
  };

  const handleSelectMessage = (targetId: string) => {
    if (targetId.startsWith("chn_")) {
      handleSelectChannel(targetId);
    } else {
      setActiveConversationId(targetId);
      setActiveTab("chat");
      onOpenChange(false);
      onNavigateToChat?.(targetId);
    }
  };

  const totalResults = peopleResults.length + channelResults.length + messageResults.length + fileResults.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl">
        <DialogHeader className="p-4 pb-3 border-b border-border/40">
          <DialogTitle className="sr-only">Search Workspace</DialogTitle>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across people, channels, messages, and files..."
              className="pl-9 h-10 text-sm bg-muted/40 border-border/60 rounded-xl"
              autoFocus
            />
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 pt-2">
            {[
              { id: "all", label: `All (${totalResults})` },
              { id: "people", label: `People (${peopleResults.length})` },
              { id: "channels", label: `Channels (${channelResults.length})` },
              { id: "messages", label: `Messages (${messageResults.length})` },
              { id: "files", label: `Files (${fileResults.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === tab.id
                    ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        {/* Results Stream */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 scrollbar-thin">
          {!query.trim() || query.length < 2 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">Type at least 2 characters to explore your workspace</p>
              <p className="text-[11px] opacity-75 mt-0.5">Search colleagues, channels, messages, and shared files</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-2 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-card/60 animate-pulse border border-border/40" />
              ))}
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-xs font-medium">No results found for "{query}"</p>
              <p className="text-[11px] opacity-75 mt-0.5">Check for typos or try broader keywords</p>
            </div>
          ) : (
            <>
              {/* People */}
              {(activeCategory === "all" || activeCategory === "people") && peopleResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    People ({peopleResults.length})
                  </span>
                  {peopleResults.map((emp) => {
                    const fullName = emp.name || emp.email;
                    return (
                      <div
                        key={emp.id}
                        onClick={() => handleSelectPerson(emp)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/40 cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground truncate">{fullName}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {emp.designation || emp.role || "Team Member"} • {emp.department || "General"}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Channels */}
              {(activeCategory === "all" || activeCategory === "channels") && channelResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Channels ({channelResults.length})
                  </span>
                  {channelResults.map((chn) => (
                    <div
                      key={chn.id}
                      onClick={() => handleSelectChannel(chn.id)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/40 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                          #
                        </div>
                        <div>
                          <p className="font-semibold text-foreground truncate">{chn.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {chn.description || "No topic set"}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}

              {/* Messages */}
              {(activeCategory === "all" || activeCategory === "messages") && messageResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Messages ({messageResults.length})
                  </span>
                  {messageResults.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleSelectMessage(message.conversationId)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/40 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            <span className="text-primary font-semibold">{message.senderName}:</span> {message.content}
                          </p>
                          <span className="text-[10px] text-muted-foreground">{message.timestamp}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}

              {/* Files */}
              {(activeCategory === "all" || activeCategory === "files") && fileResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    Files ({fileResults.length})
                  </span>
                  {fileResults.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/40 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{file.name}</p>
                          <span className="text-[10px] text-muted-foreground">
                            {formatFileSize(file.size)} • Shared by {file.sharedBy?.name || "Colleague"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
