import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnect } from "@/features/connect/hooks";

export default function ConnectOverviewPage() {
  const navigate = useNavigate();
  const { setActiveTab } = useConnect();

  useEffect(() => {
    setActiveTab("chat");
    navigate("/connect/chat", { replace: true });
  }, [navigate, setActiveTab]);

  return (
    <ConnectLayout>
      <div className="flex-1 flex items-center justify-center p-8 text-xs text-muted-foreground">
        Loading OFC360 Connect...
      </div>
    </ConnectLayout>
  );
}
