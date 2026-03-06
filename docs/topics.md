# Research Topic Taxonomy

Contributions to the Mokunet Research Commons are tagged with **topics** from a controlled vocabulary. Topics represent domain questions — the kind of environmental or community issue a dataset addresses — not the physical sample media collected.

Each topic maps to ISO 37101 community sustainability issues and UN Sustainable Development Goals. **You don't need to specify SDG codes** — they are automatically assigned based on your topic selections when your contribution is ingested into the platform.

## Contribution Types

Every dataset declares a **contribution_type** that determines how it integrates with the spatial governance graph:

| Type | Purpose | SDG Path | Key Fields |
|---|---|---|---|
| `observation` | Geocoded environmental samples that populate the measurement layer | Graph-grounded: creates `MEASURES_SDG` edges via `ResearchRecord -> OBSERVED_AT -> Zone -> ZoneCell -> Moku` | Requires `sample_context` with matrix |
| `indicator` | Sub-county statistical data that refines county-level baselines at the moku level | Graph-grounded at ingestion: `MEASURES_SDG` + `REFINES_BASELINE` edges | Requires `baseline_context` with supplements; requires coordinates or `moku_ids` |
| `spatial_overlay` | GIS layers that enhance zone coverage (wetlands, land use, parcels) | Enhances backbone zones (no direct SDG edge) | GeoJSON format typical |

### Choosing Your Type

- If you collected physical samples (water, soil, air, tissue) at specific sites, use **observation**
- If your data is tabular indicators (unemployment, food insecurity, population, housing) that could refine the county-level federal statistics shown on the Island Baselines page, use **indicator**
- If your data is a spatial layer (shapefiles, polygon boundaries, land classification) that enhances zone coverage, use **spatial_overlay**

## Topics vs. Sample Matrix

**Topics** are for graph discovery: "What domain question does this dataset address?"

**Sample matrix** (via `sample_context`) describes what was physically collected: soil, water, sediment, sludge, tissue, air, or mixed. A single contribution can involve multiple sample matrices under one topic. For example, a land environment study might collect soil cores, sediment, and sludge from the same sites.

Mokunet orchestrates research inputs through H3 cells and moku district contexts. It does not interpret sample-specific fields — that's the researcher's domain.

## Environmental Research Topics

These topics describe environmental observation data — geocoded samples and field measurements. Contributions typically use `contribution_type: "observation"` with a `sample_context` block.

### land_environment
- **Scope:** Environmental characterization of terrestrial substrates — soil surveys, sediment analysis, substrate testing, sludge assessment, nutrient profiles, contamination screening
- **Example datasets:** Soil nutrient profiles, sediment core analysis, organic matter measurements, pH testing, heavy metal screening, composting facility outputs

### water
- **Scope:** Water quality and hydrology across surface water, groundwater, effluent, and receiving waters
- **Example datasets:** Water quality monitoring, streamflow measurements, groundwater levels, turbidity, dissolved oxygen, wastewater effluent analysis

### biodiversity
- **Example datasets:** Species surveys, habitat mapping, native plant inventories, wildlife counts, wetland classification

### coastal
- **Example datasets:** Shoreline erosion rates, sea level measurements, coral reef surveys, coastal inundation

### forestry
- **Example datasets:** Canopy cover analysis, native species restoration, timber inventory, fire risk assessment

### food_safety
- **Example datasets:** Contamination testing, pathogen screening, pesticide residue analysis

## Community Indicator Topics

These topics describe statistical or survey data that can refine county-level federal baselines at the moku level. Contributions typically use `contribution_type: "indicator"` with a `baseline_context` block declaring which Data Commons variables they supplement.

### demographics
- **Scope:** Population, land ownership, employment, housing at sub-county resolution
- **Example datasets:** Population counts by neighborhood, land ownership records by ahupua'a, employment data by census tract, housing statistics by moku
- **Baseline refinement:** Directly refines county-level ACS/Census variables (e.g., `Count_Person`, `Median_Income_Household`, `UnemploymentRate_Person`)

### community_wellbeing
- **Scope:** Community quality of life surveys, social determinant indicators, wellbeing assessments, disaster preparedness, social cohesion, and economic stress data at community, county, or neighborhood resolution
- **Example datasets:** Quality of life surveys, food insecurity rates, mental health day counts, social trust indices, disaster preparedness assessments, outmigration intent surveys, economic stress indicators
- **Baseline refinement:** Supplements county-level poverty, income, and population indicators with social determinant context

