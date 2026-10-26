import { GeneratedPack, PortfolioLedgerEntry } from '../types/index.ts';

/**
 * Escapes fields for standard RFC 4180 CSV export.
 */
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates an Adobe Stock submission-ready CSV metadata file.
 * Format standard: Filename, Title, Keywords, Category, Releases
 */
export function generateAdobeStockMetadataCsv(pack: GeneratedPack): string {
  const headers = ['Filename', 'Title', 'Keywords', 'Category', 'Releases'];
  const rows: string[] = [headers.join(',')];

  pack.images.forEach((img, idx) => {
    const filename = `asset_img_${String(idx + 1).padStart(3, '0')}.png`;
    rows.push(
      [
        escapeCsv(filename),
        escapeCsv(img.adobe_stock_title),
        escapeCsv(img.keywords_csv),
        escapeCsv(img.niche),
        escapeCsv('Generative AI - Property Release Not Required for Fictional Subject'),
      ].join(',')
    );
  });

  pack.videos.forEach((vid, idx) => {
    const filename = `asset_vid_${String(idx + 1).padStart(3, '0')}.mp4`;
    rows.push(
      [
        escapeCsv(filename),
        escapeCsv(vid.adobe_stock_title),
        escapeCsv(vid.keywords_csv),
        escapeCsv(vid.niche),
        escapeCsv('Generative AI - Property Release Not Required for Fictional Subject'),
      ].join(',')
    );
  });

  return rows.join('\r\n');
}

/**
 * Exports Portfolio Ledger in exact CSV format matching PORTFOLIO-LEDGER-TEMPLATE.csv
 */
export function generatePortfolioLedgerCsv(entries: PortfolioLedgerEntry[]): string {
  const headers = [
    'asset_id',
    'created_date',
    'niche',
    'asset_type',
    'buyer_persona',
    'placement',
    'concept',
    'title',
    'visual_hook',
    'aspect_ratio',
    'generator',
    'keywords_csv',
    'status',
    'refusal_reason',
    'notes',
  ];

  const rows: string[] = [headers.join(',')];

  entries.forEach((item) => {
    rows.push(
      [
        escapeCsv(item.asset_id),
        escapeCsv(item.created_date),
        escapeCsv(item.niche),
        escapeCsv(item.asset_type),
        escapeCsv(item.buyer_persona),
        escapeCsv(item.placement),
        escapeCsv(item.concept),
        escapeCsv(item.title),
        escapeCsv(item.visual_hook),
        escapeCsv(item.aspect_ratio),
        escapeCsv(item.generator),
        escapeCsv(item.keywords_csv),
        escapeCsv(item.status),
        escapeCsv(item.refusal_reason),
        escapeCsv(item.notes),
      ].join(',')
    );
  });

  return rows.join('\r\n');
}

/**
 * Parse imported CSV into PortfolioLedgerEntry items.
 */
export function parsePortfolioLedgerCsv(csvText: string): PortfolioLedgerEntry[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  };

  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const entries: PortfolioLedgerEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    if (parts.length < 5) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = parts[idx]?.trim() || '';
    });

    if (rowObj.asset_id || rowObj.title || rowObj.concept) {
      entries.push({
        asset_id: rowObj.asset_id || `IMP-${Date.now()}-${i}`,
        created_date: rowObj.created_date || new Date().toISOString().split('T')[0],
        niche: rowObj.niche || 'General',
        asset_type: rowObj.asset_type || 'photorealistic_photo',
        buyer_persona: rowObj.buyer_persona || 'Graphic & UI Designers',
        placement: rowObj.placement || 'website_hero',
        concept: rowObj.concept || rowObj.title || 'Imported asset',
        title: rowObj.title || 'Untitled Asset',
        visual_hook: rowObj.visual_hook || '',
        aspect_ratio: rowObj.aspect_ratio || '16:9',
        generator: rowObj.generator || 'general_image_model',
        keywords_csv: rowObj.keywords_csv || '',
        status: (rowObj.status as any) || 'draft',
        refusal_reason: rowObj.refusal_reason || '',
        notes: rowObj.notes || '',
      });
    }
  }

  return entries;
}

/**
 * Generates formatted Markdown production documentation for artists & contributors.
 */
