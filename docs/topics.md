# Research Topic Taxonomy

Contributions to the Mokunet Research Commons are tagged with **topics** from a controlled vocabulary. Topics represent domain questions — the kind of environmental or community issue a dataset addresses — not the physical sample media collected.

Each topic maps to ISO 37101 community sustainability issues and UN Sustainable Development Goals, enabling automatic linkage to governance frameworks.

## Topics vs. Sample Matrix

**Topics** are for graph discovery: "What domain question does this dataset address?"

**Sample matrix** (via `sample_context`) describes what was physically collected: soil, water, sediment, sludge, tissue, air, or mixed. A single contribution can involve multiple sample matrices under one topic. For example, a land environment study might collect soil cores, sediment, and sludge from the same sites.

Mokunet orchestrates research inputs through H3 cells and moku district contexts. It does not interpret sample-specific fields — that's the researcher's domain.

## Topics

### land_environment
- **ISO 37101 Issue:** Living environment
- **SDG Codes:** SDG 2 (Zero Hunger), SDG 15 (Life on Land)
- **Mokunet Pillar:** Land Ecosystems
- **Scope:** Environmental characterization of terrestrial substrates — soil surveys, sediment analysis, substrate testing, sludge assessment, nutrient profiles, contamination screening
- **Example datasets:** Soil nutrient profiles, sediment core analysis, organic matter measurements, pH testing, heavy metal screening, composting facility outputs

### water
- **ISO 37101 Issue:** Living environment, Community infrastructure
- **SDG Codes:** SDG 6 (Clean Water), SDG 14 (Life Below Water)
- **Mokunet Pillar:** Water Resources
- **Scope:** Water quality and hydrology across surface water, groundwater, effluent, and receiving waters
- **Example datasets:** Water quality monitoring, streamflow measurements, groundwater levels, turbidity, dissolved oxygen, wastewater effluent analysis

### biodiversity
- **ISO 37101 Issue:** Biodiversity & ecosystem services
- **SDG Codes:** SDG 14 (Life Below Water), SDG 15 (Life on Land)
- **Mokunet Pillar:** Land Ecosystems
- **Example datasets:** Species surveys, habitat mapping, native plant inventories, wildlife counts, wetland classification

### agriculture
- **ISO 37101 Issue:** Economy & production
- **SDG Codes:** SDG 2 (Zero Hunger), SDG 12 (Responsible Consumption)
- **Mokunet Pillar:** Food Systems
- **Example datasets:** Crop trials, production data, pest surveys, irrigation records

### coastal
- **ISO 37101 Issue:** Safety & security, Biodiversity & ecosystem services
- **SDG Codes:** SDG 13 (Climate Action), SDG 14 (Life Below Water)
- **Mokunet Pillar:** Climate Action
- **Example datasets:** Shoreline erosion rates, sea level measurements, coral reef surveys, coastal inundation

### climate
- **ISO 37101 Issue:** Community infrastructure
- **SDG Codes:** SDG 7 (Affordable Energy), SDG 13 (Climate Action)
- **Mokunet Pillar:** Climate Action
- **Example datasets:** Temperature records, rainfall data, greenhouse gas emissions, renewable energy output

### forestry
- **ISO 37101 Issue:** Biodiversity & ecosystem services
- **SDG Codes:** SDG 15 (Life on Land)
- **Mokunet Pillar:** Land Ecosystems
- **Example datasets:** Canopy cover analysis, native species restoration, timber inventory, fire risk assessment

### food_safety
- **ISO 37101 Issue:** Health & care
- **SDG Codes:** SDG 2 (Zero Hunger)
- **Mokunet Pillar:** Food Systems
- **Example datasets:** Contamination testing, pathogen screening, pesticide residue analysis

### infrastructure
- **ISO 37101 Issue:** Community infrastructure
- **SDG Codes:** SDG 6 (Clean Water), SDG 7 (Affordable Energy), SDG 11 (Sustainable Cities)
- **Mokunet Pillar:** Sustainable Communities
- **Example datasets:** Water system capacity, energy grid data, transportation access, broadband coverage

### demographics
- **ISO 37101 Issue:** Governance, empowerment
- **SDG Codes:** SDG 8 (Decent Work), SDG 11 (Sustainable Cities)
- **Mokunet Pillar:** Economic Development
- **Example datasets:** Population counts, land ownership records, employment data, housing statistics

## Sample Context (Optional)

Any contribution involving environmental samples can include a `sample_context` block in its metadata.json. This is a standard JSON container that travels with the contribution — Mokunet stores it but does not validate fields beyond the `matrix` vocabulary.

### Controlled `matrix` values

| Matrix | Description |
|---|---|
| `soil` | Soil cores, topsoil, subsoil |
| `water` | Surface water, groundwater, effluent, receiving water |
| `sediment` | Stream bed, lake bed, marine sediment |
| `air` | Ambient air, emissions, particulates |
| `tissue` | Plant or animal tissue samples |
| `sludge` | Wastewater treatment sludge, biosolids, dredge material |
| `mixed` | Multiple matrices from the same collection event |

### Example `sample_context`

```json
{
  "sample_context": {
    "matrix": ["soil", "sediment"],
    "collection_method": "grab sample",
    "depth_m": 0.3,
    "equipment": "Ekman dredge",
    "lab_id": "UH-SOEST-2026-042",
    "analysis_methods": ["EPA 200.8", "SM 2540D"]
  }
}
```

All fields beyond `matrix` are free-form. Common optional fields include `collection_method`, `depth_m`, `equipment`, `lab_id`, `analysis_methods`, `preservation`, and `holding_time_days`.

## Adding New Topics

The topic vocabulary is extensible. If your research doesn't fit an existing topic, open a [GitHub issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues) to propose a new one. Include the proposed ISO 37101 issue and SDG code mappings.
