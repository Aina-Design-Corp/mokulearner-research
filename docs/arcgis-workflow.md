# ArcGIS Online Workflow for Hawai'i Research Data

This guide covers the end-to-end process of acquiring geospatial data from ArcGIS Online, transforming it for the Research Commons contribution format, and submitting it as a pull request.

For the general contribution workflow (registration, PR process, what happens after merge), see [CONTRIBUTING.md](../CONTRIBUTING.md). This document focuses specifically on the ArcGIS Online data acquisition path.

## Hawai'i ArcGIS Online Data Sources

These organizations publish Hawai'i geospatial data on ArcGIS Online. Start with the statewide geoportal for the broadest catalog, then check individual agency hubs for specialized datasets.

| Organization | Portal / Hub | Typical Data |
|---|---|---|
| Hawai'i Statewide GIS Program | `geoportal.hawaii.gov` | Parcels, zoning, administrative boundaries, infrastructure |
| Hawai'i DLNR | Search ArcGIS Online for `owner:DLNR*` | Watersheds, forest reserves, aquatic resources, conservation lands |
| Hawai'i DOH | `health.hawaii.gov` + ArcGIS Online | Water quality, contamination sites, environmental health |
| DBEDT | `dbedt.hawaii.gov` | Demographics, economic indicators, energy data |
| UH Manoa | Search ArcGIS Online for `owner:UHManoa*` | Varied research outputs (marine science, geography, agriculture) |
| NOAA Pacific Islands | ArcGIS Online search for `NOAA PIFSC` | Coral reef surveys, marine habitats, ocean chemistry |
| USGS Pacific Islands | ArcGIS Online search for `USGS Hawaii` | Ecosystems, geology, hydrology, volcanic hazards |
| USFWS | ArcGIS Online search for `USFWS` | Wetlands (NWI), endangered species habitat, refuges |

**Tip:** Many agencies publish through the statewide geoportal as well as their own hubs. Searching `geoportal.hawaii.gov` first often turns up data from multiple agencies in one place.

## Mapping ArcGIS Data to Repository Topics

Use this table to select the right [topic](topics.md) tags when you find an ArcGIS dataset. Most datasets map to one or two topics.

| ArcGIS Layer Theme | Repository Topic(s) | Notes |
|---|---|---|
| Parcels, land use, zoning, soil surveys | `land_environment` | Land use layers may need simplification |
| Watershed boundaries, stream gauges, groundwater | `water`, `land_environment` | |
| Coral reef surveys, marine habitats | `coastal`, `biodiversity` | |
| Shoreline erosion, sea level rise, coastal inundation | `coastal`, `climate` | |
| Forest reserves, native species, canopy cover | `forestry`, `biodiversity` | |
| Crop data, ag land use, irrigation | `agriculture` | |
| Census tracts, population, housing | `demographics` | May need coordinate enrichment |
| Employment, income, land ownership | `demographics` | |
| Water systems, energy grid, roads, broadband | `infrastructure` | |
| Drinking water quality, wastewater | `water`, `infrastructure` | |
| Environmental health sites, contamination | `food_safety`, `land_environment` | |
| Temperature, rainfall, emissions, energy output | `climate` | |
| Community health, food insecurity | `community_wellbeing` | |

See [topics.md](topics.md) for full scope definitions and SDG mappings.

## Step-by-Step Workflow

### Step 1: Discover Data on ArcGIS Online

Search for Hawai'i datasets at `www.arcgis.com/home/search.html` or through `geoportal.hawaii.gov`.

**Useful search filters:**
- **Type:** Feature Service or Map Service (these are queryable; static PDFs and images are not)
- **Owner:** Filter by agency (e.g., `owner:DLNR_Hawaii`)
- **Extent:** Zoom to the Hawaiian Islands to filter by geographic extent
- **Keywords:** Use domain terms like "watershed", "coral", "water quality", "census"

### Step 2: Evaluate a Feature Service

Open the item page for a dataset and check these details before downloading:

| Check | Where to find it | Why it matters |
|---|---|---|
| Spatial reference | Item details or REST endpoint | Must be convertible to WGS84 (EPSG:4326) |
| Field list | REST endpoint → Fields section | Determines your `schema` mapping |
| Record count | REST endpoint or item description | Large datasets (>10k features) need pagination or GUI export |
| Update frequency | Item description | Affects your `temporal_coverage` dates |
| License / Terms of Use | Item page bottom section | Determines your `license` field |
| Geographic extent | Map preview on item page | Should cover Hawai'i (lat 18-23, lng -161 to -154) |

**Finding the REST endpoint:** On the item page, look for a "URL" link in the item details, or click "View" to open the service and find the REST Services Directory link.

### Step 3: Download Data (GeoJSON or CSV)

**GUI method (recommended for most cases):**
1. On the item page, click "Download" or "Export Data"
2. Select **GeoJSON** for spatial data or **CSV** for tabular data
3. GeoJSON exports from ArcGIS Online are always in WGS84, which matches the repository's coordinate expectations

