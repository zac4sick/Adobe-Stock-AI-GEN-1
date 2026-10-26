export type PresetType =
  | 'daily_mixed'
  | 'muse_png'
  | 'photo_pack'
  | 'flow_video'
  | 'custom';

export type AssetType =
  | 'photorealistic_photo'
  | 'isolated_transparent_png'
  | 'product_cutout'
  | 'decorative_element'
  | 'conceptual_illustration'
  | 'background_texture'
  | 'flow_video'
  | 'mixed_pack';

export type BuyerFocus =
  | 'graphic_designers'
  | 'ad_agencies'
  | 'ecommerce_retail'
  | 'small_businesses'
  | 'editors_publishers'
  | 'social_video_producers'
  | 'hospitality_tourism'
  | 'food_restaurant'
  | 'education'
  | 'healthcare'
  | 'technology'
  | 'environment_ngo'
  | 'real_estate_interiors'
  | 'event_festival_marketing'
  | 'product_packaging'
  | 'greeting_cards_invitations'
  | 'motion_designers'
  | 'custom';

export type PlacementTask =
  | 'website_hero'
  | 'presentation'
  | 'social_ad'
  | 'poster_flyer'
  | 'product_listing'
  | 'packaging'
  | 'editorial_article'
  | 'greeting_card'
  | 'menu'
  | 'explainer_video'
  | 'video_overlay'
  | 'vertical_social_video'
  | 'thumbnail'
  | 'background'
  | 'custom';

export type TrendHorizon =
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'upcoming_30_days'
  | 'upcoming_90_days'
  | 'seasonal_calendar'
  | 'evergreen'
  | 'blended';

export type TargetMarket =
  | 'global'
  | 'north_america'
  | 'uk_ireland'
  | 'europe'
  | 'south_asia'
  | 'east_southeast_asia'
  | 'middle_east'
  | 'latin_america'
  | 'africa'
  | 'custom';

export type CreativeDirection =
  | 'natural_humanized_photo'
  | 'documentary_candid'
  | 'macro_tactile'
  | 'product_studio'
  | 'flat_lay_overhead'
  | 'aerial'
  | 'lifestyle'
  | 'clean_isolated_cutout'
  | 'luxury_editorial'
  | 'vibrant_playful'
  | 'subtle_surreal_coherent'
  | 'cultural_local'
  | 'minimal_negative_space'
  | 'custom';

export type GapStrategy =
  | 'underserved_buyer_task'
  | 'uncommon_useful_composition'
  | 'less_generic_variation'
  | 'local_cultural_authenticity'
  | 'inclusive_representation'
  | 'real_tactile_detail'
  | 'strong_copy_space'
  | 'new_use_case'
  | 'seasonal_lead_time'
  | 'transparent_cutout_utility'
  | 'recommend_gap';

export type TargetGenerator =
  | 'muse_ai'
  | 'general_image_model'
  | 'google_flow'
  | 'other'
  | 'unspecified';

export interface ScoreBreakdown {
  buyer_utility: number; // Max 25
  differentiation: number; // Max 20
  trend_evidence: number; // Max 15
  metadata_clarity: number; // Max 10
  composition_usability: number; // Max 10
  generation_feasibility: number; // Max 10
  ip_risk_score: number; // Max 10
}

export interface SourceCitation {
  title: string;
  url: string;
  publisher: string;
  published_or_updated_date: string;
  accessed_date: string;
  what_it_supports: string;
  evidence_type: 'official' | 'public_trend_signal' | 'community_signal' | 'marketplace_proxy';
}

export interface OpportunityCandidate {
  id: string;
  title: string;
  concept: string;
  niche: string;
  buyer_persona: string;
  placement: string;
  selling_point: string;
  visual_hook: string;
  market_saturation_signs: string;
  differentiation_gap: string;
  buyer_problem_solved: string;
  opportunity_score: number; // 0-100
  score_breakdown: ScoreBreakdown;
  confidence: 'low' | 'medium' | 'high';
  confidence_reason: string;
  suggested_asset_type: AssetType;
  suggested_aspect_ratio: string;
  suggested_generator: TargetGenerator;
  evidence_summary: string;
  citation_indices?: number[];
  selected?: boolean;
}

export interface ResearchRun {
  research_date: string;
  target_market: string;
  trend_window: string;
  google_trends_status: 'verified' | 'not_verified' | 'unavailable';
  research_summary: string;
  market_saturation_summary: string;
  buyer_problems_summary: string;
  candidates: OpportunityCandidate[];
  sources: SourceCitation[];
}

export interface CameraSettings {
  lens?: string;
  angle?: string;
  framing?: string;
  focus?: string;
  movement?: string;
  stabilization?: string;
}

