# Moku Districts

Mokunet recognizes 33 traditional Hawaiian moku (district) boundaries across 7 islands. Each moku has a compound ID in the format `{island}-{normalized-name}`.

**Note for contributors:** You do not need to specify moku IDs in your contribution metadata. When your data includes coordinates, the platform automatically assigns records to the correct moku districts. If you do know which districts your data covers, you can optionally include `moku_ids` in your `metadata.json`.

## Oʻahu (6 moku)

| Moku ID | Traditional Name |
|---|---|
| `oahu-koolauloa` | Koʻolauloa |
| `oahu-koolaupoko` | Koʻolaupoko |
| `oahu-kona` | Kona |
| `oahu-ewa` | ʻEwa |
| `oahu-waianae` | Waiʻanae |
| `oahu-waialua` | Waialua |

## Maui (12 moku)

| Moku ID | Traditional Name |
|---|---|
| `maui-kaanapali` | Kāʻanapali |
| `maui-wailuku` | Wailuku |
| `maui-hamakuapoko` | Hāmākuapoko |
| `maui-hamakualoa` | Hāmākualoa |
| `maui-koolau` | Koʻolau |
| `maui-hana` | Hāna |
| `maui-kipahulu` | Kīpahulu |
| `maui-kaupo` | Kaupō |
| `maui-kahikinui` | Kahikinui |
| `maui-honuaula` | Honuaʻula |
| `maui-kula` | Kula |
| `maui-pualikomohana` | Puaʻali Komohana |

## Hawaiʻi Island (6 moku)

| Moku ID | Traditional Name |
|---|---|
| `hawaii-kohala` | Kohala |
| `hawaii-hamakua` | Hāmākua |
| `hawaii-hilo` | Hilo |
| `hawaii-puna` | Puna |
| `hawaii-kau` | Kaʻū |
| `hawaii-kona` | Kona |

## Kauaʻi (5 moku)

| Moku ID | Traditional Name |
|---|---|
| `kauai-kona` | Kona |
| `kauai-puna` | Puna |
| `kauai-koolau` | Koʻolau |
| `kauai-halele-a` | Haleleʻa |
| `kauai-napali` | Nā Pali |

## Molokaʻi (2 moku)

| Moku ID | Traditional Name |
|---|---|
| `molokai-koolau` | Koʻolau |
| `molokai-kona` | Kona |

## Lānaʻi (1 moku)

| Moku ID | Traditional Name |
|---|---|
| `lanai-kona` | Kona |

## Niʻihau (1 moku)

| Moku ID | Traditional Name |
|---|---|
| `niihau-niihau` | Niʻihau |

**Note:** Niʻihau has `status: restricted` in the Mokunet system. Kahoʻolawe is excluded from the district system.

## Source

Moku boundaries are derived from the State of Hawaiʻi GIS datasets, stored in the `moku_districts` Supabase table. See the [Mokunet documentation](https://hawaii.mokunet.us/lahui/research-commons/districts) for an interactive map.
