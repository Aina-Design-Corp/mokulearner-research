# Mokunet Research Commons

Localizing cross-domain metrics for Hawaiʻi — bridging the gap between federal county-level baselines and the 33 traditional moku districts where community governance actually happens.

## What Is This?

When a community measures its water or soil, that reading should count — and stay traceable to who gathered it, where, and when. This repository is where Hawaiʻi researchers and community groups contribute environmental observations and community statistics to a shared research commons, sharpening the picture of what's actually happening in their moku.

**The resolution gap:** Hawaiʻi has 5 counties but 33 moku districts. Federal baseline indicators — farm counts, unemployment rates, median income, rainfall, energy production — are published at county resolution through the [Data Commons](https://datacommons.org/) knowledge graph. The Mokunet platform presents these as *island-effect baselines*: they tell you where things stand at the island level. Research gaps often occur within the island model.

**Your research fills the gap — through two pathways:**

- **Environmental observations** (water quality, soil tests, species surveys, air monitoring) show what conditions actually are at specific places.
- **Community indicators** (demographics, employment, wellbeing surveys, infrastructure) refine the county-level federal statistics at the moku level.

Both pathways resolve to specific moku districts and connect to shared sustainability goals, so a water quality study in Maunalua Bay and a food security survey in Waiʻanae become comparable side by side — making district-level variation visible for the first time. When your data includes coordinates, the platform anchors it to the right district automatically; for observation data without coordinates, a text description of geographic scope is sufficient. (For the underlying technical mechanics, see [docs/topics.md](docs/topics.md#how-contributions-are-wired-into-the-graph).)

**Hui Koʻe ʻĀina** ([huikoeaina.ainadesign.org](https://huikoeaina.ainadesign.org)) is the natural resource management portal where contributors and the learning community browse, query, and visualize this data on interactive maps. Governed under the UH Foundation, HKA provides the community entry point for University of Hawaiʻi and Hawaiʻi Pacific University research labs looking to de-silo their data.

**Contributions are:**
- Version-controlled with full Git provenance
- Validated automatically via GitHub Actions
- Reviewed by community maintainers before ingestion
- Compared against county-level baselines from Data Commons
- Publicly accessible as commons data (default)

## Who Contributes?

Research labs across Hawaiʻi's university system and community organizations:

| Institution | Example Labs / Groups | Focus Areas |
|---|---|---|
| **UH Mānoa** | SSRI, CTAHR, SOEST, WRRC | Demographics, agriculture, coastal, water |
| **UH Hilo** | Tropical Conservation Biology & Environment | Forestry, biodiversity |
| **Hawaiʻi Pacific University** | Natural Sciences, Marine Science | Biodiversity, coastal |
| **Community organizations** | Watershed partnerships, conservation districts | Water, land environment |
| **State & federal agencies** | DLNR, DOH, USGS, NOAA, USFWS | Multi-topic |

Your research already has a place in the commons. Just bring your data — the contribution pipeline is designed to handle geographic anchoring, sustainability goal linkage, and baseline comparison, and that ingestion path is being brought online now.

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full step-by-step guide.

**Quick overview:**
1. [Register as a contributor](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml) (GitHub issue)
2. Fork this repository *(click "Fork" at the top-right of this page — this creates your own copy to edit)*
3. Add your data to `contributions/{your-slug}/{dataset-slug}/`
4. Include a `metadata.json` (use [the template](templates/metadata-template.json))
5. Open a pull request — GitHub Actions validates automatically

If your lab already uses Git for code, the same workflow applies to data.

**New to GitHub?** See the [GitHub for Researchers guide](docs/github-for-researchers.md) for a plain-language walkthrough — no software installation required.

**Working with ArcGIS Online?** Many Hawaiʻi research organizations publish geospatial data through ArcGIS Online feature services. See the [ArcGIS Online Workflow Guide](docs/arcgis-workflow.md) for step-by-step instructions on discovering, downloading, and transforming ArcGIS data into the contribution format.

**Using Claude Code?** This repo ships with a project-local Claude Code skill at [.claude/skills/sample-submission/](.claude/skills/sample-submission/) that guides preparation of a contribution from a raw lab return — PDF lab report, xlsx submission form, wide-format lab CSV, or GeoJSON layer. Create a `samples/` directory at the repo root (gitignored by default), drop your files in, and ask Claude to *"prepare a contribution from this sample"*. The skill handles PDF-to-CSV translation, PII extraction from submission forms, geographic anchoring (decimal lat/long, moku assignment, or coverage text), `metadata.json` assembly, and validation against the repo schema before you open a PR. The skill works alongside the manual workflow — read [CONTRIBUTING.md](CONTRIBUTING.md) for the underlying steps it automates.

## What You Need to Provide

| Field | Required | Description |
|---|---|---|
| Data file | Yes | CSV or GeoJSON with your research data |
| Title | Yes | Human-readable name for the dataset |
| Contribution type | Yes | `observation`, `indicator`, or `spatial_overlay` — how your data integrates with the governance graph |
| Topics | Yes | What domain your research addresses (e.g. `water`, `demographics`) |
| License | Yes | Open data license (CC-BY-4.0 recommended) |
| Quality level | Yes | `preliminary`, `verified`, or `peer_reviewed` |
| Schema | Yes | Column names and types in your data file |
| Sample context | For observations | What was physically collected (soil, water, sediment, etc.) |
| Baseline context | For indicators | Which Data Commons variables your data supplements |
| Coverage | When needed | Text description of geographic scope (only if data lacks coordinates) |

**You do NOT need to provide:**
- Moku district IDs — auto-derived from coordinates, or inferred from your coverage description
- SDG codes — auto-derived from your topic selections
- Baseline comparisons — the platform links your data to county-level Data Commons indicators automatically

## Contribution Types

Every dataset declares a `contribution_type` that determines how it integrates with the spatial governance graph:

### Observations (Environmental Samples)

Researchers collect a wide range of environmental samples — soil cores, water grabs, sediment profiles, sludge from treatment facilities, tissue biopsies, air quality readings. Observation contributions carry a `sample_context` block describing what was physically collected.

- **Topics** identify the domain question (e.g. `land_environment`, `water`, `coastal`). The platform uses topics for discovery and ties each dataset to the sustainability goals it measures.
- **`sample_context`** is required — only the `matrix` field is controlled (`soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`); everything else is free-form.
- A single contribution can span multiple sample matrices under one topic. A land environment study collecting soil cores, stream sediment, and composting facility sludge from the same sites submits one dataset with `"matrix": ["soil", "sediment", "sludge"]`.

### Indicators (Community Statistics)

Indicator contributions provide sub-county statistical data that refines the county-level federal baselines shown on the [Island Baselines](https://hawaii.mokunet.us/place-types) page. These carry a `baseline_context` block declaring which Data Commons variables they supplement.

- **Topics** like `demographics`, `community_wellbeing`, and `infrastructure` are typical indicator topics.
- **`baseline_context`** declares which county-level variables this dataset refines (e.g., `UnemploymentRate_Person`, `Median_Income_Household`), enabling baseline-refinement links.
- **Spatial precision required:** Indicator contributions must include coordinate columns or explicit `moku_ids` — a text coverage description alone cannot be spatially resolved to refine baselines.

### Spatial Overlays

GIS layers (wetland boundaries, land use classification, parcel boundaries) that enhance place coverage on the shared map. These typically use GeoJSON format.

See [docs/topics.md](docs/topics.md) for the full topic taxonomy, contribution type guidance, and metadata examples.

## How Contributions Join the Shared Map

Contributed datasets become part of the [Mokunet](https://hawaii.mokunet.us)
shared map with their provenance intact — who gathered each record, where, and
when. Geocoded observations are anchored to their moku and to location cells on
the shared map, then tied to the UN Sustainable Development Goals they measure.
Indicator datasets additionally track exactly which county baselines they
refine, which is why they need coordinates or explicit `moku_ids`.

Both contribution types land on the same shared map, which is what enables
cross-domain comparison at the district level. (The technical wiring — graph
records, links, and cell resolution — is documented in
[docs/topics.md](docs/topics.md#how-contributions-are-wired-into-the-graph).)

## Topic Taxonomy

Contributions are tagged with topics from a controlled vocabulary. Each topic maps to [ISO 37101](https://www.iso.org/standard/61885.html) community sustainability issues and aligns with Data Commons baseline indicators. SDG codes are automatically assigned based on your topic selections.

| Topic | Typical Type | Description | Example Datasets |
|---|---|---|---|
| **land_environment** | observation | Terrestrial substrates and environmental characterization | Soil surveys, sediment analysis, substrate testing |
| **water** | observation | Water quality and hydrology | Water quality, streamflow, effluent |
| **biodiversity** | observation | Species and ecosystem surveys | Species surveys, habitat mapping |
| **agriculture** | either | Crop and production data | Crop trials (obs), farm production by moku (ind) |
| **coastal** | observation | Shoreline and marine systems | Erosion rates, sea level, coral |
| **climate** | either | Weather, emissions, and energy | Weather stations (obs), solar generation by district (ind) |
| **forestry** | observation | Forest and canopy systems | Canopy cover, native species |
| **food_safety** | observation | Contamination and pathogen testing | Contamination testing, pathogens |
| **infrastructure** | indicator | Built systems and capacity | Water system capacity, broadband coverage |
| **demographics** | indicator | Population and governance data | Population by moku, employment by census tract |
| **community_wellbeing** | indicator | Community quality of life and social determinant indicators | QOL surveys, food insecurity rates, social trust indices |

## Moku Districts

The platform recognizes 33 traditional moku districts across 7 islands. You don't need to know these — the system assigns moku from coordinates automatically. If you're curious, see [docs/moku-districts.md](docs/moku-districts.md) for the full list.

## Quality Levels

| Level | Meaning | Review |
|---|---|---|
| **preliminary** | Raw field data, not yet QA'd | Spot-check |
| **verified** | QA'd by contributor, methods documented | Standard review |
| **peer_reviewed** | Published or reviewed by external party | Fast-track |

Preliminary data is welcome — the quality level is a declaration, not a gatekeep. Labs can upgrade quality by submitting a follow-up PR with updated metadata.

## Licenses

All contributions must use an open data license:
- **CC-BY-4.0** — Attribution (recommended)
- **CC-BY-SA-4.0** — Attribution-ShareAlike
- **CC-BY-NC-4.0** — Attribution-NonCommercial
- **CC0** — Public Domain
- **ODbL** — Open Database License

## Current Contributions

| Contributor | Dataset | Topics | Records |
|---|---|---|---|
| _example | [Oʻahu Wetland NWI Sample](contributions/_example/) | water, biodiversity, coastal | 50 |

## Repository Structure

```
schemas/                    JSON Schema for metadata validation
templates/                  Starter files for new contributions
registry/                   Approved contributor registry
contributions/              Contributed datasets (one directory per dataset)
docs/                       Reference documentation
samples/                    Private inbox for raw lab returns (gitignored)
.claude/skills/             Project-local Claude Code skills
scripts/validate-pr.mjs     Local validator (run before opening a PR)
.github/workflows/          Automated PR validation
```

## Links

- [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) — Browse, query, and contribute research data
- [Mokunet Platform](https://hawaii.mokunet.us) — API backend and data pipeline
- [Metadata Schema Reference](schemas/metadata.schema.json)

## License

This repository is licensed under [CC-BY-4.0](LICENSE). Individual contributions may use different compatible open licenses as declared in their metadata.json files.
