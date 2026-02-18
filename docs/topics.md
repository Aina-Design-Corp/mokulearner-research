# Research Topic Taxonomy

Contributions to the Mokunet Research Commons are tagged with **topics** from a controlled vocabulary. Topics represent domain questions — the kind of environmental or community issue a dataset addresses — not the physical sample media collected.

Each topic maps to ISO 37101 community sustainability issues and UN Sustainable Development Goals. **You don't need to specify SDG codes** — they are automatically assigned based on your topic selections when your contribution is ingested into the platform.

## Topics vs. Sample Matrix

**Topics** are for graph discovery: "What domain question does this dataset address?"

**Sample matrix** (via `sample_context`) describes what was physically collected: soil, water, sediment, sludge, tissue, air, or mixed. A single contribution can involve multiple sample matrices under one topic. For example, a land environment study might collect soil cores, sediment, and sludge from the same sites.

Mokunet orchestrates research inputs through H3 cells and moku district contexts. It does not interpret sample-specific fields — that's the researcher's domain.

## Topics

### land_environment
- **Scope:** Environmental characterization of terrestrial substrates — soil surveys, sediment analysis, substrate testing, sludge assessment, nutrient profiles, contamination screening
- **Example datasets:** Soil nutrient profiles, sediment core analysis, organic matter measurements, pH testing, heavy metal screening, composting facility outputs

### water
- **Scope:** Water quality and hydrology across surface water, groundwater, effluent, and receiving waters
- **Example datasets:** Water quality monitoring, streamflow measurements, groundwater levels, turbidity, dissolved oxygen, wastewater effluent analysis

### biodiversity
- **Example datasets:** Species surveys, habitat mapping, native plant inventories, wildlife counts, wetland classification

### agriculture
- **Example datasets:** Crop trials, production data, pest surveys, irrigation records

### coastal
- **Example datasets:** Shoreline erosion rates, sea level measurements, coral reef surveys, coastal inundation

### climate
- **Example datasets:** Temperature records, rainfall data, greenhouse gas emissions, renewable energy output

### forestry
- **Example datasets:** Canopy cover analysis, native species restoration, timber inventory, fire risk assessment

### food_safety
- **Example datasets:** Contamination testing, pathogen screening, pesticide residue analysis

### infrastructure
- **Example datasets:** Water system capacity, energy grid data, transportation access, broadband coverage

### demographics
- **Example datasets:** Population counts, land ownership records, employment data, housing statistics

## Platform-Assigned Linkage

The platform automatically maps each topic to ISO 37101 community sustainability issues and UN Sustainable Development Goals. Contributors do not need to specify these — they are derived from topic selections during ingestion.

| Topic | ISO 37101 Issue | SDG Codes |
|---|---|---|
| land_environment | Living environment | SDG 2, 15 |
| water | Living environment, Community infrastructure | SDG 6, 14 |
| biodiversity | Biodiversity & ecosystem services | SDG 14, 15 |
| agriculture | Economy & production | SDG 2, 12 |
| coastal | Safety & security, Biodiversity | SDG 13, 14 |
| climate | Community infrastructure | SDG 7, 13 |
| forestry | Biodiversity & ecosystem services | SDG 15 |
| food_safety | Health & care | SDG 2 |
| infrastructure | Community infrastructure | SDG 6, 7, 11 |
| demographics | Governance, empowerment | SDG 8, 11 |

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

The topic vocabulary is extensible. If your research doesn't fit an existing topic, open a [GitHub issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues) to propose a new one.
