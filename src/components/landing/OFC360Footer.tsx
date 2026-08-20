import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function OFC360Footer() {
  return (
    <footer className="bg-card border-t border-border/80 text-muted-foreground text-xs pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3.5">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="OFC360 Logo"
                className="w-8 h-8 rounded-lg object-contain bg-white shrink-0 shadow-xs"
              />
              <span className="font-bold text-foreground text-base tracking-tight">
                OFC<span className="text-primary font-extrabold">360</span>
              </span>
            </Link>
            <p className="text-foreground font-medium text-xs">
              AI-Powered HR & Workforce Management Platform
            </p>
            <p className="text-xs text-primary font-semibold">
              A product by EquinoxSphere
            </p>
            <p className="text-muted-foreground text-xs max-w-sm leading-relaxed pt-1">
              Developed by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth. Unifying operations, attendance, payroll, hiring, and AI intelligence in one platform.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/features" className="hover:text-foreground transition-colors">Features Overview</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing Plans</Link></li>
              <li><Link to="/features#ai-intelligence" className="hover:text-foreground transition-colors">AI Intelligence</Link></li>
              <li><Link to="/features#security" className="hover:text-foreground transition-colors">Security & RBAC</Link></li>
              <li><Link to="/it-admin/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About OFC360</Link></li>
              <li><Link to="/about/equinoxsphere" className="hover:text-foreground transition-colors font-medium text-primary">About EquinoxSphere</Link></li>
              <li><Link to="/founders" className="hover:text-foreground transition-colors font-medium text-primary">Founders</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Resources & Legal Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Resources & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ & Support</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog & Insights</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 OFC360. A product of <span className="font-semibold text-foreground">EquinoxSphere</span>. All rights reserved. Founded by Vinit Sharma and Banoth Siddarth.</p>
          <div className="flex gap-5 text-xs">
            <Link to="/faq" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}