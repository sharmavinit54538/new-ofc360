import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, CheckCircle2, Building, Mail, User, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [teamSize, setTeamSize] = useState("50-200");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitted(true);
    toast.success("Demo Request Submitted! Our AI team will reach out within 15 minutes.");
    setTimeout(() => {
      onOpenChange(false);
      setSubmitted(false);
    }, 2500);
  };

  const handleInstantTrial = () => {
    onOpenChange(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-[#0c1220] text-slate-100 border-slate-800 p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <DialogTitle className="text-xl font-bold text-white">
              Experience HR Nexus AI Live
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-sm">
            Book a 1-on-1 personalized AI demo or launch our interactive sandbox right now.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white">Thank You, {name}!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              We've dispatched your demo instance credentials to <span className="text-blue-400 font-medium">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Full Name *</Label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 text-sm rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Work Email *</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    type="email"
                    placeholder="sarah@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 text-sm rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Company Name *</Label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    placeholder="Acme Tech Inc"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="pl-9 bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 text-sm rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">Phone Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-300">Company Workforce Size</Label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger className="bg-slate-900/80 border-slate-800 text-white text-sm rounded-xl">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="1-50">1 - 50 Employees</SelectItem>
                  <SelectItem value="50-200">50 - 200 Employees</SelectItem>
                  <SelectItem value="200-1000">200 - 1,000 Employees</SelectItem>
                  <SelectItem value="1000+">1,000+ Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Sandbox Access Available</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleInstantTrial}
                className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto font-medium"
              >
                Launch Sandbox Now &rarr;
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30"
              >
                Schedule AI Demo
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
