# Mokunet Research Commons

Open, place-based research data for Hawai'i — contributed by university and community researchers, anchored to traditional moku districts, and queryable through the [HKA Natural Resource Management](https://huikoeaina.ainadesign.org) portal.

## What Is This?

This repository is how university and community researchers contribute place-based environmental, agricultural, and community data to Hawai'i's shared research commons. Contributed datasets become nodes in the [Mokunet](https://mokunet.us) provenance graph, linked to the 33 traditional moku districts, UN Sustainable Development Goals, and community sustainability objectives.

**Hui Koe Aina** ([huikoeaina.ainadesign.org](https://huikoeaina.ainadesign.org)) is the natural resource management portal where contributors and the public browse, query, and visualize this data on interactive maps. Governed under the UH Foundation, HKA provides the community entry point for University of Hawai'i and Hawai'i Pacific University research labs looking to de-silo their data.

**Contributions are:**
- Version-controlled with full Git provenance
- Validated automatically via GitHub Actions
- Reviewed by community maintainers before ingestion
- Publicly accessible as commons data (default)
- Anchored to the 33 traditional moku districts of Hawaiʻi

## Who Contributes?

Research labs across Hawai'i's university system and community organizations:

| Institution | Example Labs / Groups | Focus Areas |
|---|---|---|
| **UH Mānoa** | SSRI, CTAHR, SOEST, WRRC | Demographics, agriculture, coastal, water |
| **UH Hilo** | Tropical Conservation Biology & Environment | Forestry, biodiversity |
| **Hawai'i Pacific University** | Natural Sciences, Marine Science | Biodiversity, coastal |
| **Community organizations** | Watershed partnerships, conservation districts | Water, land environment |
| **State & federal agencies** | DLNR, DOH, USGS, NOAA, USFWS | Multi-topic |

Your research already has a place in the commons. Moku districts provide geographic anchoring without requiring you to learn the platform — just declare which districts your data covers.

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full step-by-step guide.

**Quick overview:**
1. [Register as a contributor](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml) (GitHub issue)
2. Fork this repository
3. Add your data to `contributions/{your-slug}/{dataset-slug}/`
4. Include a `metadata.json` (use [the template](templates/metadata-template.json))
5. Open a pull request — GitHub Actions validates automatically

If your lab already uses Git for code, the same workflow applies to data.

## Environmental Samples

Researchers collect a wide range of environmental samples — soil cores, water grabs, sediment profiles, sludge from treatment facilities, tissue biopsies, air quality readings. This commons does not attempt to define interfaces for each sample type. Instead, every contribution carries a standard metadata envelope that the platform can anchor geospatially without interpreting domain-specific contents.

**How this works in practice:**

- **Topics** identify the domain question your research addresses (e.g. `land_environment`, `water`, `coastal`). The platform uses topics for graph discovery and sustainability goal linkage.
- **`sample_context`** is an optional block in your `metadata.json` where you describe what was physically collected. Only the `matrix` field is controlled (`soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`); everything else is free-form for your research context.
- **Your CSV columns** are declared in `schema` and validated, but the platform stores them as-is. Data orchestration works through [H3 hexagonal cells](https://h3geo.org/) and moku district boundaries — not through sample-specific interpretation.

This means a single contribution can span multiple sample matrices under one topic. A land environment study collecting soil cores, stream sediment, and composting facility sludge from the same sites submits one dataset with `"matrix": ["soil", "sediment", "sludge"]`.

See [docs/topics.md](docs/topics.md) for the full topic taxonomy, sample matrix vocabulary, and `sample_context` examples.

## Topic Taxonomy

Contributions are tagged with topics from a controlled vocabulary. Each topic maps to [ISO 37101](https://www.iso.org/standard/61885.html) community sustainability issues and UN Sustainable Development Goals.

| Topic | ISO 37101 Issue | SDG Codes | Example Datasets |
|---|---|---|---|
| **land_environment** | Living environment | SDG 2, 15 | Soil surveys, sediment analysis, substrate testing |
| **water** | Living environment, Community infrastructure | SDG 6, 14 | Water quality, streamflow, effluent |
| **biodiversity** | Biodiversity & ecosystem services | SDG 14, 15 | Species surveys, habitat mapping |
| **agriculture** | Economy & production | SDG 2, 12 | Crop trials, production data |
| **coastal** | Safety & security, Biodiversity | SDG 13, 14 | Erosion rates, sea level, coral |
| **climate** | Community infrastructure | SDG 7, 13 | Temperature, rainfall, emissions |
| **forestry** | Biodiversity & ecosystem services | SDG 15 | Canopy cover, native species |
| **food_safety** | Health & care | SDG 2 | Contamination testing, pathogens |
| **infrastructure** | Community infrastructure | SDG 6, 7, 11 | Water system capacity, energy |
| **demographics** | Governance, empowerment | SDG 8, 11 | Population, land ownership |

## Moku Districts

The commons recognizes 33 traditional moku districts across 7 islands. See [docs/moku-districts.md](docs/moku-districts.md) for the full list with island groupings.

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

| Contributor | Dataset | Topics | Moku Coverage | Records |
|---|---|---|---|---|
| _example | [O'ahu Wetland NWI Sample](contributions/_example/) | water, biodiversity, coastal | All O'ahu | 50 |

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
