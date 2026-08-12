import { useState } from "react";
import { Mail, Phone, Building2, ShieldCheck, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { OFC360Navbar } from "@/components/landing/OFC360Navbar";
import { OFC360Footer } from "@/components/landing/OFC360Footer";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("50-200");
  const [interest, setInterest] = useState("Enterprise Demo");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !workEmail || !message) {
      toast.error("Please complete required contact fields.");
      return;
    }

    toast.success("Thank you! Your message has been sent to our OFC360 enterprise team.");
    setFullName("");
    setWorkEmail("");
    setCompany("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <OFC360Navbar />

      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Let's talk about your workforce.
              </h1>
            </div>

            {/* Contact Support Email Card */}
            <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Contact Support</h4>
                <a href="mailto:info@ofc360.com" className="text-xs text-primary font-semibold hover:underline">
                  info@ofc360.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Enterprise Contact Form */}
          <div className="lg:col-span-7">
            <Card className="glass-card border border-border/80 p-6 sm:p-8 rounded-2xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Send Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Full Name *</Label>
                    <Input
                      placeholder="Alex Mercer"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-background border-border text-xs rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Work Email *</Label>
                    <Input
                      type="email"
                      placeholder="alex@enterprise.com"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="bg-background border-border text-xs rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Company</Label>
                    <Input
                      placeholder="Acme Enterprise"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-background border-border text-xs rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Company Size</Label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="bg-background border-border text-xs rounded-lg">
                        <SelectValue placeholder="Select workforce size" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="1-50">1 - 50 Employees</SelectItem>
                        <SelectItem value="50-200">50 - 200 Employees</SelectItem>
                        <SelectItem value="200-1000">200 - 1,000 Employees</SelectItem>
                        <SelectItem value="1000+">1,000+ Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">Message *</Label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your organization's goals and timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg text-xs p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2.5 rounded-lg shadow-xs"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <OFC360Footer />
    </div>
  );
}
