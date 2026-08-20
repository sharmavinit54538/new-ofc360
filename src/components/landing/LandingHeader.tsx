import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type NavSection = "home" | "features" | "pricing" | "about" | "blog" | "faq" | "contact";

interface LandingHeaderProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenDemo: () => void;
}

export function LandingHeader({ activeSection, onNavigate, onOpenDemo }: LandingHeaderProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: { id: NavSection; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "about", label: "About" },
    { id: "blog", label: "Blog" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3"
          : "bg-[#090d16]/70 backdrop-blur-md border-b border-slate-800/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                OFC<span className="text-blue-400 font-extrabold">360</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Bar - Styled to match prompt design */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f172a]/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-inner shadow-black/40">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl ${
                    isActive
                      ? "bg-[#15213b] text-blue-400 shadow-md shadow-blue-950/50 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium px-4 text-sm rounded-xl"
            >
              Sign In
            </Button>
            <Button
              onClick={onOpenDemo}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center gap-2 border border-blue-400/20"
            >
              <span>Book Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d16] border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800/80">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 text-left text-sm font-medium rounded-xl transition-colors ${
                  activeSection === item.id
                    ? "bg-[#15213b] text-blue-400 border border-blue-500/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full justify-center text-slate-200 border-slate-700 bg-slate-900/60"
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white"
            >
              Book Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}