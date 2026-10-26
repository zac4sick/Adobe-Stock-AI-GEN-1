import React, { useState } from 'react';
import {
  Download,
  Upload,
  Plus,
  Trash2,
  FileText,
  Search,
  Filter,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCode,
} from 'lucide-react';
import { PortfolioLedgerEntry } from '../types/index.ts';
import {
  generatePortfolioLedgerCsv,
  parsePortfolioLedgerCsv,
  triggerDownload,
} from '../utils/exporters';

interface PortfolioLedgerViewProps {
  entries: PortfolioLedgerEntry[];
  onUpdateEntries: (entries: PortfolioLedgerEntry[]) => void;
}

export const PortfolioLedgerView: React.FC<PortfolioLedgerViewProps> = ({
  entries,
  onUpdateEntries,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item modal form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newConcept, setNewConcept] = useState<string>('');
  const [newNiche, setNewNiche] = useState<string>('Workplace & Business Operations');
  const [newAssetType, setNewAssetType] = useState<string>('photorealistic_photo');
  const [newBuyer, setNewBuyer] = useState<string>('Graphic & UI Designers');
  const [newPlacement, setNewPlacement] = useState<string>('website_hero');
  const [newRatio, setNewRatio] = useState<string>('16:9');
  const [newKeywords, setNewKeywords] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'draft' | 'generated' | 'submitted' | 'approved' | 'rejected'>('submitted');
  const [newNotes, setNewNotes] = useState<string>('');

  // Filtered entries
  const filteredEntries = entries.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.asset_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export CSV
  const handleExportCsv = () => {
    const csv = generatePortfolioLedgerCsv(entries);
    triggerDownload(csv, `portfolio-ledger-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  // Export JSON
  const handleExportJson = () => {
    const json = JSON.stringify(entries, null, 2);
    triggerDownload(json, `portfolio-ledger-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  // Import CSV
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const imported = parsePortfolioLedgerCsv(text);
        if (imported.length > 0) {
          // Merge avoiding exact duplicates by asset_id
          const existingIds = new Set(entries.map((x) => x.asset_id));
          const toAdd = imported.filter((x) => !existingIds.has(x.asset_id));
          onUpdateEntries([...toAdd, ...entries]);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Add item
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEntry: PortfolioLedgerEntry = {
      asset_id: `AS-${Date.now().toString().slice(-4)}`,
      created_date: new Date().toISOString().split('T')[0],
      niche: newNiche,
      asset_type: newAssetType,
      buyer_persona: newBuyer,
      placement: newPlacement,
      concept: newConcept || newTitle,
      title: newTitle,
      visual_hook: '',
      aspect_ratio: newRatio,
      generator: 'general_image_model',
      keywords_csv: newKeywords,
      status: newStatus,
      refusal_reason: '',
      notes: newNotes,
    };

    onUpdateEntries([newEntry, ...entries]);
    setShowAddModal(false);
    setNewTitle('');
    setNewConcept('');
    setNewKeywords('');
    setNewNotes('');
  };

  // Delete item
  const handleDelete = (id: string) => {
    onUpdateEntries(entries.filter((x) => x.asset_id !== id));
  };

  // Status update
  const handleStatusChange = (id: string, status: any) => {
    onUpdateEntries(
      entries.map((item) => (item.asset_id === id ? { ...item, status } : item))
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Submitted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
              Local Browser Storage
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Total Assets Tracked: {entries.length}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Portfolio & Non-Repetition Guard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracks past submissions, approved winners, and rejected items to prevent self-plagiarism and repeated Adobe refusals.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            Export JSON
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search portfolio title, concept, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses ({entries.length})</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="submitted">Submitted</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Asset ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Title & Concept</th>
                <th className="py-3 px-3">Niche & Type</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Refusal / Notes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No portfolio entries found. Click "Add Asset" or "Import CSV" to populate your ledger.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => (
                  <tr key={item.asset_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono text-[11px] text-indigo-400 font-semibold whitespace-nowrap">
                      {item.asset_id}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {item.created_date}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-100 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.concept}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-[11px] text-slate-200">{item.niche}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.asset_type.replace(/_/g, ' ')} ({item.aspect_ratio})
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.asset_id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-slate-200"
                      >
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 max-w-xs text-[11px] text-slate-400">
                      {item.refusal_reason ? (
                        <span className="text-rose-400 font-medium line-clamp-2">
                          {item.refusal_reason}
                        </span>
                      ) : (
                        <span className="line-clamp-2">{item.notes || '—'}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.asset_id)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm">Add New Asset to Ledger</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern network engineer testing fiber optic line"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Concept Description</label>
                <textarea
                  rows={2}
                  placeholder="Subject, lighting, visual hook..."
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Niche</label>
                  <input
                    type="text"
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Asset Type</label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="photorealistic_photo">Photorealistic Photo</option>
                    <option value="isolated_transparent_png">Isolated Transparent PNG</option>
                    <option value="flow_video">Flow Video Clip</option>
                    <option value="background_texture">Texture / Background</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Aspect Ratio</label>
                  <input
                    type="text"
                    value={newRatio}
                    onChange={(e) => setNewRatio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Keywords (Comma-separated, no #)</label>
                <textarea
                  rows={2}
                  placeholder="datacenter, network engineer, fiber optics, it infrastructure..."
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notes / Refusal Reason</label>
                <input
                  type="text"
                  placeholder="License counts, reviewer feedback, or rejection notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
