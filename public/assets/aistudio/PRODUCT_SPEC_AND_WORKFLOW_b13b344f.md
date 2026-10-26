# Stock Asset Opportunity Lab — Product Specification

**Purpose:** A research-led application for selecting an Adobe Stock niche, asset type, buyer, trend, and differentiation gap before generating production-ready prompts and metadata.

**Primary deliverable:** A complete Google AI Studio Build-mode prompt is in `GOOGLE_AI_STUDIO_BUILD_PROMPT.txt`. Paste the whole file into Google AI Studio → Build mode. This specification explains the product and why it is designed this way.

## What the app solves

The workflow evolved from daily Adobe Stock photography/video packs into a more deliberate buyer-led content strategy, and then into a transparent PNG/Muse workflow. The app consolidates all of that into one flexible tool:

- Research current opportunities before generating.
- Let the creator choose a niche—or ask the app to recommend one.
- Select output type: photorealistic photo, transparent PNG/cutout for Muse, decorative element, illustration-style asset, background/texture, Flow video, or mixed pack.
- Define the buyer and intended placement rather than generate generic images.
- Distinguish genuine evidence from assumptions about possible demand.
- Find gaps in repetitive stock visual patterns and the user's own saved portfolio.
- Create detailed prompts and metadata, including plain comma-separated keywords without hashtag symbols.
- Audit for intellectual-property risk, similarity, physical realism, technical details and metadata completeness before showing the final pack.

## Default production presets

| Preset | Default output |
|---|---|
| Daily Mixed Pack | 8 image prompts + 5 Flow video prompts |
| Muse Transparent PNG Batch | 8 Muse-ready transparent-PNG prompts |
| Photo Pack | User-selected image count |
| Flow Video Pack | User-selected video count; 10 seconds per clip by default |
| Custom | User controls image/video counts and formats |

Counts must be editable and must match the requested number exactly.

## The user must control

1. **Niche:** Suggested categories plus a custom field and “recommend for me”.
2. **Image/asset type:** Photo, transparent PNG, product cutout, decorative element, conceptual illustration, background/texture, Flow video or mixed.
3. **Buyer:** Design, advertising, retail, editorial, education, health, tech, sustainability, hospitality, events, packaging, compositing and custom.
4. **Placement:** Website hero, campaign, poster, packaging, invitation, menu, editorial, presentation, vertical reel, overlay, background and more.
5. **Trend window:** 7/30/90 days, upcoming 30/90 days, seasonal calendar, evergreen or blended.
6. **Market:** Global plus regional targeting.
7. **Visual direction:** Photographic realism, candid/documentary, tactile/macro, product studio, aerial, minimal, cultural/local, etc.
8. **Gap strategy:** Specific buyer problem, underrepresented use case, differentiated composition, local specificity, material detail, accessible design, copy-space needs, transparent cutouts or seasonal lead time.
9. **Quantity and ratios:** Editable. Recommend the aspect ratio based on asset use.
10. **Recent concepts to exclude:** User can review, add, remove or override blocks.

## Research policy

Every research session should show the access date and sources. Prioritize official Adobe Stock content guidelines and current Adobe trend reporting. Use Google Search grounding for recent web signals and cite each material claim. Third-party trackers, trend articles, and marketplace result counts are directional proxies only. Never call these audited Adobe Stock sales/download numbers unless verified by an official source. If direct Google Trends data is unavailable, say so. Don't invent keyword volumes or top-seller rankings.

## Opportunity scoring

The displayed 0–100 score is an explicitly heuristic opportunity hypothesis:

- Buyer utility / placement clarity: 25
- Differentiation and portfolio gap: 20
- Fresh search/trend/seasonal evidence: 15
- Search-intent and metadata clarity: 10
- Composition/usability for the buyer: 10
- Generation feasibility and technical quality: 10
- Lower IP/licensing risk: 10

Show the score breakdown, confidence, reasoning, evidence and gaps. A score is not a sales forecast or acceptance guarantee.

## Prompt output

Each asset needs a unique concept, concrete buyer, clear selling point, relevant trend/context, gap rationale, prompt, camera/framing, lighting, physical realism, negative prompt, output settings, title, 22+ relevant keywords and submission checklist. Keyword default: 25–35, stored as an array and as a comma-separated plain-text string without `#`.

### Photorealistic images

Prompts specify foreground/midground/background, object placement, camera height, lens character, perspective, composition, light direction, shadows/reflections, materials, anatomy, natural imperfections and technical rejection checks. The target style is a photograph a skilled photographer could plausibly take—unless the chosen concept is intentionally illustrative.

### Transparent PNG / Muse

The app writes a copy-ready `muse_prompt` for the downstream Muse tool. It does not claim to call Muse unless a real integration has been built and tested. Require true alpha transparency, never a checkerboard that is baked into the image; choose aspect ratio by the object, request native 4K when available, minimize unnecessary transparent padding, preserve clean alpha edges and note that a PNG export is not proof of transparency. After generation, the user must verify the actual alpha channel and pixel dimensions.

