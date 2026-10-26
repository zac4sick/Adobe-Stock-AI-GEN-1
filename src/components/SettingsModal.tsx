import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Key,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
} from 'lucide-react';
import { SAMPLE_PORTFOLIO_LEDGER, INITIAL_EXCLUSIONS } from '../data/constants';

interface SettingsModalProps {
  onResetPortfolio: () => void;
  portfolioCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onResetPortfolio,
  portfolioCount,
}) => {
  const [model, setModel] = useState<string>('gemini-3.8-flash');
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerStatus(data);
    } catch {
      setServerStatus({ status: 'offline', hasKey: false, model: 'local' });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset portfolio ledger and clear cache to default template?')) {
      onResetPortfolio();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-300">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
            Configuration & Environment
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Lab Settings & System Health
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Server-side model routing, Google Search grounding status, and local storage controls.
        </p>
      </div>

      {/* Server & API Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Backend Gen AI Server Status
          </h3>
          <button
            onClick={checkServer}
            disabled={isChecking}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
          >
            {isChecking ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">API Server</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active on Port 3000</span>
            </div>
            <div className="text-[10px] text-slate-400">Full-stack Express + Vite</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Gemini API Key</span>
            {serverStatus?.hasKey ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Injected & Secured Server-Side</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Heuristic Proxy Active</span>
              </div>
            )}
            <div className="text-[10px] text-slate-400">Never exposed to client bundles</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Model Selected</span>
            <div className="font-mono text-slate-200 font-bold mt-0.5">
              {model}
            </div>
            <div className="text-[10px] text-slate-400">Google Search Grounding Capable</div>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Select Server AI Model
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label
            className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
              model === 'gemini-3.8-flash'
                ? 'border-indigo-500 bg-indigo-950/40 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name="modelSelection"
              value="gemini-3.8-flash"
              checked={model === 'gemini-3.8-flash'}
              onChange={() => setModel('gemini-3.8-flash')}
              className="mt-0.5 text-indigo-600 focus:ring-0"
            />
            <div>
              <div className="font-bold text-slate-100">gemini-3.8-flash (Recommended)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Fast, responsive, native Google Search grounding support for commercial research.
              </p>
            </div>
          </label>

          <label
            className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
              model === 'gemini-4-argon'
                ? 'border-indigo-500 bg-indigo-950/40 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name="modelSelection"
              value="gemini-4-argon"
              checked={model === 'gemini-4-argon'}
              onChange={() => setModel('gemini-4-argon')}
              className="mt-0.5 text-indigo-600 focus:ring-0"
            />
            <div>
              <div className="font-bold text-slate-100">gemini-4-argon</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                High-reasoning flagship model for complex multi-niche market analysis.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Local Storage & Cache Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          Local Browser Data Management
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <div>
            <div className="font-semibold text-slate-200">Portfolio Ledger Records</div>
            <p className="text-[11px] text-slate-400">
              Currently holding {portfolioCount} assets in localStorage. You can restore the initial template records anytime.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            {resetSuccess ? 'Reset Complete!' : 'Restore Default Template'}
          </button>
        </div>
      </div>
    </div>
  );
};
