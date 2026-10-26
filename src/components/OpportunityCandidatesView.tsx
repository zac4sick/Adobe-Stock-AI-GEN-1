import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { OpportunityCandidate, ResearchRun, ScoreBreakdown } from '../types/index.ts';

interface OpportunityCandidatesViewProps {
  researchRun: ResearchRun;
  onGenerateFromCandidates: (selectedCandidates: OpportunityCandidate[]) => void;
  isLoading: boolean;
  targetImageCount: number;
  targetVideoCount: number;
}

export const OpportunityCandidatesView: React.FC<OpportunityCandidatesViewProps> = ({
  researchRun,
  onGenerateFromCandidates,
  isLoading,
  targetImageCount,
  targetVideoCount,
}) => {
  const [candidates, setCandidates] = useState<OpportunityCandidate[]>(() =>
    researchRun.candidates.map((c, i) => ({
      ...c,
      selected: i < Math.max(targetImageCount + targetVideoCount, 3),
    }))
  );

  const [expandedId, setExpandedId] = useState<string | null>(candidates[0]?.id || null);
  const [showSources, setShowSources] = useState<boolean>(false);

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  // "Choose best opportunities for me"
  const handleChooseBest = () => {
    const totalNeeded = targetImageCount + targetVideoCount || 8;
    const sorted = [...candidates].sort((a, b) => b.opportunity_score - a.opportunity_score);
    const topIds = new Set(sorted.slice(0, totalNeeded).map((c) => c.id));

    setCandidates((prev) =>
      prev.map((c) => ({
        ...c,
        selected: topIds.has(c.id),
      }))
    );
  };

  const selectedCount = candidates.filter((c) => c.selected).length;
  const selectedCandidates = candidates.filter((c) => c.selected);

  // Score color helper
  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (score >= 85) return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
    return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Research Brief Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                Dated Research Brief
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Date: {researchRun.research_date}
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">
                Market: <span className="text-slate-200 capitalize">{researchRun.target_market}</span>
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs">
                Window: <span className="text-slate-200">{researchRun.trend_window}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Adobe Stock Opportunity Signals & Gap Analysis
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              Sources & Citations ({researchRun.sources.length})
            </button>
            <button
              onClick={handleChooseBest}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium text-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Choose Best For Me
            </button>
          </div>
        </div>

        {/* Trend Verification & Honest Status Callout */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Google Trends Signal Status
            </span>
            {researchRun.google_trends_status === 'verified' ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Grounded Search Verified
              </span>
            ) : (
              <span className="text-amber-400/90 font-medium flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Direct Trends Data Unverified (Proxy Mode)
              </span>
            )}
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Never promises sales volume. Evaluated as directional hypotheses.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Market Saturation Warning
            </span>
            <p className="text-[11px] text-slate-300 line-clamp-3 leading-snug">
              {researchRun.market_saturation_summary}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Unmet Buyer Problem
            </span>
            <p className="text-[11px] text-slate-300 line-clamp-3 leading-snug">
              {researchRun.buyer_problems_summary}
            </p>
          </div>
        </div>

        {/* Sources Drawer */}
        {showSources && (
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-2 bg-slate-950/90 p-4 rounded-lg">
            <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              Verifiable Contributor Guidance & Trend Grounding Sources:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {researchRun.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition block group"
                >
                  <div className="font-medium text-indigo-400 group-hover:underline flex items-center justify-between">
                    <span className="truncate pr-2">{src.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{src.publisher}</span>
                    <span>•</span>
                    <span>{src.published_or_updated_date}</span>
                    <span>•</span>
                    <span className="capitalize">{src.evidence_type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {src.what_it_supports}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Candidate List Header & Action */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        <div className="text-xs text-slate-300">
          Ranked Candidates: <strong className="text-white font-mono">{candidates.length}</strong> | Selected for Prompt Studio: <strong className="text-indigo-400 font-mono">{selectedCount}</strong>
          <span className="text-slate-400 ml-2 text-[11px]">
            (Target: {targetImageCount} imgs + {targetVideoCount} vids)
          </span>
        </div>

        <button
          onClick={() => onGenerateFromCandidates(selectedCandidates)}
          disabled={selectedCount === 0 || isLoading}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-900 flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {isLoading ? 'Synthesizing Prompts...' : `Generate Prompts for ${selectedCount} Selected`}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Candidate Cards Grid */}
      <div className="space-y-3">
        {candidates.map((cand) => {
          const isExpanded = expandedId === cand.id;
          const b: ScoreBreakdown = cand.score_breakdown;

          return (
            <div
              key={cand.id}
              className={`rounded-xl border transition-all ${
                cand.selected
                  ? 'bg-slate-900/90 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-4 flex items-start gap-3.5">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={cand.selected}
                  onChange={() => handleToggleSelect(cand.id)}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                />

                {/* Main Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {cand.suggested_asset_type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {cand.suggested_aspect_ratio}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                          {cand.buyer_persona}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                          Placement: {cand.placement.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 leading-snug">
                        {cand.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {cand.concept}
                      </p>
                    </div>

                    {/* Score Badge */}
                    <div className="shrink-0 text-right">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-xs ${getScoreBadge(
                          cand.opportunity_score
                        )}`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{cand.opportunity_score}/100</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 capitalize">
                        Confidence: <span className="font-semibold text-slate-300">{cand.confidence}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-950/50 border border-slate-800">
                      <span className="font-semibold text-rose-400/90 flex items-center gap-1 mb-0.5">
                        <AlertTriangle className="w-3 h-3" /> Competitor Cliché / Saturation:
                      </span>
                      <p className="text-slate-400 leading-snug">{cand.market_saturation_signs}</p>
                    </div>

                    <div className="p-2 rounded bg-slate-950/50 border border-slate-800">
                      <span className="font-semibold text-emerald-400/90 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3" /> Differentiated Angle:
                      </span>
                      <p className="text-slate-400 leading-snug">{cand.differentiation_gap}</p>
                    </div>
                  </div>

                  {/* Expand Breakdown Toggle */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : cand.id)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
                    >
                      {isExpanded ? (
                        <>
                          Hide 7-Point Opportunity Score Rationale <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          Inspect 7-Point Opportunity Score Breakdown <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-400">
                      Target Generator: <strong className="text-slate-300 font-mono">{cand.suggested_generator}</strong>
                    </span>
                  </div>

                  {/* Expanded 7-Point Heuristic Score Breakdown */}
                  {isExpanded && b && (
                    <div className="mt-3 p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">
                          Opportunity Hypothesis Components (Heuristic 0–100):
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          Hypothesis based on buyer utility, not guaranteed sales.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Buyer Utility (25 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.buyer_utility} / 25
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Differentiation Gap (20 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.differentiation} / 20
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Trend Evidence (15 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.trend_evidence} / 15
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Metadata Clarity (10 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.metadata_clarity} / 10
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Composition Usability (10 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.composition_usability} / 10
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Technical Feasibility (10 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.generation_feasibility} / 10
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Low IP Risk (10 max)</div>
                          <div className="font-mono font-bold text-indigo-400 text-sm mt-0.5">
                            {b.ip_risk_score} / 10
                          </div>
                        </div>

                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <div className="text-slate-400">Confidence Rationale</div>
                          <div className="text-[10px] text-slate-300 mt-0.5 truncate">
                            {cand.confidence_reason}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <strong className="text-slate-300">Grounding Rationale:</strong> {cand.evidence_summary}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action Sticky Bar */}
      <div className="sticky bottom-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {selectedCount}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              {selectedCount} Opportunities Selected for Generation
            </div>
            <div className="text-[11px] text-slate-400">
              Ready to construct submission-ready prompts, metadata CSV, and quality audit.
            </div>
          </div>
        </div>

        <button
          onClick={() => onGenerateFromCandidates(selectedCandidates)}
          disabled={selectedCount === 0 || isLoading}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-900/40 flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {isLoading ? 'Generating Production Pack...' : 'Generate Production Prompts Now'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
