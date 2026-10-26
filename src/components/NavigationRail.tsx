import React from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  ShieldCheck,
  BookOpen,
  Settings,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { GeneratedPack } from '../types/index.ts';

export type ActiveTab = 'research' | 'studio' | 'portfolio' | 'audit' | 'guidelines' | 'settings';

interface NavigationRailProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentPack: GeneratedPack | null;
  portfolioCount: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  setActiveTab,
  currentPack,
  portfolioCount,
}) => {
  const totalAssets = currentPack ? currentPack.images.length + currentPack.videos.length : 0;
  const auditPassed = currentPack ? currentPack.final_quality_audit.passed : true;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'research',
      label: 'Opportunity Research',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'studio',
      label: 'Prompt Studio',
      icon: <Sparkles className="w-5 h-5" />,
      badge: totalAssets > 0 ? totalAssets : undefined,
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'portfolio',
      label: 'Portfolio & Guard',
      icon: <Layers className="w-5 h-5" />,
      badge: portfolioCount > 0 ? portfolioCount : undefined,
      badgeColor: 'bg-slate-700 text-slate-200',
    },
    {
      id: 'audit',
      label: 'Audit & Exports',
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: currentPack ? (auditPassed ? 'Passed' : 'Review') : undefined,
      badgeColor: auditPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white',
    },
    {
      id: 'guidelines',
      label: 'Adobe Guidelines & Help',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Lab Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none text-slate-300">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-950">
              AS
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm leading-tight tracking-tight">
                Stock Asset
              </h1>
              <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider block">
                Opportunity Lab
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Adobe Stock commercial research, gap analysis & prompt engineering studio.
          </p>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Status Panel */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>Active Pack:</span>
          <span className="text-slate-200 font-medium truncate max-w-[120px]">
            {currentPack ? currentPack.preset.replace('_', ' ') : 'None Loaded'}
          </span>
        </div>

        {currentPack && (
          <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Quality Audit:</span>
              {auditPassed ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Validated
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Checks Needed
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Images / Videos:</span>
              <span className="text-slate-200 font-mono">
                {currentPack.images.length} imgs / {currentPack.videos.length} vids
              </span>
            </div>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
          <span>Adobe Contributor Rules:</span>
          <span className="text-emerald-400 font-medium">Synced Oct 2026</span>
        </div>
      </div>
    </aside>
  );
};
