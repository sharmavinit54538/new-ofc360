import { useState, useMemo, useEffect } from "react";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnect } from "@/features/connect/hooks";
import {
  useGetFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectSharedFile, MessageAttachment } from "@/types/connect";
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

  const { setActiveTab } = useConnect();
  const [activeFileTab, setActiveFileTab] = useState<FileTab>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setActiveTab("files");
  }, [setActiveTab]);

  // RTK Query hooks
  const { data: sharedFiles = [], isLoading } = useGetFilesQuery({
    category:
      activeFileTab === "images"
        ? "images"
        : activeFileTab === "videos"
        ? "videos"
        : activeFileTab === "documents"
        ? "documents"
        : undefined,
    search: search.length >= 2 ? search : undefined,
  });

  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const handleUploadFiles = async (attachments: MessageAttachment[]) => {
    for (const att of attachments) {
      try {
        if (att.rawFile) {
          const formData = new FormData();
          formData.append("file", att.rawFile);
          formData.append("name", att.name);
          await uploadFile(formData).unwrap();
        }
      } catch {
        toast.error(`Failed to upload ${att.name}`);
      }
    }
    toast.success(`Uploaded ${attachments.length} file(s)`);
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId).unwrap();
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const filteredFiles = useMemo(() => {
    let list = sharedFiles;

    if (activeFileTab === "shared_by_me") {
      list = list.filter((f) => f.sharedBy?.id === currentUserId);
    } else if (activeFileTab === "shared_with_me") {
      list = list.filter((f) => f.sharedBy?.id !== currentUserId);
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((f) => f.name.toLowerCase().includes(q) || f.sharedBy?.name.toLowerCase().includes(q));
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
                  className="gradient-bg text-primary-foreground text-xs font-semibold h-8 rounded-xl gap-1.5 shadow-xs cursor-pointer"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
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
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-card/60 animate-pulse border border-border/40" />
              ))}
            </div>
          ) : sharedFiles.length === 0 ? (
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
                  onRemove={() => handleDeleteFile(file.id)}
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
