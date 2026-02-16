# Mokunet Research Commons

Public, transparent research data contributions to the [Mokunet](https://mokunet.us) provenance graph — anchored to traditional Hawaiian moku districts, linked to sustainability goals, and openly queryable.

## What Is This?

This repository is the contribution interface for external research groups to share place-based environmental, agricultural, and community data with the Mokunet platform. Contributed datasets become nodes in the Mokunet provenance graph (AuraDB/Neo4j), linked to moku districts, UN Sustainable Development Goals, and community sustainability objectives.

**Contributions are:**
- Version-controlled with full Git provenance
- Validated automatically via GitHub Actions
- Reviewed by Mokunet administrators before ingestion
- Publicly accessible as commons data (default)
- Anchored to the 33 traditional moku districts of Hawaiʻi

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full step-by-step guide.

**Quick overview:**
1. [Register as a contributor](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml) (GitHub issue)
2. Fork this repository
3. Add your data to `contributions/{your-slug}/{dataset-slug}/`
4. Include a `metadata.json` (use [the template](templates/metadata-template.json))
5. Open a pull request

## Environmental Samples

Researchers collect a wide range of environmental samples — soil cores, water grabs, sediment profiles, sludge from treatment facilities, tissue biopsies, air quality readings. Mokunet does not attempt to define interfaces for each sample type. Instead, every contribution carries a standard metadata envelope that the platform can anchor geospatially without interpreting the domain-specific contents.

**How this works in practice:**

- **Topics** identify the domain question your research addresses (e.g. `land_environment`, `water`, `coastal`). Mokunet uses topics for graph discovery and sustainability goal linkage.
- **`sample_context`** is an optional block in your `metadata.json` where you describe what was physically collected. Only the `matrix` field is controlled (`soil`, `water`, `sediment`, `air`, `tissue`, `sludge`, `mixed`); everything else is free-form for your research context.
- **Your CSV columns** are declared in `schema` and validated, but Mokunet stores them as-is. The platform orchestrates research inputs through [H3 hexagonal cells](https://h3geo.org/) and moku district boundaries — not through sample-specific interpretation.

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

Mokunet recognizes 33 traditional moku districts across 7 islands. See [docs/moku-districts.md](docs/moku-districts.md) for the full list with island groupings.

## Quality Levels

| Level | Meaning | Review |
|---|---|---|
| **preliminary** | Raw field data, not yet QA'd | Admin spot-check |
| **verified** | QA'd by contributor, methods documented | Admin review |
| **peer_reviewed** | Published or reviewed by external party | Fast-track |

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

- [Mokunet Platform](https://mokunet.us)
- [Research Commons Console](https://mokunet.us/lahui/research-commons)
- [Contribute Data Form](https://mokunet.us/lahui/contribute)
- [Metadata Schema Reference](schemas/metadata.schema.json)

## License

This repository is licensed under [CC-BY-4.0](LICENSE). Individual contributions may use different compatible open licenses as declared in their metadata.json files.
