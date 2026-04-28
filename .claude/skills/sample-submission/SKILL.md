---
name: sample-submission
description: Use when preparing a mokulearner-research contribution from a raw lab return — PDF lab report, xlsx submission form, lab-issued CSV, or GeoJSON layer — typically dropped into the gitignored `samples/` inbox. Walks identification of contribution_type and topics, PDF-to-CSV translation, PII handling for submission forms, geographic anchoring (lat/long, moku_ids, coverage), `metadata.json` + data file assembly under `contributions/{slug}/{dataset}/`, and validation via `scripts/validate-pr.mjs`. Triggers on phrases like "prepare a contribution", "submit a sample", "ingest this lab report", "review what's in /samples", or when the user opens a file in `samples/` and asks for help.
---

# Sample submission to mokulearner-research

Goal: convert a raw lab output (PDF, submission form, wide CSV, GeoJSON) into a validated contribution under `contributions/{contributor-slug}/{dataset-slug}/` that passes [scripts/validate-pr.mjs](scripts/validate-pr.mjs) and is ready for PR.

## Always-true facts about this repo

- **Validator-accepted file types**: only `.csv` or `.geojson` for the primary data file. The schema regex in [schemas/metadata.schema.json](schemas/metadata.schema.json) rejects anything else. PDFs and xlsx files travel as **sidecars** — they live in the dataset directory but are not declared in `metadata.datasets[].file`, so the validator silently ignores them.
- **`samples/` is gitignored** ([`.gitignore`](.gitignore)). It is the contributor's private inbox. Files placed there never reach the public commons unless explicitly copied into `contributions/`.
- **Contributor slug** must already exist with `status: "approved"` in [registry/contributors.json](registry/contributors.json). If the contributor is not listed, send them to `https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml` first — do not invent a slug.
- **Validation command** (run from repo root): `CHANGED_DIRS="<contributor-slug>/<dataset-slug>" node scripts/validate-pr.mjs`. A contribution is "done" only when this returns 0 errors and 0 rejected records.

## Workflow

### Step 1 — Inventory the source files

List everything in `samples/` and any path the user pointed to. Group files by sample reference (a single sample often has both a lab PDF and a registration xlsx). Read the contents:
- PDFs: use the `Read` tool with `pages` parameter for large files.
- xlsx: parse with `python3 + openpyxl` via Bash; do not assume xlsx libs are installed in node.
- CSVs: read directly.

Reconcile dates across sources — the lab PDF's "Date" header often reflects the lab-receipt date, while the submission form's "date collected" is the true collection date. Use the collection date as `sample_date` in the CSV; keep `lab_received_date` and `report_date` in `sample_context`.

### Step 2 — Identify contribution_type

| Source data | `contribution_type` | Required metadata block |
|---|---|---|
| Physical sample collected at a site (soil, water, sediment, tissue, air, sludge) | `observation` | `sample_context` with controlled `matrix` |
| Sub-county statistical data refining federal county-level baselines (unemployment, income, food security, housing at moku/neighborhood resolution) | `indicator` | `baseline_context` with `supplements` |
| GIS polygon/line layers (wetlands, parcels, land use, classification) | `spatial_overlay` | None additional; GeoJSON typical |

If unsure, read [docs/topics.md](docs/topics.md) for the decision criteria and ISO 37101 / SDG mapping.

### Step 3 — Choose the source-format playbook

#### (A) Lab report PDF — most common for new submissions
The PDF cannot be the data file. Convert to CSV.

- **Default to long-format CSV** when the report mixes numeric values (e.g., `1e+10 units/gr`) with ordinal classes (LOW/MEDIUM/HIGH/VERY HIGH/NOT DETECTED), or when metrics are hierarchical (Carbon → Carbon Fixation, Aerobic Respiration, ...). Most lab reports fit this.
- **Canonical example**: [contributions/manaolana/becrop-loc01-2026/](contributions/manaolana/becrop-loc01-2026/). Mirror this pattern.
- **Recommended long-format columns**:
  ```
  record_id, location_id, sample_id, lab_code, sample_date,
  latitude, longitude, metric_category, metric_name,
  value_numeric, value_class, units, notes
  ```
