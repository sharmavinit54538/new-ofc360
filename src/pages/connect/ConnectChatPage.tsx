import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { ChatList } from "@/components/connect/ChatList";
import { ChatWindow } from "@/components/connect/ChatWindow";
import { useConnectStore } from "@/stores/connectStore";

export default function ConnectChatPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const setActiveTab = useConnectStore((s) => s.setActiveTab);
  const activeConversationId = useConnectStore((s) => s.activeConversationId);
  const setActiveConversationId = useConnectStore((s) => s.setActiveConversationId);

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
        {/* Chat List (Full width when browsing, master sidebar when chatting) */}
        <ChatList
          onSelectConversation={handleSelectConversation}
          className={hasActiveConversation ? "w-full sm:w-80 md:w-96 shrink-0" : "w-full flex-1 border-r-0"}
        />

        {/* Active Chat Conversation Area */}
        {hasActiveConversation && (
          <ChatWindow
            conversationId={currentActiveId}
            className="flex-1 flex"
          />
        )}
      </div>
    </ConnectLayout>
  );
}
