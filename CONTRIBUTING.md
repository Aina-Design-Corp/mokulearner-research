# Contributing to the Research Commons

Thank you for contributing research data to Hawai'i's shared research commons. This guide walks through the full contribution process — from registration to ingestion.

Your contributed data becomes part of the [Mokunet](https://mokunet.us) provenance graph, queryable through the [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) portal. Each contribution is automatically compared against county-level baselines from [Data Commons](https://datacommons.org/), so your site-level research helps communities understand how local conditions relate to broader indicators like poverty rate, median income, and unemployment.

## Prerequisites

- A GitHub account ([sign up free at github.com](https://github.com/signup))
- A dataset in CSV or GeoJSON format

**No git installation required.** You can complete the entire contribution using the GitHub website — no software to install. Steps 4 and 5 below include both the GitHub website path (recommended for researchers new to git) and the command-line git path for labs that already use git.

New to GitHub entirely? See [docs/github-for-researchers.md](docs/github-for-researchers.md) for a plain-language walkthrough with step-by-step instructions.

## Step 1: Register as a Contributor

Before your first contribution, register your lab or organization:

1. Open a [New Contributor issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml)
2. Fill in your organization name, institution, contact info, and research focus areas
3. A community maintainer will review and approve your registration
4. Once approved, your contributor slug will be added to `registry/contributors.json`

You only need to do this once. After approval, you can submit unlimited contributions.

**University labs**: Use your department or lab group as the contributor identity (e.g., `uh-ctahr-soil-lab`, `hpu-marine-science`). This keeps contributions organized by research group.

## Step 2: Choose Your Contribution Type

Mokunet distinguishes between datasets based on how they integrate with the spatial governance graph. Before preparing your data, identify which type applies:

| Type | When to Use | SDG Alignment | Required Metadata |
|---|---|---|---|
| **observation** | Geocoded environmental samples (water quality, soil tests, species surveys, air monitoring) | Graph-grounded via `MEASURES_SDG` edges | `sample_context` with matrix |
| **indicator** | Sub-county statistical data that refines county-level baselines (demographics, employment, wellbeing surveys) | Graph-grounded via `MEASURES_SDG` + `REFINES_BASELINE` edges | `baseline_context` with supplements; requires coordinates or `moku_ids` |
| **spatial_overlay** | GIS layers that enhance zone coverage (wetland boundaries, land use, parcels) | Enhances backbone zones | GeoJSON format typical |

**Why this matters:** The Island Baselines page currently shows county-level statistics from federal sources with editorial SDG labels. Only contributed research data creates graph-grounded SDG measurement. Observation data populates the environment zone layer; indicator data is the mechanism that bridges county statistics to moku-level governance.

See [docs/topics.md](docs/topics.md#contribution-types) for detailed guidance on choosing your type.

## Step 3: Prepare Your Data

### Data Format

- **CSV** — One row per observation/record, with headers matching your declared schema
- **GeoJSON** — FeatureCollection with properties on each feature

### Location Data

If your data includes coordinates (`latitude` and `longitude` columns in WGS84), the platform will automatically assign records to the appropriate moku districts. This is the easiest path — just include the coordinates you already have.

If your data does not include coordinates, add a `coverage` field to your `metadata.json` describing the geographic scope (e.g., "Windward O'ahu coastal wetlands" or "Statewide census tract data"). You can also optionally provide `moku_ids` if you know which districts apply.

**Note for indicator contributions:** Contributions with `contribution_type: "indicator"` require either coordinate columns or explicit `moku_ids` — a text coverage description alone cannot be spatially resolved to refine baselines.

### Metadata

Every contribution needs a `metadata.json` file. Start from the [template](templates/metadata-template.json) and fill in:

| Field | Required | Description |
|---|---|---|
| `contributor` | Yes | Your contributor slug (from registration) |
| `datasets[].file` | Yes | Filename of your data file (must end in `.csv` or `.geojson`) |
| `datasets[].title` | Yes | Human-readable title |
| `datasets[].description` | No | Brief description of methods and coverage |
| `datasets[].license` | Yes | Open data license (CC-BY-4.0, CC0, etc.) |
| `datasets[].citation` | No | Preferred citation for your dataset |
| `datasets[].contribution_type` | Yes | `observation`, `indicator`, or `spatial_overlay` (see Step 2) |
| `datasets[].topics` | Yes | Array from: land_environment, water, biodiversity, agriculture, coastal, climate, forestry, food_safety, infrastructure, demographics, community_wellbeing |
| `datasets[].quality` | Yes | One of: preliminary, verified, peer_reviewed |
| `datasets[].coverage` | When needed | Text description of geographic scope (required if data lacks coordinate columns and no `moku_ids` provided) |
| `datasets[].schema` | Yes | Column name to type mapping (`string`, `number`, `date`, `boolean`) |
| `datasets[].required_fields` | Yes | Columns that must be non-null in every record |
| `datasets[].access_level` | No | public (default), attributed, or restricted |
| `datasets[].temporal_coverage` | No | `{ "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }` |
| `datasets[].sample_context` | For observations | Environmental sample metadata (see [docs/topics.md](docs/topics.md#sample-context-for-observation-contributions)) |
| `datasets[].baseline_context` | For indicators | Baseline refinement metadata (see [docs/topics.md](docs/topics.md#baseline-context-for-indicator-contributions)) |
| `datasets[].moku_ids` | No | Array of moku district IDs (optional — auto-derived from coordinates) |
| `datasets[].sdg_codes` | No | SDG codes (optional — auto-derived from topics) |

### Example: Federal Data (One-Time Import)

See [contributions/_example/](contributions/_example/) for a working example using O'ahu wetland data from the USFWS National Wetlands Inventory. This shows a typical one-time import of a verified federal dataset.

### Example: Community-Sourced Observations (Ongoing Sampling)

See [contributions/manaolana/ewa-water-quality/](contributions/manaolana/ewa-water-quality/) for a working example of community-based water quality monitoring. This demonstrates the pattern for ongoing sampling programs:

- **Time-series `site_id`**: When the same site is sampled across multiple dates, use composite IDs like `loc1-2026-02-10` to keep each record unique while preserving the `location_code` for grouping
- **Chemistry columns with units**: Column names encode units (e.g., `dissolved_oxygen_mg_l`, `conductivity_us_cm`, `turbidity_ntu`) so downstream consumers don't need to guess
- **Auto-derived fields**: The Manaolana dashboard exports `latitude`/`longitude` and compound `moku_ids` (`oahu-ewa`) automatically — the platform handles H3 spatial assignment from there
- **Incremental updates**: As new sampling events occur, export the updated dataset and open a new PR. The ingestion system uses MERGE operations — existing records stay, new records are added

This pattern applies to any community monitoring program (not just water quality). If your group collects geocoded field observations on a regular schedule, this is the contribution shape to follow.

## Step 4: Fork and Add Your Contribution

### Option A: Using the GitHub Website (no git installation required)

1. Click **Fork** at the top-right corner of this repository's page. This creates your own copy of the repository under your GitHub account.
2. In your fork, click into the `contributions/` folder in the file browser.
3. Click **Add file → Create new file**.
4. In the filename box, type the full path including slashes, for example:
   `your-slug/dataset-slug/metadata.json`
   GitHub automatically creates the folders when you include `/` in the filename.
5. Paste in your completed `metadata.json` content (start from the [template](templates/metadata-template.json)).
6. Click **Commit changes** at the bottom of the page.
7. Navigate back to `contributions/your-slug/dataset-slug/` in your fork.
8. Click **Add file → Upload files** to upload your CSV or GeoJSON data file into the same folder.
9. Click **Commit changes**.

### Option B: Using Git on the command line

1. **Fork** this repository to your GitHub account (click "Fork" at the top-right of this page).
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/mokulearner-research.git
   cd mokulearner-research
   ```
3. **Create** the contribution directory and add your files:
   ```bash
   mkdir -p contributions/your-slug/dataset-slug
   # Copy your data file and metadata.json into that directory
   ```
4. **Commit and push:**
   ```bash
   git add contributions/your-slug/
   git commit -m "Add your-slug/dataset-slug contribution"
   git push origin main
   ```

---

In either case, your directory should contain:

```
contributions/
  your-slug/
    dataset-slug/
      metadata.json
      your-data-file.csv
```

## Step 5: Open a Pull Request

### Option A: From the GitHub Website

1. After uploading your files, go to the **original** repository at
   [github.com/Aina-Design-Corp/mokulearner-research](https://github.com/Aina-Design-Corp/mokulearner-research).
2. GitHub will show a yellow banner saying your fork is ahead — click **"Compare & pull request"**.
3. **Fill in** the PR template checklist.
4. Click **"Create pull request"**.
5. **Wait** for automated validation — GitHub Actions checks your metadata and data file, and posts results as a comment on your PR.
6. **Address** any validation errors flagged by the automated checks by editing your files in your fork (changes sync automatically to the open PR).
7. A community maintainer will **review and merge** your contribution.

### Option B: From the Command Line

1. **Push** your branch if you haven't already: `git push origin main`
2. **Open a pull request** by visiting the original repository and clicking **"Compare & pull request"**, or use the GitHub CLI: `gh pr create`
3. **Fill in** the PR template checklist.
4. **Wait** for automated validation (GitHub Actions checks your metadata and data).
5. **Address** any validation errors flagged by the automated checks.
6. A community maintainer will **review and merge** your contribution.

## What Happens After Merge

Once your PR is merged:

1. Your data enters the Mokunet provenance graph as `ResearchContribution` and `ResearchRecord` nodes
2. If your data has coordinates, records are automatically linked to moku districts and H3 cells
3. SDG codes are assigned based on your topic selections
4. Your data is compared against county-level Data Commons baselines — the platform identifies which federal indicators your research supplements at the moku level
5. Your contribution becomes queryable via the [Mokunet Research API](https://mokunet.us/api/research)
6. The data appears on [HKA](https://huikoeaina.ainadesign.org) maps and search results
7. Other researchers and community partners can discover and build on your work

## Updating Existing Contributions

To update a dataset with new data or improved quality:

1. Replace the data file in your contribution directory
2. Update the `metadata.json` if any metadata has changed (e.g., upgrading `quality` from `preliminary` to `verified`)
3. Open a new PR with the updates
4. The ingestion system uses MERGE operations — existing records are updated, new records are added

## Programmatic Access

If your lab needs to query research data programmatically (for analysis scripts, dashboards, or CI pipelines), you can request an API subscription key. Contact the community maintainers or sign up through [HKA](https://huikoeaina.ainadesign.org).

API documentation: `GET /api/v1/research?moku=oahu-koolaupoko&topic=water`

## Questions?

- Open a [discussion](https://github.com/Aina-Design-Corp/mokulearner-research/discussions) for general questions
- Open an [issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues) for bug reports or feature requests
- Visit [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) for interactive data browsing and map tools
