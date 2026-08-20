import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OFC360Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/founders", label: "Founders" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/80 bg-background/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="OFC360 Logo"
            className="w-9 h-9 rounded-xl object-contain bg-white group-hover:scale-105 transition-transform shadow-xs shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1">
              OFC<span className="text-primary font-extrabold">360</span>
            </span>
            <span className="text-[9px] text-muted-foreground -mt-1 font-medium">by EquinoxSphere</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  active
                    ? "bg-card text-primary shadow-xs border border-border/80 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full justify-center text-xs"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full justify-center text-xs bg-primary text-primary-foreground"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}