# Mokunet Research Commons

Open research data for Hawai'i — contributed by university and community researchers, queryable through the [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) portal.

## What Is This?

This repository is how university and community researchers contribute environmental, agricultural, and community data to Hawai'i's shared research commons. Contributed datasets become nodes in the [Mokunet](https://mokunet.us) provenance graph, linked to research topics and community sustainability objectives.

When your data includes coordinates, the platform automatically assigns it to the appropriate traditional moku districts and [H3 hexagonal cells](https://h3geo.org/). When it doesn't, a simple text description of geographic scope is all that's needed.

**Hui Koe Aina** ([huikoeaina.ainadesign.org](https://huikoeaina.ainadesign.org)) is the natural resource management portal where contributors and the public browse, query, and visualize this data on interactive maps. Governed under the UH Foundation, HKA provides the community entry point for University of Hawai'i and Hawai'i Pacific University research labs looking to de-silo their data.

**Contributions are:**
- Version-controlled with full Git provenance
- Validated automatically via GitHub Actions
- Reviewed by community maintainers before ingestion
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

Your research already has a place in the commons. Just bring your data — the platform handles geographic anchoring and sustainability goal linkage automatically.

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full step-by-step guide.

**Quick overview:**
1. [Register as a contributor](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml) (GitHub issue)
2. Fork this repository
3. Add your data to `contributions/{your-slug}/{dataset-slug}/`
4. Include a `metadata.json` (use [the template](templates/metadata-template.json))
5. Open a pull request — GitHub Actions validates automatically

If your lab already uses Git for code, the same workflow applies to data.

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

## Environmental Samples

Researchers collect a wide range of environmental samples — soil cores, water grabs, sediment profiles, sludge from treatment facilities, tissue biopsies, air quality readings. This commons does not attempt to define interfaces for each sample type. Instead, every contribution carries a standard metadata envelope that the platform can work with.

**How this works in practice:**

- **Topics** identify the domain question your research addresses (e.g. `land_environment`, `water`, `coastal`). The platform uses topics for graph discovery and automatically links to sustainability goals.
- **`sample_context`** is an optional block in your `metadata.json` where you describe what was physically collected. Only the `matrix` field is controlled (`soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`); everything else is free-form for your research context.
- **Your CSV columns** are declared in `schema` and validated, but the platform stores them as-is.

This means a single contribution can span multiple sample matrices under one topic. A land environment study collecting soil cores, stream sediment, and composting facility sludge from the same sites submits one dataset with `"matrix": ["soil", "sediment", "sludge"]`.

See [docs/topics.md](docs/topics.md) for the full topic taxonomy, sample matrix vocabulary, and `sample_context` examples.

## Topic Taxonomy

Contributions are tagged with topics from a controlled vocabulary. Each topic maps to [ISO 37101](https://www.iso.org/standard/61885.html) community sustainability issues. SDG codes are automatically assigned based on your topic selections.

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
- [Mokunet Platform](https://mokunet.us) — API backend and data pipeline
- [Contribute Data](https://huikoeaina.ainadesign.org/contribute) — Prepare a contribution through HKA
- [Metadata Schema Reference](schemas/metadata.schema.json)

## License

This repository is licensed under [CC-BY-4.0](LICENSE). Individual contributions may use different compatible open licenses as declared in their metadata.json files.
