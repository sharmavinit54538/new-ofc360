import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { ChannelList } from "@/components/connect/ChannelList";
import { ChannelView } from "@/components/connect/ChannelView";
import { useConnect } from "@/features/connect/hooks";

export default function ConnectChannelsPage() {
  const { channelId } = useParams<{ channelId?: string }>();
  const navigate = useNavigate();
  const { activeTab, setActiveTab, activeChannelId, setActiveChannelId } = useConnect();

  useEffect(() => {
    setActiveTab("channels");
    if (channelId && channelId !== activeChannelId) {
      setActiveChannelId(channelId);
    }
  }, [channelId, activeChannelId, setActiveTab, setActiveChannelId]);

  const handleSelectChannel = (id: string) => {
    navigate(`/connect/channels/${id}`);
  };

  const currentActiveChannel = channelId || activeChannelId;
  const hasActiveChannel = Boolean(currentActiveChannel);

  return (
    <ConnectLayout>
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* Channel List */}
        <ChannelList
          onSelectChannel={handleSelectChannel}
          className={hasActiveChannel ? "w-full sm:w-80 md:w-96 shrink-0" : "w-full flex-1 border-r-0"}
        />

        {/* Active Channel View */}
        {hasActiveChannel && (
          <ChannelView
            channelId={currentActiveChannel!}
            className="flex-1 flex"
          />
        )}
      </div>
    </ConnectLayout>
  );
}
