# Copilot Instructions for `mokulearner-research`

## Commands

This repository does not have an application build, test, or lint pipeline. The main automated check is contribution validation.

```bash
npm ci
npm run validate
CHANGED_DIRS="contributor-slug/dataset-slug" node scripts/validate-pr.mjs
```

- `npm run validate` runs `node scripts/validate-pr.mjs` across all non-underscore contribution directories.
- `CHANGED_DIRS="contributor-slug/dataset-slug" node scripts/validate-pr.mjs` is the targeted check to use while editing a single dataset; CI uses the same mechanism for changed contribution directories.
- `npm run validate:example` validates the `_example/oahu-wetland-nwi` sample contribution.

## High-level architecture

This repository is a **research-data contribution registry**, not an application service. The main artifact is a contribution directory under `contributions/{contributor-slug}/{dataset-slug}/`, usually containing:

- `metadata.json`
- one declared primary data file (`.csv` or `.geojson`)
- optional sidecars such as PDFs for provenance

The core flow spans these files:

- `schemas/metadata.schema.json` defines the allowed shape of `metadata.json`.
- `registry/contributors.json` is the source of truth for approved contributor slugs.
- `scripts/validate-pr.mjs` loads the schema, valid moku IDs, and contributor registry, then validates contribution directories and writes `validation-report.json`.
- `.github/workflows/validate-contribution.yml` finds changed dataset directories in a PR, passes them through `CHANGED_DIRS`, and posts the validator output back to the PR.
- `docs/topics.md` explains how `contribution_type` and `topics` map into the Mokunet graph model.

The key modeling split is by `datasets[].contribution_type`:

- `observation`: geocoded environmental samples; requires `sample_context.matrix`
- `indicator`: sub-county statistics refining county baselines; should include `baseline_context.supplements` and **must** have coordinates or explicit `moku_ids`
- `spatial_overlay`: GIS layers that extend spatial coverage, usually GeoJSON

Coordinates are the preferred geographic anchor. When present, downstream systems assign records to moku districts and H3 cells automatically.

## Repository-specific conventions

### Dataset layout and naming

- Keep each dataset self-contained in `contributions/{contributor-slug}/{dataset-slug}/`.
- Match the declared data filename to the dataset slug when possible: `{dataset-slug}.csv` or `{dataset-slug}.geojson`.
- Do not invent contributor slugs; they must already exist with `status: "approved"` in `registry/contributors.json`.

### Metadata conventions

- `required_fields` must be a subset of `schema` keys; the validator checks both declaration and per-row non-null values.
- `sample_context` is mostly free-form except for `matrix`, which uses the controlled vocabulary from the schema.
- `baseline_context` is only meaningful for `indicator` datasets.
- `coverage` is enough for `observation` and `spatial_overlay` datasets that lack coordinates, but not for `indicator`.
- `sdg_codes` and `moku_ids` can be omitted when coordinates are present; they are typically derived downstream.

### CSV / GeoJSON shaping

- The validator enforces unique `site_id` values when that field exists. For repeated site monitoring in wide-format CSVs, use composite IDs such as `loc1-2026-02-10`.
- For long-format lab-report conversions, avoid a shared `site_id` column. Follow the `contributions/manaolana/becrop-loc01-2026/` pattern with row-level identifiers like `record_id` plus a shared `location_id`.
- Encode measurement units directly in column names for wide-format observation datasets when practical (`dissolved_oxygen_mg_l`, `conductivity_us_cm`, `turbidity_ntu`).
- GeoJSON contributions must be `FeatureCollection`s, and the declared schema maps to feature `properties`.

### Working from raw sample files

- `samples/` is a private, gitignored intake area for raw lab returns and submission forms.
- Never move PII-bearing intake forms into `contributions/`. Extract only the non-sensitive fields needed for public metadata.
- The primary declared data file must be `.csv` or `.geojson`; PDFs and other supporting files can live beside the dataset as sidecars but should not be listed in `metadata.datasets[].file`.

### Source docs to reuse

- Start from `templates/metadata-template.json` when creating new metadata.
- Use `docs/topics.md` for topic selection and contribution-type rules.
- Use `docs/moku-districts.md` only when explicit `moku_ids` are needed.
- Use `docs/arcgis-workflow.md` for ArcGIS-derived datasets and `contributions/_example/` plus `contributions/manaolana/` as the main implementation examples.
- Reuse `.claude/skills/sample-submission/SKILL.md` for raw lab returns in `samples/`; it captures the repo's preferred long-format lab-report conversion, sidecar-file handling, and PII rules.
