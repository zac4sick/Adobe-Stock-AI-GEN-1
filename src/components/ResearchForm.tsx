import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Sliders,
  Check,
  AlertCircle,
  Plus,
  X,
  RotateCcw,
  Film,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';
import {
  AssetType,
  BuyerFocus,
  CreativeDirection,
  GapStrategy,
  PackGenerationParams,
  PlacementTask,
  PresetType,
  TargetGenerator,
  TargetMarket,
  TrendHorizon,
} from '../types/index.ts';
import {
  ASPECT_RATIOS,
  BUYER_OPTIONS,
  CREATIVE_DIRECTION_OPTIONS,
  GAP_STRATEGY_OPTIONS,
  INITIAL_EXCLUSIONS,
  MARKET_OPTIONS,
  NICHE_OPTIONS,
  PLACEMENT_OPTIONS,
  PRESET_CONFIGS,
  TREND_HORIZON_OPTIONS,
} from '../data/constants';

interface ResearchFormProps {
  onRunResearch: (params: PackGenerationParams) => void;
  onDirectGenerate: (params: PackGenerationParams) => void;
  isLoading: boolean;
}

export const ResearchForm: React.FC<ResearchFormProps> = ({
  onRunResearch,
  onDirectGenerate,
  isLoading,
}) => {
  // Preset state
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('daily_mixed');

  // Input fields
  const [niche, setNiche] = useState<string>('Workplace & Business Operations');
  const [customNiche, setCustomNiche] = useState<string>('');
  const [assetTypes, setAssetTypes] = useState<AssetType[]>(['photorealistic_photo', 'flow_video']);
  const [buyerFocus, setBuyerFocus] = useState<BuyerFocus>('graphic_designers');
  const [placement, setPlacement] = useState<PlacementTask>('website_hero');
  const [trendHorizon, setTrendHorizon] = useState<TrendHorizon>('upcoming_90_days');
  const [targetMarket, setTargetMarket] = useState<TargetMarket>('global');
  const [creativeDirection, setCreativeDirection] = useState<CreativeDirection>('natural_humanized_photo');
  const [gapStrategy, setGapStrategy] = useState<GapStrategy>('underserved_buyer_task');
  const [imageCount, setImageCount] = useState<number>(8);
  const [videoCount, setVideoCount] = useState<number>(5);
  const [videoDurationSec, setVideoDurationSec] = useState<number>(10);
  const [aspectRatio, setAspectRatio] = useState<string>('auto');
  const [targetGenerator, setTargetGenerator] = useState<TargetGenerator>('general_image_model');

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [preferredPalette, setPreferredPalette] = useState<string>('Natural Scandinavian warm neutrals with matte accents');
  const [peoplePreference, setPeoplePreference] = useState<'include_people' | 'no_people' | 'hands_only' | 'any'>('include_people');
  const [copySpaceLocation, setCopySpaceLocation] = useState<'left' | 'right' | 'top' | 'bottom' | 'center' | 'none'>('top');

  // Exclusions management
  const [exclusions, setExclusions] = useState<string[]>(INITIAL_EXCLUSIONS);
  const [newExclusionInput, setNewExclusionInput] = useState<string>('');
  const [showExclusions, setShowExclusions] = useState<boolean>(false);

  // Handle Preset Switching
  const handlePresetSelect = (preset: PresetType) => {
    setSelectedPreset(preset);
    const config = PRESET_CONFIGS[preset];
    setImageCount(config.imageCount);
    setVideoCount(config.videoCount);
    setTargetGenerator(config.targetGenerator);

    if (preset === 'muse_png') {
      setAssetTypes(['isolated_transparent_png']);
      setCreativeDirection('clean_isolated_cutout');
      setGapStrategy('transparent_cutout_utility');
      setAspectRatio('1:1');
    } else if (preset === 'flow_video') {
      setAssetTypes(['flow_video']);
      setPlacement('vertical_social_video');
      setAspectRatio('16:9');
    } else if (preset === 'photo_pack') {
      setAssetTypes(['photorealistic_photo']);
      setCreativeDirection('natural_humanized_photo');
    } else if (preset === 'daily_mixed') {
      setAssetTypes(['photorealistic_photo', 'flow_video']);
    }
  };

  // Toggle asset type in multi-select
  const toggleAssetType = (type: AssetType) => {
    if (assetTypes.includes(type)) {
      if (assetTypes.length > 1) {
        setAssetTypes(assetTypes.filter((t) => t !== type));
      }
    } else {
      setAssetTypes([...assetTypes, type]);
    }
  };

  // Recommend a niche randomizer/smarter
  const handleRecommendNiche = () => {
    const highUtilityNiches = [
      'Workplace & Business Operations',
      'Finance & Economic Transition',
      'Healthcare & Preventative Wellness',
      'Cybersecurity & Real-World Tech',
      'Sustainability & Clean Energy',
      'Interiors & Architectural Materials',
      'Craft & Precision Fabrication',
      'Regenerative Agriculture',
      'Isolated Product Cutouts',
    ];
    const picked = highUtilityNiches[Math.floor(Math.random() * highUtilityNiches.length)];
    setNiche(picked);
  };

  // Add exclusion
  const handleAddExclusion = () => {
    if (newExclusionInput.trim() && !exclusions.includes(newExclusionInput.trim())) {
      setExclusions([newExclusionInput.trim(), ...exclusions]);
      setNewExclusionInput('');
    }
  };

  // Remove exclusion
  const handleRemoveExclusion = (item: string) => {
    setExclusions(exclusions.filter((e) => e !== item));
  };

  // Construct parameter object
  const getParams = (): PackGenerationParams => ({
    preset: selectedPreset,
    niche: niche === 'Custom Niche' ? (customNiche || 'Custom Creative Niche') : niche,
    assetTypes,
    buyerFocus,
    placement,
    trendHorizon,
    targetMarket,
    creativeDirection,
    gapStrategy,
    imageCount: Number(imageCount) || 0,
    videoCount: Number(videoCount) || 0,
    aspectRatio,
    targetGenerator,
    exclusions,
    preferredPalette,
    peoplePreference,
    copySpaceLocation,
    videoDurationSec: Number(videoDurationSec) || 10,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" /> Commercial Stock Art Direction Engine
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Start New Opportunity Pack
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Research real-time Adobe Stock opportunities, identify competitive saturation, and generate copy-ready prompts for Muse AI (PNG), image generators, or Google Flow (video) with verified 25+ keywords.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRunResearch(getParams())}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-900 flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Researching...' : 'Research Opportunities'}
            </button>
            <button
              onClick={() => onDirectGenerate(getParams())}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {isLoading ? 'Generating...' : 'Generate Directly'}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          1. Select Production Preset
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(PRESET_CONFIGS) as PresetType[]).map((key) => {
            const preset = PRESET_CONFIGS[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetSelect(key)}
                className={`p-3 rounded-lg border text-left transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-100">{preset.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{preset.description}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>{preset.imageCount} imgs</span>
                  <span>{preset.videoCount} vids</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Niche, Asset Types, Buyer, Placement */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Niche */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Niche / Commercial Subject
              </label>
              <button
                type="button"
                onClick={handleRecommendNiche}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition"
              >
                <Sparkles className="w-3 h-3" /> Recommend a Niche
              </button>
            </div>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {NICHE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {niche === 'Custom Niche' && (
              <input
                type="text"
                placeholder="Enter custom niche (e.g. Ergonomic Adaptive Kitchenware)"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

          {/* Asset Types Multi-Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              3. Asset Output Types
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'photorealistic_photo', label: 'Real Photo' },
                { id: 'isolated_transparent_png', label: 'Transparent PNG' },
                { id: 'product_cutout', label: 'Product Cutout' },
                { id: 'flow_video', label: 'Flow Video Clip' },
                { id: 'background_texture', label: 'Texture / Backdrop' },
                { id: 'decorative_element', label: 'Graphic Element' },
              ].map((item) => {
                const active = assetTypes.includes(item.id as AssetType);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAssetType(item.id as AssetType)}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium border text-left flex items-center justify-between transition ${
                      active
                        ? 'border-indigo-500 bg-indigo-950/60 text-slate-100'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <Check className="w-3 h-3 text-indigo-400" />}
                  </button>
                );
              })}
            </div>

            {/* PNG Transparency Caveat Notice */}
            {assetTypes.includes('isolated_transparent_png') && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-300">Adobe Stock PNG Requirement:</strong> An image prompt cannot generate vector files. For isolated PNGs, prompts enforce true alpha channel (RGBA), 4MP–100MP, and explicitly forbid rendering a fake gray-and-white checkerboard. Always inspect output in image editors before uploading.
                </div>
              </div>
            )}
          </div>

          {/* Target Buyer Focus */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              4. Target Buyer Persona
            </label>
            <select
              value={buyerFocus}
              onChange={(e) => setBuyerFocus(e.target.value as BuyerFocus)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {BUYER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Placement / Buyer Task */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              5. Intended Placement & Buyer Task
            </label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as PlacementTask)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {PLACEMENT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column: Trend Horizon, Market, Gap Strategy, Quantities */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Trend Horizon & Market */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                6. Trend Horizon
              </label>
              <select
                value={trendHorizon}
                onChange={(e) => setTrendHorizon(e.target.value as TrendHorizon)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {TREND_HORIZON_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                7. Target Geographic Market
              </label>
              <select
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value as TargetMarket)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {MARKET_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Creative Direction */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              8. Creative & Photographic Direction
            </label>
            <select
              value={creativeDirection}
              onChange={(e) => setCreativeDirection(e.target.value as CreativeDirection)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {CREATIVE_DIRECTION_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Differentiation & Gap Strategy */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              9. Differentiation / Market Gap Strategy
            </label>
            <select
              value={gapStrategy}
              onChange={(e) => setGapStrategy(e.target.value as GapStrategy)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {GAP_STRATEGY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantities & Format */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-indigo-400" /> Image Prompts
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={imageCount}
                onChange={(e) => setImageCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Film className="w-3 h-3 text-amber-400" /> Video Prompts
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={videoCount}
                onChange={(e) => setVideoCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Video Secs
              </label>
              <input
                type="number"
                min={5}
                max={30}
                value={videoDurationSec}
                onChange={(e) => setVideoDurationSec(Math.max(5, parseInt(e.target.value) || 10))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Aspect Ratio & Generator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {ASPECT_RATIOS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Downstream Generator
              </label>
              <select
                value={targetGenerator}
                onChange={(e) => setTargetGenerator(e.target.value as TargetGenerator)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="general_image_model">General Image Model (Midjourney / Firefly / Nano Banana)</option>
                <option value="muse_ai">Muse AI (Isolated 4K Alpha Cutouts)</option>
                <option value="google_flow">Google Flow (10s Continuous B-Roll)</option>
                <option value="other">Other / Unspecified</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusions & Non-Repetition Guard Collapsible */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              10. Exclusions & Saturated Cliché Blocker ({exclusions.length} Seed Rules)
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Preloaded with 38 overused stock patterns & past rejected concepts. The generator avoids near-duplicates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExclusions(INITIAL_EXCLUSIONS)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition px-2 py-1 rounded bg-slate-800 border border-slate-700"
            >
              <RotateCcw className="w-3 h-3" /> Reset Seed List
            </button>
            <button
              type="button"
              onClick={() => setShowExclusions(!showExclusions)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1"
            >
              {showExclusions ? 'Hide List' : 'View / Edit Exclusions'}
            </button>
          </div>
        </div>

        {showExclusions && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
            {/* Add new exclusion input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add pattern or rejected concept to avoid (e.g. holographic globe in palm)..."
                value={newExclusionInput}
                onChange={(e) => setNewExclusionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExclusion()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddExclusion}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Badges List */}
            <div className="max-h-48 overflow-y-auto flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800/80">
              {exclusions.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/90 border border-slate-700 text-slate-300 text-[11px]"
                >
                  <span className="truncate max-w-[280px]">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExclusion(item)}
                    className="text-slate-400 hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Options Accordion */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            Advanced Art Direction & Scene Controls
          </span>
          <span className="text-[11px] text-indigo-400 font-normal">
            {showAdvanced ? 'Collapse' : 'Expand Options'}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Human Presence
              </label>
              <select
                value={peoplePreference}
                onChange={(e) => setPeoplePreference(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value="include_people">Include People (Authentic & Diverse)</option>
                <option value="hands_only">Hands Only (Task Interaction)</option>
                <option value="no_people">No People (Still Life / Props / Architecture)</option>
                <option value="any">Any / AI Decides</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Dedicated Copy Space
              </label>
              <select
                value={copySpaceLocation}
                onChange={(e) => setCopySpaceLocation(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value="top">Top Third (Hero / Banner)</option>
                <option value="left">Left Half (Editorial Two-Column)</option>
                <option value="right">Right Half (Presentation Slide)</option>
                <option value="center">Centered Framing (Product / Icon)</option>
                <option value="none">Full Frame Balanced Coverage</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Preferred Color Palette
              </label>
              <input
                type="text"
                value={preferredPalette}
                onChange={(e) => setPreferredPalette(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onRunResearch(getParams())}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          {isLoading ? 'Conducting Opportunity Research...' : '1. Research Opportunities First (Recommended)'}
        </button>

        <button
          type="button"
          onClick={() => onDirectGenerate(getParams())}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          {isLoading ? 'Generating Production Prompts...' : '2. Generate Prompts Directly'}
        </button>
      </div>
    </div>
  );
};
