# Contributing to the Research Commons

Thank you for contributing research data to Hawai'i's shared research commons. This guide walks through the full contribution process — from registration to ingestion.

Your contributed data becomes part of the [Mokunet](https://mokunet.us) provenance graph, anchored to traditional moku districts and queryable through the [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) portal.

## Prerequisites

- A GitHub account
- A dataset in CSV or GeoJSON format
- Knowledge of which moku districts your data covers (see [docs/moku-districts.md](docs/moku-districts.md))

If your lab already uses Git for code, this workflow will feel familiar. If not, the steps below walk through everything.

## Step 1: Register as a Contributor

Before your first contribution, register your lab or organization:

1. Open a [New Contributor issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml)
2. Fill in your organization name, institution, contact info, and research focus areas
3. A community maintainer will review and approve your registration
4. Once approved, your contributor slug will be added to `registry/contributors.json`

You only need to do this once. After approval, you can submit unlimited contributions.

**University labs**: Use your department or lab group as the contributor identity (e.g., `uh-ctahr-soil-lab`, `hpu-marine-science`). This keeps contributions organized by research group.

## Step 2: Prepare Your Data

### Data Format

- **CSV** — One row per observation/record, with headers matching your declared schema
- **GeoJSON** — FeatureCollection with properties on each feature

### Recommended Columns

At minimum, your data should include:
- `site_id` — Unique identifier for each observation site
- `latitude` and `longitude` — WGS84 coordinates (Hawai'i bounds: lat 18-23, lng -161 to -154)

Additional columns depend on your research domain. Declare them in your `metadata.json` and the validation system will check them automatically.

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
| `datasets[].moku_ids` | Yes | Array of moku district IDs your data covers |
| `datasets[].topics` | Yes | Array from: land_environment, water, biodiversity, agriculture, coastal, climate, forestry, food_safety, infrastructure, demographics |
| `datasets[].sdg_codes` | Yes | Array of SDG codes: sdg2, sdg6, sdg7, sdg8, sdg11, sdg12, sdg13, sdg14, sdg15 |
| `datasets[].quality` | Yes | One of: preliminary, verified, peer_reviewed |
| `datasets[].access_level` | No | public (default), attributed, or restricted |
| `datasets[].temporal_coverage` | No | `{ "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }` |
| `datasets[].schema` | Yes | Column name to type mapping (`string`, `number`, `date`, `boolean`) |
| `datasets[].sample_context` | No | Environmental sample metadata (see [docs/topics.md](docs/topics.md#sample-context-optional)) |
| `datasets[].required_fields` | Yes | Columns that must be non-null in every record |

**Tip**: If you're unsure about moku IDs, use the [HKA map](https://huikoeaina.ainadesign.org) to look up which districts your sampling sites fall within.

### Example

See [contributions/_example/](contributions/_example/) for a complete working example using O'ahu wetland data from the USFWS National Wetlands Inventory.

## Step 3: Fork and Add Your Contribution

1. **Fork** this repository to your GitHub account
2. **Create** a directory: `contributions/{your-slug}/{dataset-slug}/`
   - `{your-slug}` is your registered contributor slug
   - `{dataset-slug}` is a short, descriptive name (e.g., `koolaupoko-soil-survey-2025`)
3. **Add** your data file (CSV or GeoJSON) to the directory
4. **Add** your `metadata.json` to the same directory

Your directory should look like:
```
contributions/
  your-slug/
    dataset-slug/
      metadata.json
      your-data-file.csv
```

## Step 4: Open a Pull Request

1. **Commit** your changes to your fork
2. **Open a pull request** against `main` on this repository
3. **Fill in** the PR template checklist
4. **Wait** for automated validation (GitHub Actions checks your metadata and data)
5. **Address** any validation errors flagged by the automated checks
6. A community maintainer will **review and merge** your contribution

## What Happens After Merge

Once your PR is merged:

1. Your data enters the Mokunet provenance graph as `ResearchContribution` and `ResearchRecord` nodes
2. Records are linked to moku districts via `COVERS_DISTRICT` and `LOCATED_IN` edges
3. Your contribution becomes queryable via the [Mokunet Research API](https://mokunet.us/api/research)
4. The data appears on [HKA](https://huikoeaina.ainadesign.org) maps and search results
5. Other researchers and community partners can discover and build on your work

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
