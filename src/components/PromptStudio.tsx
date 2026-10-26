import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileText,
  Film,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Camera,
  Sun,
  Clock,
  Volume2,
  FileCode,
} from 'lucide-react';
import { GeneratedPack, ImagePromptItem, VideoPromptItem } from '../types/index.ts';
import {
  generateAdobeStockMetadataCsv,
  generateProductionMarkdown,
  triggerDownload,
} from '../utils/exporters';

interface PromptStudioProps {
  pack: GeneratedPack;
  onAddToLedger: (item: ImagePromptItem | VideoPromptItem, type: 'image' | 'video') => void;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({ pack, onAddToLedger }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);
  const [savedLedgerIds, setSavedLedgerIds] = useState<Set<string>>(new Set());

  // Copy helper with feedback
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Add to ledger
  const handleSaveToLedger = (item: ImagePromptItem | VideoPromptItem, type: 'image' | 'video') => {
    onAddToLedger(item, type);
    setSavedLedgerIds((prev) => new Set([...prev, item.id]));
  };

  // Download handlers
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
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Action Bar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              Production Studio
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Preset: {pack.preset.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {pack.pack_title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {pack.images.length} Image Prompts • {pack.videos.length} Flow Video Prompts • Submission Ready
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
            title="CSV matching Adobe Stock Contributor Portal bulk metadata"
          >
            <Download className="w-3.5 h-3.5" />
            Download Metadata CSV
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            title="Formatted production pack in Markdown"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Export Markdown
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            title="Complete pack JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Media Type Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveMediaTab('images')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeMediaTab === 'images'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Image Prompts ({pack.images.length})
        </button>

        <button
          onClick={() => setActiveMediaTab('videos')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeMediaTab === 'videos'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          Flow Video Prompts ({pack.videos.length})
        </button>
      </div>

      {/* IMAGE PROMPTS LIST */}
      {activeMediaTab === 'images' && (
        <div className="space-y-6">
          {pack.images.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No image prompts in this pack. Switch to Video Prompts tab or start a new pack.
            </div>
          ) : (
            pack.images.map((img, index) => {
              const isMuse = Boolean(img.muse_prompt);
              const isSaved = savedLedgerIds.has(img.id);

              return (
                <div
                  key={img.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md space-y-4 relative"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                          #{index + 1} • {img.asset_type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Ratio: {img.aspect_ratio}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Buyer: {img.buyer_persona}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Placement: {img.placement}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100">
                          {img.adobe_stock_title}
                        </h3>
                        <button
                          onClick={() => handleCopy(img.adobe_stock_title, `title-${img.id}`)}
                          className="text-slate-400 hover:text-slate-200 transition"
                          title="Copy title"
                        >
                          {copiedKey === `title-${img.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scores & Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-right">
                        <div className="text-[10px] text-slate-400">Hypothesis</div>
                        <div className="font-mono font-bold text-xs text-indigo-400">
                          {img.opportunity_score}/100
                        </div>
                      </div>

                      <div
                        className={`px-2.5 py-1 rounded border text-[10px] font-medium flex items-center gap-1 ${
                          img.ip_risk === 'low'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}
                      >
                        {img.ip_risk === 'low' ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>IP: {img.ip_risk.toUpperCase()}</span>
                      </div>

                      <button
                        onClick={() => handleSaveToLedger(img, 'image')}
                        disabled={isSaved}
                        className={`px-3 py-1 rounded border text-xs font-semibold flex items-center gap-1 transition ${
                          isSaved
                            ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        {isSaved ? 'In Ledger' : 'Add to Ledger'}
                      </button>
                    </div>
                  </div>

                  {/* Muse Transparent PNG / Standard Image Prompt Box */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {isMuse ? 'Muse AI Transparent PNG Prompt (Copy-Ready):' : 'Photorealistic Scene Prompt:'}
                      </label>
                      <button
                        onClick={() =>
                          handleCopy(img.muse_prompt || img.image_prompt, `prompt-${img.id}`)
                        }
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition flex items-center gap-1.5 shadow-sm"
                      >
                        {copiedKey === `prompt-${img.id}` ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Prompt
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed select-all">
                      {img.muse_prompt || img.image_prompt}
                    </div>

                    {/* PNG Alpha Channel Inspection Warning */}
                    {isMuse && (
                      <div className="mt-2 text-[11px] text-amber-300/80 bg-amber-950/20 border border-amber-900/30 p-2 rounded">
                        <strong>Muse PNG Quality Gate:</strong> Requires native 4K output, genuine 0% alpha channel background, and NO checkerboard grid. Inspect alpha transparency in software before submitting to Adobe Stock.
                      </div>
                    )}
                  </div>

                  {/* Technical Controls & Camera */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <Camera className="w-3 h-3 text-indigo-400" /> Camera & Lens Parameters
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div><strong>Lens:</strong> {img.camera.lens || 'N/A'}</div>
                        <div><strong>Angle / Framing:</strong> {img.camera.angle || 'N/A'}, {img.camera.framing || 'N/A'}</div>
                        <div><strong>Focus:</strong> {img.camera.focus || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <Sun className="w-3 h-3 text-amber-400" /> Studio & Ambient Lighting
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div><strong>Style:</strong> {img.lighting.style || 'N/A'}</div>
                        <div><strong>Direction:</strong> {img.lighting.direction || 'N/A'}</div>
                        <div><strong>Shadows:</strong> {img.lighting.shadows_reflections || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Keywords Section (>= 22 enforced) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Adobe Stock Metadata Keywords:
                        </label>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            img.keywords_array.length >= 22
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {img.keywords_array.length} Keywords (Min 22 Met)
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(img.keywords_csv, `kw-${img.id}`)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                      >
                        {copiedKey === `kw-${img.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied CSV!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Keywords CSV (No #)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Keywords Pills */}
                    <div className="flex flex-wrap gap-1 p-2 bg-slate-950 rounded-lg border border-slate-800/80 max-h-24 overflow-y-auto">
                      {img.keywords_array.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Submission Checklist */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span><strong>AI Checkbox:</strong> Required on Upload</span>
                      <span>•</span>
                      <span><strong>IP Status:</strong> {img.ip_risk_reason}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {img.resolution_guidance}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIDEO PROMPTS LIST */}
      {activeMediaTab === 'videos' && (
        <div className="space-y-6">
          {pack.videos.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No video prompts in this pack. Switch to Image Prompts tab or select a Video preset.
            </div>
          ) : (
            pack.videos.map((vid, index) => {
              const isTimelineExpanded = expandedTimelineId === vid.id;
              const isSaved = savedLedgerIds.has(vid.id);

              return (
                <div
                  key={vid.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md space-y-4 relative"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          VIDEO #{index + 1} • {vid.duration_sec}s CLIP
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {vid.aspect_ratio} ({vid.frame_rate_guidance})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Buyer: {vid.buyer_persona}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Generator: Google Flow
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100">
                          {vid.adobe_stock_title}
                        </h3>
                        <button
                          onClick={() => handleCopy(vid.adobe_stock_title, `vtitle-${vid.id}`)}
                          className="text-slate-400 hover:text-slate-200 transition"
                          title="Copy title"
                        >
                          {copiedKey === `vtitle-${vid.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scores & Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-right">
                        <div className="text-[10px] text-slate-400">Hypothesis</div>
                        <div className="font-mono font-bold text-xs text-amber-400">
                          {vid.opportunity_score}/100
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveToLedger(vid, 'video')}
                        disabled={isSaved}
                        className={`px-3 py-1 rounded border text-xs font-semibold flex items-center gap-1 transition ${
                          isSaved
                            ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        {isSaved ? 'In Ledger' : 'Add to Ledger'}
                      </button>
                    </div>
                  </div>

                  {/* Flow Video Prompt */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Google Flow Copy-Ready Video Prompt:
                      </label>
                      <button
                        onClick={() => handleCopy(vid.flow_prompt, `vprompt-${vid.id}`)}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] transition flex items-center gap-1.5 shadow-sm"
                      >
                        {copiedKey === `vprompt-${vid.id}` ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Flow Prompt
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed select-all">
                      {vid.flow_prompt}
                    </div>
                  </div>

                  {/* Second-by-Second Timeline (Mandatory for Flow!) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedTimelineId(isTimelineExpanded ? null : vid.id)
                        }
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition"
                      >
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        Second-by-Second Physical Timeline ({vid.timeline.length} seconds)
                        {isTimelineExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className="text-[10px] text-slate-400 font-mono">
                        Plausible continuous motion (No morphing)
                      </span>
                    </div>

                    {/* Timeline entries view */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vid.timeline
                        .slice(0, isTimelineExpanded ? vid.timeline.length : 4)
                        .map((entry) => (
                          <div
                            key={entry.second}
                            className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] flex items-start gap-2"
                          >
                            <span className="font-mono font-bold text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded shrink-0">
                              0:{String(entry.second).padStart(2, '0')}
                            </span>
                            <span className="text-slate-300">{entry.action}</span>
                          </div>
                        ))}
                    </div>

                    {!isTimelineExpanded && vid.timeline.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setExpandedTimelineId(vid.id)}
                        className="text-[11px] text-slate-400 hover:text-indigo-400 mt-2 block"
                      >
                        + Show all {vid.timeline.length} seconds...
                      </button>
                    )}
                  </div>

                  {/* Audio & Continuity Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <Volume2 className="w-3 h-3 text-indigo-400" /> Audio Design (No Baked Music)
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div><strong>Ambient:</strong> {vid.audio.ambient}</div>
                        <div><strong>SFX:</strong> {vid.audio.sfx.join(', ')}</div>
                        <div><strong>Music:</strong> {vid.audio.music}</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Physical Continuity Lock
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {vid.physical_continuity}
                      </div>
                    </div>
                  </div>

                  {/* Keywords Section (>= 22 keywords) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Video Metadata Keywords:
                        </label>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {vid.keywords_array.length} Keywords (Zero # symbols)
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(vid.keywords_csv, `vkw-${vid.id}`)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                      >
                        {copiedKey === `vkw-${vid.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Keywords CSV
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 p-2 bg-slate-950 rounded-lg border border-slate-800/80 max-h-24 overflow-y-auto">
                      {vid.keywords_array.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