### infrastructure
- **Scope:** Water system capacity, energy grid data, transportation access, broadband coverage at sub-county resolution
- **Example datasets:** Water system capacity by service area, energy grid data by substation zone, transportation access by community, broadband coverage by neighborhood
- **Baseline refinement:** Supplements county-level housing, population, and unemployment indicators with infrastructure access data

## Cross-Domain Topics

These topics may use either contribution type depending on whether the data represents field observations or statistical indicators.

### agriculture
- **As observation:** Crop trials, pest surveys, irrigation measurements at specific sites
- **As indicator:** Production data, farm counts, agricultural employment at sub-county resolution
- **Example datasets (observation):** Soil nutrient profiles for crop plots, pest survey transects
- **Example datasets (indicator):** Farm production by ahupua'a, agricultural employment by moku

### climate
- **As observation:** Temperature sensors, rainfall gauges, air quality monitoring stations
- **As indicator:** Renewable energy output by district, GHG emissions by sector at sub-county resolution
- **Example datasets (observation):** Weather station data, ambient air monitoring
- **Example datasets (indicator):** Solar generation by community, flood event frequency by moku

## Platform-Assigned Linkage

The platform automatically maps each topic to ISO 37101 community sustainability issues, UN Sustainable Development Goals, and [Data Commons](https://datacommons.org/) baseline variables. Contributors do not need to specify these — they are derived from topic selections during ingestion.

For **observation** contributions, SDG alignment is graph-grounded: geocoded records are assigned to moku districts via H3 zone cells, then linked to SDGGoal nodes through `MEASURES_SDG` edges. This is the only SDG alignment in the platform backed by graph relationships.

For **indicator** contributions, the platform also creates `MEASURES_SDG` edges at ingestion, plus `REFINES_BASELINE` edges that explicitly track which county-level Data Commons variables the contribution supplements. This is what enables the Island Baselines page to show when moku-level data is available.

County-level baselines from Data Commons provide the federal reference point. Your local research refines these baselines at the moku level — the platform automatically identifies which indicators your contribution supplements.

| Topic | Contribution Type | ISO 37101 Issue | SDG Codes | Data Commons Baselines Refined |
|---|---|---|---|---|
| land_environment | observation | Living environment | SDG 2, 15 | Median household income, poverty rate |
| water | observation | Living environment, Community infrastructure | SDG 6, 14 | Population, housing units |
| biodiversity | observation | Biodiversity & ecosystem services | SDG 14, 15 | Population density |
| coastal | observation | Safety & security, Biodiversity | SDG 13, 14 | Population, housing units |
| forestry | observation | Biodiversity & ecosystem services | SDG 15 | Population density |
| food_safety | observation | Health & care | SDG 2 | Poverty rate, median household income |
| agriculture | observation or indicator | Economy & production | SDG 2, 12 | Median household income, unemployment rate |
| climate | observation or indicator | Community infrastructure | SDG 7, 13 | Population, median household income |
| infrastructure | indicator | Community infrastructure | SDG 6, 7, 11 | Housing units, population, unemployment rate |
| demographics | indicator | Governance, empowerment | SDG 8, 11 | All 16 county-level variables |
| community_wellbeing | indicator | Health & care | SDG 8, 11 | Population, median household income, poverty rate |

## Sample Context (for Observation Contributions)

Contributions with `contribution_type: "observation"` must include a `sample_context` block in their metadata.json. This is a standard JSON container that travels with the contribution — Mokunet stores it but does not validate fields beyond the `matrix` vocabulary.

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

## Baseline Context (for Indicator Contributions)

Contributions with `contribution_type: "indicator"` should include a `baseline_context` block declaring which county-level variables the dataset supplements. This enables the platform to create `REFINES_BASELINE` edges and flag moku-level data availability on the Island Baselines page.

### Example `baseline_context`

```json
{
  "baseline_context": {
    "supplements": ["UnemploymentRate_Person", "Median_Income_Household"],
    "resolution_gain": "moku-level",
    "comparison_method": "direct comparison"
  }
}
```

- **supplements** (required): Array of Data Commons variable DCIDs from the [pillar catalog](https://mokunet.us/place-types). Common variables: `Count_Farm`, `Area_Farm`, `Mean_Rainfall`, `UnemploymentRate_Person`, `Median_Income_Household`, `Count_Person_BelowPovertyLevelInThePast12Months`, `Count_Person`, `Count_FloodEvent`.
- **resolution_gain**: How this dataset improves on county resolution (e.g., "moku-level", "neighborhood-level", "census-tract").
- **comparison_method**: How contributed values relate to the county baseline (e.g., "direct comparison", "proxy indicator", "complementary measure").

## Adding New Topics

The topic vocabulary is extensible. If your research doesn't fit an existing topic, open a [GitHub issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues) to propose a new one.