- **Long-format pitfall**: the validator dedups on `site_id` ([scripts/validate-pr.mjs:299](scripts/validate-pr.mjs#L299)). **Never include a `site_id` column in long-format CSVs** — every row would share the same value and fail validation. Use `record_id` (unique per metric row, e.g. `LOC_01-summary-biosustainability_index`) and `location_id` (shared per site).
- **Numeric vs. ordinal**: numeric metrics go in `value_numeric` with `units`. Ordinal classes go in `value_class` using snake_case: `very_low`, `low`, `medium`, `high`, `very_high`, `not_detected`, `detected`. Document the full ordinal scale in `sample_context.ordinal_class_scale`.
- Keep the PDF in the dataset directory as a **sidecar** and reference it by filename in `sample_context.report_pdf`.

#### (B) Submission form (xlsx, intake doc, registration sheet) — almost always paired with (A)
- **PII risk** — these forms typically include the submitter's name, email, and other personal info. **Never copy the form into the public contribution directory.** Extract the relevant fields into `sample_context` and reference the form by filename only in `sample_context.submission_form` with a note such as `"kept private in /samples; contains submitter PII"`. The xlsx itself stays in `samples/` (gitignored).
- Useful fields to extract: `field_name`, `city`/`state`, `coordinates_dms`, decimal `latitude`/`longitude`, `crop_general`, `crop_target`, `variety`, `soil_type_form_value`, `organic_management`, `biodynamic_methods`, `grower`, `comments` (preserve original spelling — it is contributor-authored data), `client_label`, `collection_date`, treatment/amendment blocks.
- Do **not** extract submitter email or name into the public metadata.

#### (C) Lab-issued wide CSV (multi-site monitoring data)
- Use **wide-format CSV** with one row per site. Reference: [contributions/manaolana/ewa-water-quality/](contributions/manaolana/ewa-water-quality/).
- Standard columns: `site_id, site_name, sample_date, latitude, longitude` + per-metric numeric columns + `matrix, collection_method, license, topics`.
- Each `site_id` must be unique within the file (validator dedups).

#### (D) GeoJSON layer
- Used for `spatial_overlay`. Must be a `FeatureCollection`. Each feature's `properties` carry the schema fields. Reference: [contributions/_example/oahu-wetland-nwi/](contributions/_example/oahu-wetland-nwi/).

### Step 4 — Geographic anchor (one of these is required)

| Method | Sufficient for | Notes |
|---|---|---|
| Per-row `latitude` + `longitude` columns in the CSV/GeoJSON | All types | **Preferred** — enables H3 cell assignment and moku resolution downstream. Hawaii bounds: lat 18–23, lng −161 to −154. Outside → validator warning. |
| `moku_ids` array in metadata | All types | Compound IDs like `oahu-kona`, `oahu-koolaupoko`. Full list: [docs/moku-districts.md](docs/moku-districts.md). Schema validates ID format only; the validator warns on unknown IDs. |
| `coverage` text (≥10 chars) in metadata | `observation` and `spatial_overlay` only | **Insufficient for `indicator`** — indicators must have lat/long or moku_ids ([scripts/validate-pr.mjs:194](scripts/validate-pr.mjs#L194)). |

When the source provides DMS coordinates (e.g., `21.333455°N 157.895294°W`), convert to decimal degrees (negative for W longitude in Hawai'i) and store both: decimal in `latitude`/`longitude` columns and `sample_context.latitude`/`longitude`, original DMS string in `sample_context.coordinates_dms`.

Common O'ahu moku assignments by general location:
- Honolulu / downtown / Punchbowl / Mānoa / Makiki → `oahu-kona`
- Kailua / Kāne'ohe / Waimānalo / Ka'a'awa → `oahu-koolaupoko`
- Hau'ula / Lā'ie / Kahuku → `oahu-koolauloa`
- Hale'iwa / Waialua → `oahu-waialua`
- Wai'anae coast → `oahu-waianae`
- Pearl City / 'Ewa Beach / Kapolei / Mākaha to Wai'anae transition / Keehi → `oahu-ewa`

### Step 5 — Build `metadata.json`

Required top-level: `contributor`, `datasets[]`. Per dataset: `file, title, license, contribution_type, topics, quality, schema, required_fields`. See [schemas/metadata.schema.json](schemas/metadata.schema.json) for the full grammar; mirror [templates/metadata-template.json](templates/metadata-template.json) as a starting point.

For `observation`:
- `sample_context.matrix` is required, controlled vocab: `soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`. Multi-matrix samples are valid (e.g., `["soil", "sediment"]`).
- Everything else under `sample_context` is free-form. Pack lab provenance there: `lab_name`, `lab_facility`, `assay`, `assay_barcode`, `lab_code`, `sample_id`, `sample_reference`, `site_label`, `field_name`, `sequencing_panel`, three explicit dates (`collection_date`, `lab_received_date`, `report_date`), `species_detected`, `report_pdf`, `submission_form`, `coordinates_dms`, `crop_target`, etc.

For `indicator`:
- `baseline_context.supplements` is required — array of Data Commons variable DCIDs (e.g., `UnemploymentRate_Person`, `Median_Income_Household`, `Count_Person_BelowPovertyLevelInThePast12Months`). See [docs/topics.md](docs/topics.md) for the common variable list.
- Optional: `resolution_gain` (e.g., "moku-level"), `comparison_method`.

For all types:
- `quality`: `preliminary` (raw, not QA'd), `verified` (contributor-QA'd), or `peer_reviewed`. Lab-issued reports default to `verified`.
- `license`: `CC-BY-4.0` is the repo recommendation. **Before defaulting for a commercial lab assay (e.g., BeCrop), check the lab's confidentiality clause** — some include "no part may be reproduced for commercial or public use without permission" language. Surface this to the contributor and confirm before PR.
- `topics`: from controlled vocab in [docs/topics.md](docs/topics.md). Multiple topics OK (e.g., a flower-crop soil microbiome → `["land_environment", "agriculture"]`).
- `temporal_coverage`: ISO dates `start`/`end`. For a single-day sample, `start === end`.
- `schema`: column → type map. Types: `string`, `number`, `date`, `boolean`. `value_numeric` should be `number` even when most cells are empty (validator skips empty cells in type checks).
- `required_fields`: subset of `schema` keys that must be non-empty in every row. Always include the row's identifying key, the date, and the geographic anchor columns when present.

### Step 6 — Naming and directory layout

Directory: `contributions/{contributor-slug}/{dataset-slug}/`. Dataset slug pattern: `{descriptor}-{location-or-id}-{period}`, e.g.:
- `becrop-loc01-2026`
- `ewa-water-quality`
- `oahu-wetland-nwi`

Data filename matches the dataset slug: `{dataset-slug}.csv` or `{dataset-slug}.geojson`.

Files in the dataset directory:
- `metadata.json` — required
- `<dataset-slug>.csv` or `.geojson` — required, the file declared in `metadata.datasets[].file`
- `*.pdf` — optional sidecar (raw lab report, kept for provenance)
- Other supporting docs — optional, ignored by the validator

### Step 7 — Validate

```bash
CHANGED_DIRS="<contributor-slug>/<dataset-slug>" node scripts/validate-pr.mjs
```

Common failures and fixes:

| Error | Fix |
|---|---|
| `Schema: /datasets/0/... must NOT have additional properties` | Field name in metadata is not in the schema. Check spelling against [schemas/metadata.schema.json](schemas/metadata.schema.json). |
| `Required field "X" is empty` at row N | A `required_fields` column has an empty cell at that row. |
| `expected number, got "..."` at row N | A schema-declared `number` column has a non-numeric value. Convert or fix. |
| `duplicate site_id "..."` | Wide-format CSV has duplicate `site_id` values, **or** you accidentally added `site_id` to a long-format CSV (don't — use `record_id`/`location_id`). |
| `coordinates outside Hawaii bounds` | Warning, not error. Verify lat/long signs (W longitude must be negative). |
| `Contributor "..." is not approved in registry/contributors.json` | Blocker. Onboard the contributor via GitHub issue first. |
| `contribution_type "observation" requires a sample_context block` | Add `sample_context.matrix` at minimum. |
| `contribution_type "indicator" requires either coordinate columns or explicit moku_ids` | Coverage text alone is insufficient for indicators. Add lat/long columns or `moku_ids`. |

### Step 8 — Report back to the contributor

When the validator is green, summarize concisely:
1. Files added (workspace-relative paths as markdown links).
2. Records validated, rejected, flagged.
3. Any warnings the contributor should consider before PR.
4. **Open questions**: fields the form left blank (irrigation, density, treatments, previous crop, etc.) that the contributor may want to populate before submitting. Do not invent values.
5. **License confirmation**: if the source is a commercial lab assay, ask the contributor to confirm the chosen license is compatible with the lab's terms.

Then suggest next steps: open the PR, or propose follow-up samples if the source set has more.

## PII discipline (read this every time)

Anything that lands in `contributions/` ships to the public commons. Forms with submitter emails, phone numbers, internal client IDs, addresses, or other personal details **must stay in `/samples`** (already gitignored). Reference them by filename only in `sample_context.submission_form` with a note about why the file is private. When in doubt, do not copy.

## Multi-sample batches

When a single submission form lists multiple samples (common — the form is often a registry sheet for an entire batch), produce one dataset directory per sample reference. Each gets its own metadata.json and CSV. Use a shared parent identifier in `sample_context.batch_id` to keep them linkable. Long-format CSVs scale across batches by appending rows with distinct `location_id`/`sample_id` values.

## When to suggest schema extensions

If three or more lab-report submissions arrive with the same provenance shape (lab_name, assay, assay_barcode, report_date), it may be worth proposing a formal `lab_report` sub-block in [schemas/metadata.schema.json](schemas/metadata.schema.json) and a `supporting_files: string[]` field on `DatasetEntry` so PDFs become first-class. Do not propose this preemptively — wait for the pattern to repeat.
