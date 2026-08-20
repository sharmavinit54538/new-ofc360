import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Search, Upload, CheckCircle2, Globe, Sparkles, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useATSStore } from "@/stores/atsStore";
import { JobOpening } from "@/types/ats";
import { toast } from "sonner";

export default function PublicCareersPage() {
  const { jobs, addCandidate } = useATSStore();
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [search, setSearch] = useState("");

  // Application Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const publishedJobs = jobs.filter((j) => j.status === "Published");

  const filteredJobs = publishedJobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitApplication = () => {
    if (!firstName || !lastName || !email) return toast.error("Please complete required contact fields");
    if (!selectedJob) return;

    addCandidate({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      firstName,
      lastName,
      email,
      phone: phone || "+1 (555) 000-1122",
      location: "San Francisco, CA",
      source: "Careers Site",
      stage: "Applied",
      aiMatchScore: Math.floor(Math.random() * 20) + 80,
      aiSummary: `Direct candidate application submitted for ${selectedJob.title} via Public Careers Portal.`,
      skills: ["React", "TypeScript", "Problem Solving"],
      experienceYears: 5,
      tags: ["Direct Applicant"],
      rating: 4,
      notes: [],
      status: "Active"
    });

    setSubmitted(true);
    toast.success("Application successfully submitted!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Careers Header */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center font-bold text-primary-foreground">
            N
          </div>
          <div>
            <h1 className="font-bold text-base leading-none">NeuraCore Careers</h1>
            <p className="text-[11px] text-muted-foreground">Shape the future of enterprise intelligence</p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
          Open Roles ({publishedJobs.length})
        </Badge>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1">
            We're Hiring Top Talent
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Build Next-Generation Enterprise AI Systems With Us
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore open opportunities across engineering, product design, AI research, and sales.
          </p>

          <div className="relative max-w-lg mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title, department, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-slate-900/60 border-border/50 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Featured Positions</h3>

          {filteredJobs.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
              No matching position found. Check back soon for new role postings!
            </div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-hover rounded-2xl p-6 border border-border/50 bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" /> {job.location}
                    </span>
                  </div>
                  <h4 className="font-bold text-xl">{job.title}</h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.currency} · {job.workType} · {job.employmentType}
                  </p>
                </div>

                <Button size="default" onClick={() => { setSelectedJob(job); setSubmitted(false); }} className="gradient-bg gap-1.5 shadow-md">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Application Dialog Modal */}
      <Dialog open={Boolean(selectedJob)} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <div>
              {!submitted ? (
                <div className="space-y-4 py-2 text-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{selectedJob.title}</DialogTitle>
                    <p className="text-xs text-muted-foreground">{selectedJob.department} · {selectedJob.location}</p>
                  </DialogHeader>

                  <div className="space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/40 text-xs">
                    <h5 className="font-bold text-foreground">Role Description</h5>
                    <p className="text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>First Name *</Label>
                      <Input placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Email Address *</Label>
                      <Input type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input placeholder="+1 (555) 000-1122" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Resume (PDF/DOCX)</Label>
                    <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors bg-secondary/20">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Click to upload or drag resume file</p>
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Cancel</Button>
                    <Button onClick={handleSubmitApplication} className="gradient-bg gap-1.5">
                      Submit Application <Send className="w-4 h-4" />
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold">Application Received!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you for applying for the <span className="font-bold text-foreground">{selectedJob.title}</span> position. Our AI ATS parsing engine will review your application shortly.
                  </p>
                  <Button onClick={() => setSelectedJob(null)} className="gradient-bg">Close Window</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}