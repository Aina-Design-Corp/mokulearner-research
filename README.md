# Mokunet Research Commons

Localizing cross-domain metrics for Hawai'i — bridging the gap between federal county-level baselines and the 33 traditional moku districts where community governance actually happens.

## What Is This?

This repository is how university and community researchers contribute local data to Hawai'i's shared research commons. Contributed datasets become nodes in the [Mokunet](https://hawaii.mokunet.us) provenance graph, where they create graph-grounded SDG alignment through `MEASURES_SDG` edges — the only SDG measurement in the platform backed by graph relationships.

**The resolution gap:** Hawai'i has 5 counties but 33 moku districts. Federal baseline indicators — farm counts, unemployment rates, median income, rainfall, energy production — are published at county resolution through the [Data Commons](https://datacommons.org/) knowledge graph. The Mokunet platform presents these as *island-effect baselines*: they tell you where things stand at the island level. Research gaps often occur within the island model.

**Your research fills the gap — through two pathways:**

- **Environmental observations** (water quality, soil tests, species surveys, air monitoring) populate the spatial measurement layer. Geocoded records are assigned to moku districts and H3 cells, then linked to SDGGoal nodes through `MEASURES_SDG` edges.
- **Community indicators** (demographics, employment, wellbeing surveys, infrastructure) refine the county-level federal statistics at the moku level. These create `MEASURES_SDG` edges plus `REFINES_BASELINE` edges that explicitly track which county baselines are being supplemented.

Both pathways resolve to specific moku, link to SDG goals through graph edges, and enable cross-domain comparison at the district level. A water quality study in Maunalua Bay and a food security survey in Waianae both flow through the same spatial backbone — making district-level variation visible for the first time.

When your data includes coordinates, the platform automatically assigns it to the appropriate moku districts and [H3 hexagonal cells](https://h3geo.org/) (resolution 8). For observation data without coordinates, a text description of geographic scope is sufficient. For indicator data that refines baselines, coordinates or explicit `moku_ids` are required for spatial resolution.

**Hui Koe Aina** ([huikoeaina.ainadesign.org](https://huikoeaina.ainadesign.org)) is the natural resource management portal where contributors and the learning community browse, query, and visualize this data on interactive maps. Governed under the UH Foundation, HKA provides the community entry point for University of Hawai'i and Hawai'i Pacific University research labs looking to de-silo their data.

**Contributions are:**
- Version-controlled with full Git provenance
- Validated automatically via GitHub Actions
- Reviewed by community maintainers before ingestion
- Compared against county-level baselines from Data Commons
- Publicly accessible as commons data (default)

## Who Contributes?

Research labs across Hawai'i's university system and community organizations:

| Institution | Example Labs / Groups | Focus Areas |
|---|---|---|
| **UH Manoa** | SSRI, CTAHR, SOEST, WRRC | Demographics, agriculture, coastal, water |
| **UH Hilo** | Tropical Conservation Biology & Environment | Forestry, biodiversity |
| **Hawai'i Pacific University** | Natural Sciences, Marine Science | Biodiversity, coastal |
| **Community organizations** | Watershed partnerships, conservation districts | Water, land environment |
| **State & federal agencies** | DLNR, DOH, USGS, NOAA, USFWS | Multi-topic |

Your research already has a place in the commons. Just bring your data — the platform handles geographic anchoring, sustainability goal linkage, and baseline comparison automatically.

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

**Working with ArcGIS Online?** Many Hawai'i research organizations publish geospatial data through ArcGIS Online feature services. See the [ArcGIS Online Workflow Guide](docs/arcgis-workflow.md) for step-by-step instructions on discovering, downloading, and transforming ArcGIS data into the contribution format.

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

- **Topics** identify the domain question (e.g. `land_environment`, `water`, `coastal`). The platform uses topics for graph discovery and creates `MEASURES_SDG` edges to SDGGoal nodes.
- **`sample_context`** is required — only the `matrix` field is controlled (`soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`); everything else is free-form.
- A single contribution can span multiple sample matrices under one topic. A land environment study collecting soil cores, stream sediment, and composting facility sludge from the same sites submits one dataset with `"matrix": ["soil", "sediment", "sludge"]`.

### Indicators (Community Statistics)

Indicator contributions provide sub-county statistical data that refines the county-level federal baselines shown on the [Island Baselines](https://hawaii.mokunet.us/place-types) page. These carry a `baseline_context` block declaring which Data Commons variables they supplement.

- **Topics** like `demographics`, `community_wellbeing`, and `infrastructure` are typical indicator topics.
- **`baseline_context`** declares which county-level variables this dataset refines (e.g., `UnemploymentRate_Person`, `Median_Income_Household`), enabling `REFINES_BASELINE` edges.
- **Spatial precision required:** Indicator contributions must include coordinate columns or explicit `moku_ids` — a text coverage description alone cannot be spatially resolved to refine baselines.

### Spatial Overlays

GIS layers (wetland boundaries, land use classification, parcel boundaries) that enhance zone coverage in the spatial backbone. These typically use GeoJSON format.

See [docs/topics.md](docs/topics.md) for the full topic taxonomy, contribution type guidance, and metadata examples.

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
| _example | [O'ahu Wetland NWI Sample](contributions/_example/) | water, biodiversity, coastal | 50 |

## Repository Structure

```
schemas/              JSON Schema for metadata validation
templates/            Starter files for new contributions
registry/             Approved contributor registry
contributions/        Contributed datasets (one directory per dataset)
docs/                 Reference documentation
.github/workflows/    Automated PR validation
```

## Links

- [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) — Browse, query, and contribute research data
- [Mokunet Platform](https://hawaii.mokunet.us) — API backend and data pipeline
- [Metadata Schema Reference](schemas/metadata.schema.json)

## License

This repository is licensed under [CC-BY-4.0](LICENSE). Individual contributions may use different compatible open licenses as declared in their metadata.json files.
