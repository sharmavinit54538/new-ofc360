import { motion } from "framer-motion";
import { FileText, ScanLine, CheckCircle2, AlertTriangle, Sparkles, Upload } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const docs = [
  { name: "Offer_Letter_AriaWalker.pdf", type: "Offer", status: "verified", confidence: 99, summary: "Standard offer letter — base $145k, RSU $40k/yr, joining 12 May." },
  { name: "MSA_Acme_2026.pdf", type: "Contract", status: "review", confidence: 86, summary: "Liability cap reduced to 1x fees. Termination notice changed to 60 days." },
  { name: "ID_Proof_Jonas.jpg", type: "KYC", status: "verified", confidence: 97, summary: "Passport extracted: Jonas Park, valid until 2031." },
  { name: "NDA_VendorX.pdf", type: "NDA", status: "flagged", confidence: 64, summary: "Non-compete clause overly broad — recommend revision." },
];

export default function AIDocumentIntelligencePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header">AI Document Intelligence</h1>
          <p className="page-subheader">OCR · Contract analysis · Auto-summary · Verification</p>
        </div>
        <Button className="gap-1"><Upload className="w-4 h-4" /> Upload Document</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Documents Processed" value="4,218" change="+126 this week" changeType="up" icon={FileText} />
        <StatCard title="OCR Accuracy" value="98.7%" change="Excellent" changeType="up" icon={ScanLine} />
        <StatCard title="Auto-Verified" value="3,891" change="92%" changeType="up" icon={CheckCircle2} />
        <StatCard title="Flagged" value="47" change="Needs review" changeType="down" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <motion.div key={d.name} whileHover={{ y: -2 }} className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-12 rounded-md gradient-bg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm leading-tight">{d.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.type}</p>
                </div>
              </div>
              <Badge variant="outline" className={
                d.status === "verified" ? "border-success/40 text-success" :
                d.status === "flagged" ? "border-destructive/40 text-destructive" :
                "border-warning/40 text-warning"
              }>{d.status}</Badge>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/40">
              <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{d.summary}</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">AI Confidence</span><span className="font-mono">{d.confidence}%</span></div>
              <Progress value={d.confidence} className="h-1.5" />
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">View</Button>
              <Button size="sm" className="flex-1 h-8 text-xs">Approve</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}