export function generateProductionMarkdown(pack: GeneratedPack): string {
  let md = `# ${pack.pack_title}\n\n`;
  md += `**Date of Research:** ${pack.research_date}\n`;
  md += `**Target Market:** ${pack.target_market.toUpperCase()}\n`;
  md += `**Google Trends Status:** ${pack.google_trends_status}\n\n`;
  md += `## Commercial Strategy & Research Summary\n\n${pack.research_summary}\n\n`;

  md += `## Quality Audit Status\n\n`;
  md += `- **Audit Passed:** ${pack.final_quality_audit.passed ? 'PASSED ✅' : 'ATTENTION REQUIRED ⚠️'}\n`;
  md += `- **Images Generated:** ${pack.images.length} (Requested: ${pack.final_quality_audit.count_validation.requested_images})\n`;
  md += `- **Videos Generated:** ${pack.videos.length} (Requested: ${pack.final_quality_audit.count_validation.requested_videos})\n`;
  md += `- **Minimum 22 Keywords Check:** ${pack.final_quality_audit.keyword_count_validation.passed ? 'PASSED' : 'DEFICIENT'}\n`;
  md += `- **Hashtag Free Check:** ${pack.final_quality_audit.no_hashtags_validation ? 'PASSED (Zero # symbols)' : 'FAILED'}\n\n`;

  if (pack.images.length > 0) {
    md += `## Image Prompts (${pack.images.length})\n\n`;
    pack.images.forEach((img, idx) => {
      md += `### ${idx + 1}. ${img.adobe_stock_title}\n\n`;
      md += `- **Asset Type:** \`${img.asset_type}\`\n`;
      md += `- **Aspect Ratio:** \`${img.aspect_ratio}\` | **Resolution:** ${img.resolution_guidance}\n`;
      md += `- **Buyer Persona:** ${img.buyer_persona} | **Placement:** ${img.placement}\n`;
      md += `- **Opportunity Score:** **${img.opportunity_score}/100** (Confidence: ${img.confidence.toUpperCase()})\n`;
      md += `- **IP Risk Status:** \`${img.ip_risk.toUpperCase()}\` — ${img.ip_risk_reason}\n\n`;

      if (img.muse_prompt) {
        md += `#### Muse AI Transparent PNG Prompt (Copy-Ready):\n\`\`\`\n${img.muse_prompt}\n\`\`\`\n\n`;
      } else {
        md += `#### Primary Image Prompt:\n\`\`\`\n${img.image_prompt}\n\`\`\`\n\n`;
      }

      md += `**Camera & Lens:** ${img.camera.lens || 'N/A'}, ${img.camera.angle || 'N/A'}, ${img.camera.framing || 'N/A'}\n\n`;
      md += `**Lighting:** ${img.lighting.style || 'N/A'} (${img.lighting.direction || 'N/A'})\n\n`;
      md += `**Negative Prompt:** ${img.negative_prompt.join(', ')}\n\n`;
      md += `**Keywords (${img.keywords_array.length}):**\n\`${img.keywords_csv}\`\n\n`;
      md += `**Submission Checklist:**\n`;
      img.submission_checklist.forEach((item) => {
        md += `- [ ] ${item}\n`;
      });
      md += `\n---\n\n`;
    });
  }

  if (pack.videos.length > 0) {
    md += `## Video Prompts & Timelines (${pack.videos.length})\n\n`;
    pack.videos.forEach((vid, idx) => {
      md += `### Video ${idx + 1}. ${vid.adobe_stock_title}\n\n`;
      md += `- **Duration:** \`${vid.duration_sec}s\` | **Aspect Ratio:** \`${vid.aspect_ratio}\`\n`;
      md += `- **Buyer Persona:** ${vid.buyer_persona} | **Placement:** ${vid.placement}\n`;
      md += `- **Opportunity Score:** **${vid.opportunity_score}/100** | **IP Risk:** \`${vid.ip_risk.toUpperCase()}\`\n\n`;
      md += `#### Google Flow Prompt (Copy-Ready):\n\`\`\`\n${vid.flow_prompt}\n\`\`\`\n\n`;
      md += `**Physical Continuity & Geometry Locks:**\n${vid.physical_continuity}\n\n`;
      md += `**Second-by-Second Timeline (${vid.timeline.length}s):**\n`;
      vid.timeline.forEach((t) => {
        md += `- **0:${String(t.second).padStart(2, '0')}:** ${t.action}\n`;
      });
      md += `\n**Audio Guidance:** Ambient: ${vid.audio.ambient} | SFX: ${vid.audio.sfx.join(', ')} | Music: ${vid.audio.music}\n\n`;
      md += `**Negative Prompt:** ${vid.negative_prompt.join(', ')}\n\n`;
      md += `**Keywords (${vid.keywords_array.length}):**\n\`${vid.keywords_csv}\`\n\n`;
      md += `---\n\n`;
    });
  }

  md += `## Grounding Sources & Regulatory Citations\n\n`;
  pack.sources.forEach((s) => {
    md += `- [${s.title}](${s.url}) — *${s.publisher}* (${s.published_or_updated_date})\n  ${s.what_it_supports}\n`;
  });

  return md;
}

/**
 * Triggers a client-side file download with the given content and mime type.
 */
export function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