**REST API method (for filtering or automation):**
See the [Programmatic Access](#programmatic-access-via-arcgis-rest-api) section below.

### Step 4: Transform for Contribution

ArcGIS exports need adjustments before they fit the repository format.

**Field naming:**
- ArcGIS uses CamelCase or UPPERCASE field names (e.g., `WETLAND_TYPE`, `Acres`, `GlobalID`)
- The repository convention is lowercase with underscores (e.g., `wetland_type`, `acres`)
- Rename fields in your CSV headers or GeoJSON properties

**Remove system fields:**
These ArcGIS internal fields have no research value — delete them:
`OBJECTID`, `GlobalID`, `FID`, `Shape__Area`, `Shape__Length`, `CreationDate`, `Creator`, `EditDate`, `Editor`

**Coordinate handling:**
- **GeoJSON:** Coordinates are in the geometry; the platform reads them directly
- **CSV:** Ensure `latitude` and `longitude` columns are present in WGS84 decimal degrees. If converting from GeoJSON polygons, compute centroids or representative points

**Date conversion:**
ArcGIS REST API returns dates as Unix timestamps (milliseconds since epoch). Convert to ISO 8601 format (`YYYY-MM-DD`) for columns you declare as `"date"` type in the schema.

**Filter to relevant subset:**
Large statewide layers may contain thousands of features. Filter to the geographic area or thematic subset relevant to your contribution. This keeps file sizes manageable and the contribution focused.

### Step 5: Create metadata.json

Start from the [metadata template](../templates/metadata-template.json) and fill in each field.

**Key decisions for ArcGIS-sourced data:**

| Field | Guidance for ArcGIS data |
|---|---|
| `topics` | Use the [mapping table](#mapping-arcgis-data-to-repository-topics) above |
| `quality` | Government agency data is typically `verified` (QA'd by agency). Published reports: `peer_reviewed`. Raw downloads without agency QA documentation: `preliminary`. See [quality-levels.md](quality-levels.md) |
| `license` | Check the item page "Terms of Use". Federal agencies (USGS, NOAA, USFWS): use `CC0`. State of Hawai'i data: check terms, typically `CC-BY-4.0` with attribution. If unclear, use `CC-BY-4.0` and note the source in `citation` |
| `citation` | Use the Credits/Source field from the ArcGIS item page |
| `schema` | Map each retained column to `string`, `number`, `date`, or `boolean` |
| `required_fields` | At minimum include your identifier and coordinate columns (e.g., `["site_id", "latitude", "longitude"]`) |
| `coverage` | Required if your data lacks coordinate columns. Describe the geographic scope (e.g., "Windward O'ahu watersheds") |
| `temporal_coverage` | Use the date range from the item page or layer description |

### Step 6: Validate and Submit

Run the local validation script before opening a PR:

```bash
CHANGED_DIRS="your-slug/dataset-slug" node scripts/validate-pr.mjs
```

Fix any errors (schema violations, missing fields, coordinates out of bounds). Then follow the PR process in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Programmatic Access via ArcGIS REST API

For automation, filtering, or working with large datasets, you can query ArcGIS feature services directly via their REST API.

### Feature Service URL Anatomy

ArcGIS feature services follow this URL pattern:

```
https://services.arcgis.com/{orgId}/arcgis/rest/services/{serviceName}/FeatureServer/{layerIndex}
```

- `{orgId}` — The ArcGIS Online organization ID (a hex string)
- `{serviceName}` — The service name
- `{layerIndex}` — Layer number (usually `0` for single-layer services)

Find this URL on the item page under "URL" in the item details, or by opening the REST Services Directory.

### Query Endpoint

Append `/query` to the layer URL and pass parameters:

```
https://services.arcgis.com/{orgId}/arcgis/rest/services/{name}/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&returnGeometry=true
```

**Essential parameters:**

| Parameter | Value | Purpose |
|---|---|---|
| `where` | `1=1` (all) or a filter like `Island='Oahu'` | Select which records to return |
| `outFields` | `*` or comma-separated field names | Which columns to include |
| `outSR` | `4326` | Force WGS84 output (critical) |
| `f` | `geojson` or `csv` | Output format |
| `returnGeometry` | `true` | Include spatial coordinates |

### Pagination for Large Datasets

ArcGIS Online limits results per request (typically 1000-2000 features). Check the `maxRecordCount` by querying the layer URL (without `/query`) and looking at the JSON response.

To page through all records, use `resultOffset` and `resultRecordCount`:

1. First request: `&resultOffset=0&resultRecordCount=1000`
2. Check the response for `"exceededTransferLimit": true`
3. Next request: `&resultOffset=1000&resultRecordCount=1000`
4. Repeat until `exceededTransferLimit` is `false` or absent

For very large datasets, consider using the GUI "Export Data" button instead, which handles pagination internally.

## Common Pitfalls

**Coordinate system mismatch:** ArcGIS services may use Hawai'i State Plane (EPSG:2783/2784) or UTM Zone 4N (EPSG:32604). Always use `outSR=4326` in REST queries. GUI GeoJSON exports auto-convert to WGS84, but CSV exports may not. Symptom: the validation script flags coordinates outside lat 18-23, lng -161 to -154.

**Field naming conventions:** ArcGIS field names are UPPERCASE or CamelCase. The repository expects lowercase_underscore. Rename all field names before contributing.

**Truncated data from pagination:** If you query a large service and get exactly 1000 or 2000 records, you probably hit the `maxRecordCount` limit. Always check `exceededTransferLimit` in the response.

**System fields left in data:** `OBJECTID`, `GlobalID`, `Shape__Area`, `Shape__Length`, and similar ArcGIS internal fields should be removed. They add noise and have no research value.

**Date format:** ArcGIS returns dates as Unix timestamps in milliseconds (e.g., `1672531200000`). The repository expects ISO 8601 strings (`2023-01-01`) for `date`-typed columns.

**Null handling:** ArcGIS uses `null` in JSON but empty strings in CSV. The validation script treats empty strings as null for `required_fields` checks, so both formats work — but be aware of the difference if debugging validation errors.

**License ambiguity:** Some ArcGIS items lack explicit license declarations:
- U.S. federal agencies (USGS, NOAA, USFWS): public domain, use `CC0`
- State of Hawai'i agencies: check the item's "Terms of Use". Most state data is public — use `CC0` or `CC-BY-4.0` with attribution
- University research: check with the publishing lab; often `CC-BY-4.0`

**Large polygon files:** Very large GeoJSON files with complex polygon geometries may exceed GitHub's file size recommendations. Filter to relevant subsets or simplify geometries.

## Worked Example

This example walks through downloading a hypothetical DLNR aquatic biosurvey layer and preparing it as a contribution.

### 1. Find the Feature Service

Search ArcGIS Online for "DLNR aquatic biosurvey Hawaii". Open the item page and locate the REST endpoint URL:

```
https://services.arcgis.com/AbCdEf123/arcgis/rest/services/DAR_Aquatic_Biosurvey/FeatureServer/0
```

### 2. Query a Subset

Download O'ahu records as GeoJSON:

```
.../FeatureServer/0/query?where=Island%3D'Oahu'&outFields=STATION_ID,LATITUDE,LONGITUDE,SURVEY_DATE,SPECIES_COUNT,STREAM_NAME,ISLAND&outSR=4326&f=geojson
```

### 3. Transform the Data

**Original ArcGIS field names → Renamed fields:**

| ArcGIS Field | Renamed Field | Type |
|---|---|---|
| `STATION_ID` | `station_id` | string |
| `LATITUDE` | `latitude` | number |
| `LONGITUDE` | `longitude` | number |
| `SURVEY_DATE` | `survey_date` | date |
| `SPECIES_COUNT` | `species_count` | number |
| `STREAM_NAME` | `stream_name` | string |
| `ISLAND` | `island` | string |

**Removed:** `OBJECTID`, `GlobalID`, `Shape__Area`

**Date conversion:** `1672531200000` → `2023-01-01`

### 4. Create metadata.json

```json
{
  "contributor": "your-slug",
  "datasets": [
    {
      "file": "oahu-aquatic-biosurvey.csv",
      "title": "DAR Aquatic Biosurvey — O'ahu Streams 2019-2024",
      "description": "Stream biosurvey station data from the DLNR Division of Aquatic Resources, filtered to O'ahu. Includes species counts per station.",
      "license": "CC-BY-4.0",
      "citation": "Hawai'i DLNR Division of Aquatic Resources. DAR Aquatic Biosurvey. ArcGIS Online.",
      "topics": ["water", "biodiversity"],
      "quality": "verified",
      "coverage": "Stream survey stations across all six moku districts of O'ahu",
      "temporal_coverage": {
        "start": "2019-01-01",
        "end": "2024-12-31"
      },
      "schema": {
        "station_id": "string",
        "latitude": "number",
        "longitude": "number",
        "survey_date": "date",
        "species_count": "number",
        "stream_name": "string",
        "island": "string"
      },
      "required_fields": ["station_id", "latitude", "longitude", "species_count"]
    }
  ]
}
```

**Topic selection rationale:** `water` (stream survey, hydrological context) + `biodiversity` (species counts). See the [mapping table](#mapping-arcgis-data-to-repository-topics).

**Quality rationale:** `verified` — DLNR data is collected using standardized field protocols and QA'd by the agency before publication.

**License rationale:** `CC-BY-4.0` — State of Hawai'i data with no explicit CC0 declaration; attribution to DLNR is appropriate.

### 5. Validate

```bash
CHANGED_DIRS="your-slug/oahu-aquatic-biosurvey" node scripts/validate-pr.mjs
```

## Additional Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) — Full contribution workflow (registration, PR process, post-merge)
- [topics.md](topics.md) — Topic definitions, SDG mappings, sample_context vocabulary
- [moku-districts.md](moku-districts.md) — All 33 moku district IDs
- [quality-levels.md](quality-levels.md) — Quality level definitions and selection guidance
- [Metadata template](../templates/metadata-template.json) — Starting point for metadata.json
- [Example contribution](../contributions/_example/oahu-wetland-nwi/) — Complete working example (NWI wetland data)
- [Metadata schema](../schemas/metadata.schema.json) — Formal JSON Schema for validation
