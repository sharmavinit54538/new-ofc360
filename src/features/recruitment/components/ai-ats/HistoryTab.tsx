import React from "react";
import { Search, FileSearch, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ATSAnalysisResult } from "@/utils/atsScoringEngine";

interface HistoryTabProps {
  history: ATSAnalysisResult[];
  historySearch: string;
  setHistorySearch: (search: string) => void;
  onExportReport: (res: ATSAnalysisResult) => void;
  onDeleteAnalysis: (id: string) => void;
}

export function HistoryTab({ history, historySearch, setHistorySearch, onExportReport, onDeleteAnalysis }: HistoryTabProps) {
  const safeHistory = Array.isArray(history) ? history : [];
  const filteredHistory = safeHistory.filter(
    (h) =>
      h?.candidate?.candidateName?.toLowerCase().includes(historySearch.toLowerCase()) ||
      h?.jobTitle?.toLowerCase().includes(historySearch.toLowerCase()) ||
      h?.recruiterRecommendation?.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Saved Candidate ATS Analysis History</h2>
          <p className="text-xs text-muted-foreground">Audit past resume ATS reports and recruiter match scores.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates or job titles..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            className="pl-9 bg-secondary/30 text-xs h-9 border-border/60 rounded-xl"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Candidate</TableHead>
              <TableHead className="text-xs font-bold">Target Job Title</TableHead>
              <TableHead className="text-xs font-bold">ATS Match Score</TableHead>
              <TableHead className="text-xs font-bold">Recruiter Verdict</TableHead>
              <TableHead className="text-xs font-bold">Analyzed Date</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <FileSearch className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No saved ATS analysis reports</p>
                  <p className="text-[11px]">Analyze candidate resumes and click "Save Analysis" to archive reports here.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    <div>{h.candidate.candidateName}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{h.candidate.email}</div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{h.jobTitle}</TableCell>
                  <TableCell className="text-xs font-mono font-bold text-emerald-500">
                    {h.overallScore} / 100
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      h.overallScore >= 85 ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-amber-500/15 text-amber-500"
                    }>
                      {h.recruiterRecommendation}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{h.analyzedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onExportReport(h)}
                        className="h-7 text-xs text-primary"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteAnalysis(h.id)}
                        className="h-7 text-xs text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}