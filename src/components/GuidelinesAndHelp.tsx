import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';
import { TRUSTED_SOURCES, ADOBE_PNG_STANDARDS } from '../data/constants';

export const GuidelinesAndHelp: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 text-slate-300">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
            Official Contributor Reference
          </span>
          <span className="text-slate-400 text-xs font-mono">
            Synced: October 2026
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Adobe Stock Standards & Tool Integration Guide
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          Comprehensive commercial guidelines, technical rejection avoidance, Muse AI / Google Flow downstream workflow, and opportunity scoring methodology.
        </p>
      </div>

      {/* Grid: 3 Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Adobe PNG Technical Requirements */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            1. Adobe Stock PNG Requirements (June 2026 Policy)
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <strong className="text-slate-100">Resolution:</strong> Between <span className="text-indigo-400 font-mono font-semibold">4 MP and 100 MP</span>. Native 4K outputs (e.g. 3840×2160 = 8.3 MP, or 3000×3000 = 9.0 MP) easily meet this.
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <strong className="text-slate-100">File Size & Color:</strong> Maximum <span className="text-indigo-400 font-mono font-semibold">45 MB</span>. Standard <span className="text-indigo-400 font-mono font-semibold">sRGB</span> color profile.
            </div>
            <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300/90">
              <strong className="text-amber-300">CRITICAL TRANSPARENCY RULE:</strong> Transparent areas must have a genuine 0% alpha channel. Do NOT render a gray-and-white checkerboard pattern. A file extension of `.png` alone does not prove transparency; you must inspect the alpha mask in an image editor before upload.
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <strong className="text-slate-100">Subject Boundaries:</strong> Maintain 2% to 5% safe margin padding around the silhouette. Avoid clipping hair strands, fur, or delicate floral stems.
            </div>
          </div>
        </div>

        {/* Pillar 2: Downstream Tool Handoff: Muse AI & Google Flow */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            2. Downstream Tool Workflow (Muse & Flow)
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <strong className="text-slate-100 block mb-1">Using Prompts in Muse AI (Isolated Cutouts):</strong>
              Click <em>"Copy Muse Prompt"</em> on any cutout card. Paste directly into Muse. Select 4K resolution and 1:1 or asset-specific aspect ratio. Ensure "Transparent Background" is toggled in Muse settings. Verify clean edges before uploading.
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <strong className="text-slate-100 block mb-1">Using Prompts in Google Flow (10s Video B-Roll):</strong>
              Click <em>"Copy Flow Prompt"</em> on any video card. Paste into Google Flow. The prompt locks camera motion and physical continuity. Flow renders smooth horizontal movement without morphing or temporal flicker.
            </div>
          </div>
        </div>
      </div>

      {/* Strict IP / Refusal-Prevention Gate */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          Strict Intellectual Property & Rejection Prevention Gate
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The user previously experienced Adobe Stock rejections categorized as IP issues. To safeguard your contributor account standing, this app enforces zero-tolerance rules:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-rose-400">Prohibited Entities:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
              <li>Never use real artist names (e.g. "in the style of...")</li>
              <li>No brand logos, trademarked products, or signature tech shapes (Apple, Nike, Lego, Tesla, etc.)</li>
              <li>No proprietary UI screens or identifiable copyrighted apps</li>
              <li>No celebrities, living public figures, or fictional characters</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">Approved Best Practices:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
              <li>Use "original generic design" and "unbranded hardware"</li>
              <li>Generate blank screens/packaging so buyers can place their own text</li>
              <li>Always check the "Created with Generative AI" checkbox in Adobe Contributor portal</li>
              <li>Perform a final human visual inspection before clicking Submit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Opportunity Scoring Formula Explained */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          Opportunity Hypothesis Scoring Weights (0–100 Scale)
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Opportunity Score is an explicitly heuristic hypothesis reflecting buyer utility, search-intent, and differentiation. It never promises downloads, sales, or algorithm placement:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">25 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Buyer Utility</div>
            <div className="text-[10px] text-slate-400">Clarity of design/marketing task solved</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">20 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Differentiation Gap</div>
            <div className="text-[10px] text-slate-400">Novel angle vs generic stock clichés</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">15 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Trend Evidence</div>
            <div className="text-[10px] text-slate-400">Verified search signals & seasonal lead</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">10 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Metadata Clarity</div>
            <div className="text-[10px] text-slate-400">Search-intent keywords with zero stuffing</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">10 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Composition Usability</div>
            <div className="text-[10px] text-slate-400">Dedicated copy space & clean framing</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">10 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Technical Feasibility</div>
            <div className="text-[10px] text-slate-400">Physical realism without AI artifacts</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-indigo-400 font-mono text-sm">10 pts</span>
            <div className="font-semibold text-slate-200 mt-0.5">Low IP Risk</div>
            <div className="text-[10px] text-slate-400">Zero copyrighted entities or living styles</div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400 font-mono text-sm">100 Max</span>
            <div className="font-semibold text-slate-200 mt-0.5">Confidence Rating</div>
            <div className="text-[10px] text-slate-400">High / Medium / Low based on recency</div>
          </div>
        </div>
      </div>

      {/* Official Sources and External Links */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Primary Regulatory Documentation Links
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {TRUSTED_SOURCES.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition block group"
            >
              <div className="font-medium text-indigo-400 group-hover:underline flex items-center justify-between">
                <span>{src.title}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {src.publisher} • {src.published_or_updated_date}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
