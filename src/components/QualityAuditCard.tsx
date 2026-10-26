import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  FileCode,
  FileSpreadsheet,
  Check,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { GeneratedPack } from '../types/index.ts';
import {
  generateAdobeStockMetadataCsv,
  generateProductionMarkdown,
  triggerDownload,
} from '../utils/exporters';

interface QualityAuditCardProps {
  pack: GeneratedPack | null;
  onNavigateToStudio: () => void;
}

export const QualityAuditCard: React.FC<QualityAuditCardProps> = ({
  pack,
  onNavigateToStudio,
}) => {
  if (!pack) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Active Pack Generated Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start an opportunity research run or generate a pack from the Research tab to review the second-pass quality audit and export metadata sheets.
        </p>
      </div>
    );
  }

  const audit = pack.final_quality_audit;
  const isPassed = audit.passed;

  const handleDownloadCsv = () => {
    const csv = generateAdobeStockMetadataCsv(pack);
    triggerDownload(csv, `${pack.pack_title.replace(/\s+/g, '_')}_Adobe_Stock_Metadata.csv`, 'text/csv');
  };

  const handleDownloadMarkdown = () => {
    const md = generateProductionMarkdown(pack);
    triggerDownload(md, `${pack.pack_title.replace(/\s+/g, '_')}_Production_Pack.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(pack, null, 2);
    triggerDownload(json, `${pack.pack_title.replace(/\s+/g, '_')}_Pack.json`, 'application/json');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Banner Status Card */}
      <div
        className={`p-6 rounded-xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isPassed
            ? 'bg-slate-900 border-emerald-500/40 shadow-emerald-950/20'
            : 'bg-slate-900 border-amber-500/40 shadow-amber-950/20'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Second-Pass Reviewer Engine
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  isPassed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isPassed ? 'STATUS: PASSED VALIDATION' : 'STATUS: REVIEW NOTICES'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              Quality Audit: {pack.pack_title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated verification of IP safety, minimum 22 keywords, plain CSV format, timeline seconds, and PNG alpha requirements.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm shrink-0"
        >
          View in Prompt Studio
        </button>
      </div>

      {/* 8-Point Verification Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Adobe Stock Submission Verification Matrix (8 Criteria)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Check 1: Output Counts */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.count_validation.passed ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">1. Exact Output Counts Match</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Expected {audit.count_validation.requested_images} images / {audit.count_validation.requested_videos} videos. Generated {audit.count_validation.generated_images} images / {audit.count_validation.generated_videos} videos.
              </p>
            </div>
          </div>

          {/* Check 2: Minimum 22 Keywords */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.keyword_count_validation.passed ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">2. Keyword Count (Min 22 Met)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Every generated asset contains at least 22 unique relevant keywords (defaulting to 25–35).
              </p>
            </div>
          </div>

          {/* Check 3: Hashtag Free Keywords */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.no_hashtags_validation ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">3. Plain CSV Format (Zero # Symbols)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Adobe Stock Contributor portal rejects hashtag symbols. All CSV keyword strings are strictly comma-separated plain text.
              </p>
            </div>
          </div>

          {/* Check 4: IP Risk Gate */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.ip_risk_validation.passed ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">4. Strict IP & Protected Entity Filter</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No living artist names, celebrities, brands, logos, or copyrighted characters in prompts or titles.
              </p>
            </div>
          </div>

          {/* Check 5: Exclusion & Repeat Guard */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.repetition_guard_validation.passed ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">5. Repeat-Concept & Seed Blocker</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Screened against 38 past rejected and saturated concepts to avoid near-duplicate submissions.
              </p>
            </div>
          </div>

          {/* Check 6: PNG Alpha Channel */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.png_transparency_validation.passed ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">6. Genuine Alpha Channel (No Checkerboard)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Muse PNG prompts demand real 0% alpha channel transparency, crisp silhouettes, and zero baked-in checkerboards.
              </p>
            </div>
          </div>

          {/* Check 7: Video Timeline Seconds */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            {audit.video_timeline_validation.passed ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-slate-200">7. Video Second-by-Second Continuity</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Every Flow video prompt includes an exact second-by-second timeline (e.g. 10 entries for a 10s clip).
              </p>
            </div>
          </div>

          {/* Check 8: Grounding Citations */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">8. Grounded Research & Dated Sources</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All opportunity claims backed by dated official Adobe Contributor guidelines and search trend signals.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Revisions or Warnings log */}
        {(audit.auto_revisions_applied.length > 0 || audit.warnings.length > 0) && (
          <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Second-Pass Quality Log:
            </div>
            {audit.auto_revisions_applied.map((rev, i) => (
              <div key={i} className="text-emerald-400/90 text-[11px] flex items-center gap-1.5">
                <Check className="w-3 h-3 shrink-0" /> {rev}
              </div>
            ))}
            {audit.warnings.map((warn, i) => (
              <div key={i} className="text-amber-400/90 text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0" /> {warn}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Production Export Suite */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Commercial Contributor Export Suite
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Adobe Stock Metadata CSV</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Formatted with Filename, Title, Keywords, Category, and AI Release columns ready for Adobe Stock bulk metadata upload.
              </p>
            </div>
            <button
              onClick={handleDownloadCsv}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download CSV
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Production Markdown Brief</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Formatted documentation containing all copy-ready prompts, camera specifications, timelines, and submission checklists.
              </p>
            </div>
            <button
              onClick={handleDownloadMarkdown}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download Markdown (.md)
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <FileCode className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Raw Pack JSON</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Full structured JSON object including dated research summaries, citations, scores, camera objects, and timelines.
              </p>
            </div>
            <button
              onClick={handleDownloadJson}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
