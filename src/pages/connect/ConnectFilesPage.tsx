import { useState, useMemo, useEffect } from "react";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnectStore } from "@/stores/connectStore";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser, ConnectSharedFile, MessageAttachment } from "@/types/connect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FolderArchive,
  Search,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Clock,
  User,
  Share2,
} from "lucide-react";
import { FileCard } from "@/components/connect/FileCard";
import { FilePicker } from "@/components/connect/FilePicker";
import { ConnectEmptyState } from "@/components/connect/ConnectEmptyState";
import { toast } from "sonner";

type FileTab = "all" | "shared_with_me" | "shared_by_me" | "recent" | "images" | "videos" | "documents";

export default function ConnectFilesPage() {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ? String(currentUser.id) : "usr_current";

  const setActiveTab = useConnectStore((s) => s.setActiveTab);
  const sharedFiles = useConnectStore((s) => s.sharedFiles);
  const addSharedFile = useConnectStore((s) => s.addSharedFile);
  const removeSharedFile = useConnectStore((s) => s.removeSharedFile);

  const [activeFileTab, setActiveFileTab] = useState<FileTab>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setActiveTab("files");
  }, [setActiveTab]);

  const currentConnectUser: ConnectUser = {
    id: currentUserId,
    name: currentUser?.name || currentUser?.email?.split("@")[0] || "User",
    email: currentUser?.email || "",
    role: currentUser?.role,
  };

  const handleUploadFiles = (attachments: MessageAttachment[]) => {
    attachments.forEach((att) => {
      let category: ConnectSharedFile["category"] = "documents";
      if (att.type.startsWith("image/")) category = "images";
      else if (att.type.startsWith("video/")) category = "videos";
      else if (att.name.endsWith(".xls") || att.name.endsWith(".xlsx") || att.name.endsWith(".csv"))
        category = "spreadsheets";

      addSharedFile({
        name: att.name,
        size: att.size,
        type: att.type,
        category,
        url: att.url,
        sharedBy: currentConnectUser,
      });
    });
    toast.success(`Uploaded ${attachments.length} file(s)`);
  };

  const filteredFiles = useMemo(() => {
    let list = sharedFiles;

    if (activeFileTab === "shared_by_me") {
      list = list.filter((f) => f.sharedBy.id === currentUserId);
    } else if (activeFileTab === "shared_with_me") {
      list = list.filter((f) => f.sharedBy.id !== currentUserId);
    } else if (activeFileTab === "images") {
      list = list.filter((f) => f.category === "images");
    } else if (activeFileTab === "videos") {
      list = list.filter((f) => f.category === "videos");
    } else if (activeFileTab === "documents") {
      list = list.filter((f) => f.category === "documents" || f.category === "spreadsheets");
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((f) => f.name.toLowerCase().includes(q) || f.sharedBy.name.toLowerCase().includes(q));
  }, [sharedFiles, activeFileTab, search, currentUserId]);

  const TABS: { id: FileTab; label: string; icon: any }[] = [
    { id: "all", label: "All Files", icon: FolderArchive },
    { id: "shared_with_me", label: "Shared with Me", icon: Share2 },
    { id: "shared_by_me", label: "Shared by Me", icon: User },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "videos", label: "Videos", icon: VideoIcon },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <ConnectLayout>
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 scrollbar-thin select-none">
        {/* Header bar & Upload button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-primary" />
              Shared Files Workspace
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore media, documents, and attachments shared across your organization
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FilePicker onFilesSelected={handleUploadFiles} accept="*/*">
              {({ openPicker }) => (
                <Button
                  onClick={openPicker}
                  className="gradient-bg text-primary-foreground text-xs font-semibold h-8 rounded-xl gap-1.5 shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Local File</span>
                </Button>
              )}
            </FilePicker>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFileTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter files..."
              className="pl-8 text-xs h-8 rounded-xl bg-card border-border/70"
            />
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1">
          {sharedFiles.length === 0 ? (
            <ConnectEmptyState
              variant="files"
              actionLabel="Upload First File"
              onAction={() => {
                const el = document.querySelector<HTMLInputElement>("input[type='file']");
                el?.click();
              }}
            />
          ) : filteredFiles.length === 0 ? (
            <p className="text-center py-12 text-xs text-muted-foreground">
              No files found in "{activeFileTab.replace(/_/g, " ")}" matching "{search}"
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  attachment={{
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: file.url,
                  }}
                  onRemove={() => removeSharedFile(file.id)}
                  className="bg-card shadow-xs"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ConnectLayout>
  );
}
