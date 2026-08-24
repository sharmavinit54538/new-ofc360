import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/features/connect/components/ConnectLayout";
import { ChatList } from "@/features/connect/components/ChatList";
import { ChatWindow } from "@/features/connect/components/ChatWindow";
import { useConnect } from "@/features/connect/hooks";

export default function ConnectChatPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { activeTab, setActiveTab, activeConversationId, setActiveConversationId } = useConnect();

  useEffect(() => {
    setActiveTab("chat");
    if (conversationId && conversationId !== activeConversationId) {
      setActiveConversationId(conversationId);
    }
  }, [conversationId, activeConversationId, setActiveTab, setActiveConversationId]);

  const handleSelectConversation = (id: string) => {
    navigate(`/connect/chat/${id}`);
  };

  const currentActiveId = conversationId || activeConversationId;
  const hasActiveConversation = Boolean(currentActiveId);

  return (
    <ConnectLayout>
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* Chat List: On mobile, hide when a conversation is open */}
        <div
          className={`${
            hasActiveConversation ? "hidden md:flex md:w-80 lg:w-96" : "flex w-full"
          } h-full flex-col shrink-0 bg-background/95`}
        >
          <ChatList
            onSelectConversation={handleSelectConversation}
            className="w-full h-full border-r border-border/60"
          />
        </div>

        {/* Active Chat Conversation Area: Full width on mobile */}
        {hasActiveConversation ? (
          <div className="flex-1 flex flex-col w-full h-full min-w-0 overflow-hidden">
            <ChatWindow
              conversationId={currentActiveId}
              className="flex-1 flex w-full h-full"
            />
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-background/50 text-muted-foreground text-sm">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </ConnectLayout>
  );
}