export interface LightingSettings {
  direction?: string;
  intensity?: string;
  style?: string;
  shadows_reflections?: string;
  reflections?: string;
}

export interface ImagePromptItem {
  id: string;
  concept: string;
  niche: string;
  buyer_persona: string;
  placement: string;
  selling_point: string;
  research_rationale: string;
  trend_signals: string[];
  competition_and_gap: string;
  opportunity_score: number;
  score_rationale: string;
  confidence: 'low' | 'medium' | 'high';
  ip_risk: 'low' | 'needs_review' | 'reject';
  ip_risk_reason: string;
  asset_type: string;
  aspect_ratio: string;
  resolution_guidance: string;
  image_prompt: string;
  muse_prompt?: string;
  camera: CameraSettings;
  lighting: LightingSettings;
  negative_prompt: string[];
  adobe_stock_title: string;
  keywords_array: string[];
  keywords_csv: string;
  submission_checklist: string[];
}

export interface VideoTimelineEntry {
  second: number;
  action: string;
}

export interface AudioSettings {
  ambient: string;
  sfx: string[];
  music: string;
}

export interface VideoPromptItem {
  id: string;
  concept: string;
  niche: string;
  buyer_persona: string;
  placement: string;
  selling_point: string;
  research_rationale: string;
  trend_signals: string[];
  competition_and_gap: string;
  opportunity_score: number;
  score_rationale: string;
  confidence: 'low' | 'medium' | 'high';
  ip_risk: 'low' | 'needs_review' | 'reject';
  ip_risk_reason: string;
  asset_type: string;
  duration_sec: number;
  aspect_ratio: string;
  resolution_guidance: string;
  frame_rate_guidance: string;
  flow_prompt: string;
  camera: CameraSettings;
  lighting: LightingSettings;
  physical_continuity: string;
  timeline: VideoTimelineEntry[];
  audio: AudioSettings;
  negative_prompt: string[];
  adobe_stock_title: string;
  keywords_array: string[];
  keywords_csv: string;
  submission_checklist: string[];
}

export interface QualityAuditReport {
  passed: boolean;
  total_items: number;
  count_validation: {
    requested_images: number;
    generated_images: number;
    requested_videos: number;
    generated_videos: number;
    passed: boolean;
  };
  keyword_count_validation: {
    min_required: number;
    passed: boolean;
    deficient_items: string[];
  };
  no_hashtags_validation: boolean;
  ip_risk_validation: {
    passed: boolean;
    flagged_concepts: string[];
  };
  repetition_guard_validation: {
    passed: boolean;
    flagged_overlaps: string[];
  };
  png_transparency_validation: {
    passed: boolean;
    notes: string[];
  };
  video_timeline_validation: {
    passed: boolean;
    notes: string[];
  };
  warnings: string[];
  auto_revisions_applied: string[];
}

export interface GeneratedPack {
  id: string;
  created_at: string;
  pack_title: string;
  preset: PresetType;
  research_date: string;
  target_market: string;
  research_summary: string;
  google_trends_status: 'verified' | 'not_verified' | 'unavailable';
  opportunity_candidates: OpportunityCandidate[];
  images: ImagePromptItem[];
  videos: VideoPromptItem[];
  final_quality_audit: QualityAuditReport;
  sources: SourceCitation[];
}

export interface PortfolioLedgerEntry {
  asset_id: string;
  created_date: string;
  niche: string;
  asset_type: string;
  buyer_persona: string;
  placement: string;
  concept: string;
  title: string;
  visual_hook: string;
  aspect_ratio: string;
  generator: string;
  keywords_csv: string;
  status: 'draft' | 'generated' | 'submitted' | 'approved' | 'rejected';
  refusal_reason: string;
  notes: string;
}

export interface PackGenerationParams {
  preset: PresetType;
  niche: string;
  assetTypes: AssetType[];
  buyerFocus: BuyerFocus;
  customBuyer?: string;
  placement: PlacementTask;
  customPlacement?: string;
  trendHorizon: TrendHorizon;
  targetMarket: TargetMarket;
  customMarket?: string;
  creativeDirection: CreativeDirection;
  customDirection?: string;
  gapStrategy: GapStrategy;
  imageCount: number;
  videoCount: number;
  aspectRatio: string;
  targetGenerator: TargetGenerator;
  exclusions: string[];
  preferredPalette?: string;
  peoplePreference?: 'include_people' | 'no_people' | 'hands_only' | 'any';
  copySpaceLocation?: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'none';
  selectedCandidates?: OpportunityCandidate[];
  videoDurationSec?: number;
}
