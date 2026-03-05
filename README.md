# Mokunet Research Commons

Localizing cross-domain metrics for Hawai'i — bridging the gap between federal county-level baselines and the 33 traditional moku districts where community governance actually happens.

## What Is This?

This repository is how university and community researchers contribute local data to Hawai'i's shared research commons. Contributed datasets become nodes in the [Mokunet](https://hawaii.mokunet.us) provenance graph, linked to research topics and UN Sustainable Development Goal classifications.

**The resolution gap:** Hawai'i has 5 counties but 33 moku districts. Federal baseline indicators — farm counts, unemployment rates, median income, rainfall, energy production — are published at county resolution through the [Data Commons](https://datacommons.org/) knowledge graph. The Mokunet platform presents these as *island-effect baselines*: they tell you where things stand at the island level. Research gaps often occur within the island model.

**Your research fills the gap.** When you contribute geocoded field data, the platform assigns it to specific moku districts and H3 hexagonal cells, then compares it against the relevant county baselines. This creates the first cross-domain view where communities can see how site-level conditions relate to broader island trends — and where district-level variation becomes visible for the first time.

**Cross-domain metrics** means your soil chemistry data, water quality readings, species surveys, and community health assessments all flow through the same spatial backbone and are classified against the same SDG framework. A water quality study in Maunalua Bay and a food security survey in Waianae both resolve to specific moku, link to their county baselines, and map to SDG goals — making cross-domain comparison possible at the district level.

When your data includes coordinates, the platform automatically assigns it to the appropriate moku districts and [H3 hexagonal cells](https://h3geo.org/) (resolution 8). When it doesn't, a simple text description of geographic scope is all that's needed.

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
2. Fork this repository
3. Add your data to `contributions/{your-slug}/{dataset-slug}/`
4. Include a `metadata.json` (use [the template](templates/metadata-template.json))
5. Open a pull request — GitHub Actions validates automatically

If your lab already uses Git for code, the same workflow applies to data.

**Working with ArcGIS Online?** Many Hawai'i research organizations publish geospatial data through ArcGIS Online feature services. See the [ArcGIS Online Workflow Guide](docs/arcgis-workflow.md) for step-by-step instructions on discovering, downloading, and transforming ArcGIS data into the contribution format.

## What You Need to Provide

| Field | Required | Description |
|---|---|---|
| Data file | Yes | CSV or GeoJSON with your research data |
| Title | Yes | Human-readable name for the dataset |
| Topics | Yes | What domain your research addresses (e.g. `water`, `agriculture`) |
| License | Yes | Open data license (CC-BY-4.0 recommended) |
| Quality level | Yes | `preliminary`, `verified`, or `peer_reviewed` |
| Schema | Yes | Column names and types in your data file |
| Coverage | When needed | Text description of geographic scope (only if data lacks coordinates) |

**You do NOT need to provide:**
- Moku district IDs — auto-derived from coordinates, or inferred from your coverage description
- SDG codes — auto-derived from your topic selections
- Baseline comparisons — the platform links your data to county-level Data Commons indicators automatically

## Environmental Samples

Researchers collect a wide range of environmental samples — soil cores, water grabs, sediment profiles, sludge from treatment facilities, tissue biopsies, air quality readings. This commons does not attempt to define interfaces for each sample type. Instead, every contribution carries a standard metadata envelope that the platform can work with.

**How this works in practice:**

- **Topics** identify the domain question your research addresses (e.g. `land_environment`, `water`, `coastal`). The platform uses topics for graph discovery and automatically links to sustainability goals.
- **`sample_context`** is an optional block in your `metadata.json` where you describe what was physically collected. Only the `matrix` field is controlled (`soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`); everything else is free-form for your research context.
- **Your CSV columns** are declared in `schema` and validated, but the platform stores them as-is.

This means a single contribution can span multiple sample matrices under one topic. A land environment study collecting soil cores, stream sediment, and composting facility sludge from the same sites submits one dataset with `"matrix": ["soil", "sediment", "sludge"]`.

See [docs/topics.md](docs/topics.md) for the full topic taxonomy, sample matrix vocabulary, and `sample_context` examples.

## Topic Taxonomy

Contributions are tagged with topics from a controlled vocabulary. Each topic maps to [ISO 37101](https://www.iso.org/standard/61885.html) community sustainability issues and aligns with Data Commons baseline indicators. SDG codes are automatically assigned based on your topic selections.

| Topic | Description | Example Datasets |
|---|---|---|
| **land_environment** | Terrestrial substrates and environmental characterization | Soil surveys, sediment analysis, substrate testing |
| **water** | Water quality and hydrology | Water quality, streamflow, effluent |
| **biodiversity** | Species and ecosystem surveys | Species surveys, habitat mapping |
| **agriculture** | Crop and production data | Crop trials, production data |
| **coastal** | Shoreline and marine systems | Erosion rates, sea level, coral |
| **climate** | Weather, emissions, and energy | Temperature, rainfall, emissions |
| **forestry** | Forest and canopy systems | Canopy cover, native species |
| **food_safety** | Contamination and pathogen testing | Contamination testing, pathogens |
| **infrastructure** | Built systems and capacity | Water system capacity, energy |
| **demographics** | Population and governance data | Population, land ownership |
| **community_wellbeing** | Community quality of life and social determinant indicators | Quality of life surveys, food insecurity rates, social trust indices, economic stress |

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