Adobe's official PNG guidance last updated June 11, 2026 stated 4–100 MP, max 45 MB, PNG, sRGB and a transparent background, with clean detail and minimal excess space. The application should re-check current official rules rather than treating this snapshot as permanent.

### Flow video

Each video has a target buyer and placement, a copy-ready `flow_prompt`, shot/camera details, lighting, stable subject/geometry, physical continuity, negative prompts, audio guidance and a complete second-by-second timeline. Default to 10 seconds in the user's Flow workflow, but make duration selectable and verify current generator limits before stating them. The timeline must cover every second and each event must be plausible and continuous.

## IP and refusal prevention

The user has already experienced Adobe Stock refusals categorized as intellectual-property issues. Therefore the app needs a strict gate, not a generic disclaimer:

- No artist, celebrity, real-person, fictional-character, brand, trademark, copyrighted-work, protected-product-design, proprietary UI, or government-agency references in prompts, titles or keywords.
- Never reproduce the exact arrangement/composition of reference stock images. Analyze broad visual principles only; invent a different subject, context, camera view, lighting and object placement.
- Avoid real news-event depiction and recognizable property/landmarks unless rights and policy clearly permit it.
- Use original generic designs, unbranded objects and fictional settings, but do not claim that wording guarantees legal safety.
- Flag IP risk as low / needs review / reject with a concrete reason; require human review.
- Don't use stock image screenshots as direct generation references when doing so would copy the asset's distinctive features.

## Portfolio similarity

Provide a saveable local portfolio ledger with asset title, concept, date, niche, buyer, visual hook, asset type, ratio, generator, keywords, submission status and refusal reason. Compare proposed assets against the ledger with a transparent AI-based semantic check; flag close concepts and revise them before output. Allow JSON/CSV export and import.

## Current exclusion seed

Avoid these recent used/rejected concepts and near-duplicates unless the user explicitly lifts the block and the app shows how the new concept differs: round moss/mushroom miniature in a green planter; centered red ornament on green; cookie/icon cutout rows; wine glass lineups; decorative bows; generic retro toy robot; dog sniffing a gift; multicolored Christmas lights; luxury gift box; tropical Christmas veranda; knitting; candle lighting; holiday mocktail; winter tram; bridge night timelapse; electric car light tunnel; pumpkin harvest; steam-on-black; starry salt-flat reflection; aerial turquoise reef; school percussion; horse after rain; leaf shadows on plaster; generic coastal city aerial; wetlands bird lift-off; rangoli close-up; ceramic glaze pouring; foggy wind turbines; e-bike battery inspection; sustainable wrapping flat lay; paper Christmas village; snowfall overlay; generic teams around table/laptop; doctor with patient; hoodie hacker; holographic finance dashboard; repeated office workshops; warm family photo-album scene; reusable produce-crate photo; paper-snowflake overlay.

## Quality gate

Before output:

- Exact image/video counts match requested values.
- Each asset has a distinct buyer and placement.
- All assets have at least 22 unique, relevant keywords, no hashtags, and a correct comma-separated field.
- Prompt and metadata contain no prohibited IP references or newsworthiness implications.
- Images describe realistic material/geometry/lighting and chosen ratio/resolution.
- PNG prompts request genuine alpha and clearly distinguish prompt instructions from verified output properties.
- Videos have exactly one timeline entry per second for the duration (10 entries for a 10-second clip), coherent camera movement and physical continuity.
- Trend facts have citations and dates; all limitations are explicit.
- If validation fails after one revision, show the warning honestly.

## Official technical and implementation sources

- Adobe Stock generative AI guidelines: https://helpx.adobe.com/stock/contributor/submit-your-content/submit-generative-ai-content/generative-ai-content-guidelines.html
- Adobe Stock submit AI content: https://helpx.adobe.com/stock/contributor/submit-your-content/submit-generative-ai-content/submit-generative-ai-content.html
- Adobe Stock PNG technical requirements: https://helpx.adobe.com/stock/contributor/submit-your-content/submit-pngs/technical-requirements-png-submission.html
- Adobe Stock photo technical/legal requirements: https://helpx.adobe.com/stock/contributor/submit-your-content/submit-photos/technical-legal-requirements-photo-submission.html
- Adobe Stock video technical requirements: https://helpx.adobe.com/stock/contributor/submit-your-content/submit-videos/technical-requirements-for-video-submissions.html
- Google AI Studio Build mode: https://ai.google.dev/gemini-api/docs/aistudio-build-mode
- Gemini API Google Search grounding: https://ai.google.dev/gemini-api/docs/google-search

Google AI Studio Build mode uses natural-language prompts to create a web app and supports a full-stack web environment. Google Search grounding can provide recent web content and citations. The app should use server-side API calls and keep secrets out of client code.
