import React, { useState, useEffect } from 'react';
import { NavigationRail, ActiveTab } from './components/NavigationRail';
import { ResearchForm } from './components/ResearchForm';
import { OpportunityCandidatesView } from './components/OpportunityCandidatesView';
import { PromptStudio } from './components/PromptStudio';
import { PortfolioLedgerView } from './components/PortfolioLedgerView';
import { QualityAuditCard } from './components/QualityAuditCard';
import { GuidelinesAndHelp } from './components/GuidelinesAndHelp';
import { SettingsModal } from './components/SettingsModal';
import {
  GeneratedPack,
  ImagePromptItem,
  OpportunityCandidate,
  PackGenerationParams,
  PortfolioLedgerEntry,
  ResearchRun,
  VideoPromptItem,
} from './types';
import { SAMPLE_PORTFOLIO_LEDGER } from './data/constants';
import { Sparkles, CheckCircle2, AlertTriangle, Compass, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('research');

  // Pack & Research state
  const [currentPack, setCurrentPack] = useState<GeneratedPack | null>(() => {
    try {
      const saved = localStorage.getItem('as_current_pack');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [researchRun, setResearchRun] = useState<ResearchRun | null>(() => {
    try {
      const saved = localStorage.getItem('as_research_run');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Portfolio ledger state stored in localStorage
  const [portfolioEntries, setPortfolioEntries] = useState<PortfolioLedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem('as_portfolio_ledger');
      return saved ? JSON.parse(saved) : SAMPLE_PORTFOLIO_LEDGER;
    } catch {
      return SAMPLE_PORTFOLIO_LEDGER;
    }
  });

  // Target counts for candidate view
  const [targetImageCount, setTargetImageCount] = useState<number>(8);
  const [targetVideoCount, setTargetVideoCount] = useState<number>(5);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    if (currentPack) {
      localStorage.setItem('as_current_pack', JSON.stringify(currentPack));
    }
  }, [currentPack]);

  useEffect(() => {
    if (researchRun) {
      localStorage.setItem('as_research_run', JSON.stringify(researchRun));
    }
  }, [researchRun]);

  useEffect(() => {
    localStorage.setItem('as_portfolio_ledger', JSON.stringify(portfolioEntries));
  }, [portfolioEntries]);

  const showToast = (text: string, type: 'success' | 'warn' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Run Opportunity Research
  const handleRunResearch = async (params: PackGenerationParams) => {
    setIsLoading(true);
    setTargetImageCount(params.imageCount);
    setTargetVideoCount(params.videoCount);

    try {
      const portfolioTitles = portfolioEntries.map((e) => e.title);
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: params.niche,
          assetType: params.assetTypes[0] || 'mixed_pack',
          buyer: params.buyerFocus,
          placement: params.placement,
          horizon: params.trendHorizon,
          market: params.targetMarket,
          creativeDirection: params.creativeDirection,
          gapStrategy: params.gapStrategy,
          exclusions: params.exclusions,
          portfolioTitles,
        }),
      });

      if (!res.ok) throw new Error('Research request failed');
      const data: ResearchRun = await res.json();
      setResearchRun(data);
      showToast(`Research completed with ${data.candidates.length} dated opportunity candidates!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Research error: ' + (err.message || 'Server unavailable'), 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Direct Generate Pack
  const handleDirectGenerate = async (params: PackGenerationParams) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error('Generation failed');
      const pack: GeneratedPack = await res.json();
      setCurrentPack(pack);
      setActiveTab('studio');
      showToast(`Generated pack: ${pack.images.length} images & ${pack.videos.length} videos!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Generation error: ' + (err.message || 'Server error'), 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Generate from Selected Candidates
  const handleGenerateFromCandidates = async (selectedCandidates: OpportunityCandidate[]) => {
    setIsLoading(true);
    try {
      const imagesRequested = selectedCandidates.filter(
        (c) => c.suggested_asset_type !== 'flow_video'
      ).length;
      const videosRequested = selectedCandidates.filter(
        (c) => c.suggested_asset_type === 'flow_video'
      ).length;

      const res = await fetch('/api/generate-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset: 'custom',
          niche: selectedCandidates[0]?.niche || 'General',
          selectedCandidates,
          imageCount: imagesRequested > 0 ? imagesRequested : targetImageCount,
          videoCount: videosRequested > 0 ? videosRequested : targetVideoCount,
          assetTypes: ['photorealistic_photo', 'isolated_transparent_png', 'flow_video'],
          buyerFocus: selectedCandidates[0]?.buyer_persona || 'Graphic & UI Designers',
          placement: selectedCandidates[0]?.placement || 'website_hero',
          videoDurationSec: 10,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate from candidates');
      const pack: GeneratedPack = await res.json();
      setCurrentPack(pack);
      setActiveTab('studio');
      showToast(`Generated production pack for ${pack.images.length + pack.videos.length} assets!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Synthesis error: ' + (err.message || 'Failed to generate'), 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Add individual prompt to portfolio ledger
  const handleAddToLedger = (item: ImagePromptItem | VideoPromptItem, type: 'image' | 'video') => {
    const isImage = type === 'image';
    const hasMuse = isImage && Boolean((item as ImagePromptItem).muse_prompt);

    const newEntry: PortfolioLedgerEntry = {
      asset_id: `AS-${Date.now().toString().slice(-4)}`,
      created_date: new Date().toISOString().split('T')[0],
      niche: item.niche,
      asset_type: item.asset_type || (type === 'video' ? 'flow_video' : 'photorealistic_photo'),
      buyer_persona: item.buyer_persona,
      placement: item.placement,
      concept: item.concept,
      title: item.adobe_stock_title,
      visual_hook: item.selling_point,
      aspect_ratio: item.aspect_ratio,
      generator: type === 'video' ? 'google_flow' : hasMuse ? 'muse_ai' : 'general_image_model',
      keywords_csv: item.keywords_csv,
      status: 'generated',
      refusal_reason: '',
      notes: `Hypothesis Score: ${item.opportunity_score}/100. IP Status: ${item.ip_risk}.`,
    };

    setPortfolioEntries([newEntry, ...portfolioEntries]);
    showToast(`Added "${item.adobe_stock_title}" to Portfolio Ledger!`, 'success');
  };

  // Reset portfolio
  const handleResetPortfolio = () => {
    setPortfolioEntries(SAMPLE_PORTFOLIO_LEDGER);
    showToast('Restored default portfolio ledger template.', 'info');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Navigation Rail */}
      <NavigationRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPack={currentPack}
        portfolioCount={portfolioEntries.length}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-400" />}
            <span className="text-slate-100">{toastMessage.text}</span>
          </div>
        )}

        {/* Dynamic View Panels */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'research' && (
            <div className="space-y-8">
              <ResearchForm
                onRunResearch={handleRunResearch}
                onDirectGenerate={handleDirectGenerate}
                isLoading={isLoading}
              />

              {researchRun && (
                <OpportunityCandidatesView
                  researchRun={researchRun}
                  onGenerateFromCandidates={handleGenerateFromCandidates}
                  isLoading={isLoading}
                  targetImageCount={targetImageCount}
                  targetVideoCount={targetVideoCount}
                />
              )}
            </div>
          )}

          {activeTab === 'studio' && (
            <div>
              {currentPack ? (
                <PromptStudio
                  pack={currentPack}
                  onAddToLedger={handleAddToLedger}
                />
              ) : (
                <div className="max-w-2xl mx-auto p-12 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
                  <Compass className="w-12 h-12 text-indigo-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-200">No Prompt Pack Active</h3>
                  <p className="text-xs text-slate-400">
                    Use the <strong>Opportunity Research</strong> tab to analyze a commercial niche and generate prompts for Muse AI, general image models, or Google Flow.
                  </p>
                  <button
                    onClick={() => setActiveTab('research')}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Go to Research & Start Pack
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <PortfolioLedgerView
              entries={portfolioEntries}
              onUpdateEntries={setPortfolioEntries}
            />
          )}

          {activeTab === 'audit' && (
            <QualityAuditCard
              pack={currentPack}
              onNavigateToStudio={() => setActiveTab('studio')}
            />
          )}

          {activeTab === 'guidelines' && <GuidelinesAndHelp />}

          {activeTab === 'settings' && (
            <SettingsModal
              onResetPortfolio={handleResetPortfolio}
              portfolioCount={portfolioEntries.length}
            />
          )}
        </div>
      </main>
    </div>
  );
}
