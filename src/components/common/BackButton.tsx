import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
}

export function BackButton({ className = "", fallbackPath = "/" }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all duration-200 cursor-pointer h-8 group border border-border/40 bg-card/40 backdrop-blur-xs ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-muted-foreground group-hover:text-primary" />
      <span>Back</span>
    </Button>
  );
}
export default BackButton;