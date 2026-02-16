# Moku Districts

Mokunet recognizes 33 traditional Hawaiian moku (district) boundaries across 7 islands. Each moku has a compound ID in the format `{island}-{normalized-name}`.

## O'ahu (6 moku)

| Moku ID | Traditional Name |
|---|---|
| `oahu-koolauloa` | Ko'olauloa |
| `oahu-koolaupoko` | Ko'olaupoko |
| `oahu-kona` | Kona |
| `oahu-ewa` | 'Ewa |
| `oahu-waianae` | Wai'anae |
| `oahu-waialua` | Waialua |

## Maui (12 moku)

| Moku ID | Traditional Name |
|---|---|
| `maui-kaanapali` | Ka'anapali |
| `maui-wailuku` | Wailuku |
| `maui-hamakuapoko` | Hāmākuapoko |
| `maui-hamakualoa` | Hāmākualoa |
| `maui-koolau` | Ko'olau |
| `maui-hana` | Hāna |
| `maui-kipahulu` | Kīpahulu |
| `maui-kaupo` | Kaupō |
| `maui-kahikinui` | Kahikinui |
| `maui-honuaula` | Honua'ula |
| `maui-kula` | Kula |
| `maui-puali-komohana` | Pua'ali Komohana |

## Hawai'i Island (6 moku)

| Moku ID | Traditional Name |
|---|---|
| `hawaii-kohala` | Kohala |
| `hawaii-hamakua` | Hāmākua |
| `hawaii-hilo` | Hilo |
| `hawaii-puna` | Puna |
| `hawaii-kau` | Ka'ū |
| `hawaii-kona` | Kona |

## Kaua'i (5 moku)

| Moku ID | Traditional Name |
|---|---|
| `kauai-kona` | Kona |
| `kauai-puna` | Puna |
| `kauai-koolau` | Ko'olau |
| `kauai-halele-a` | Halele'a |
| `kauai-napali` | Nā Pali |

## Moloka'i (2 moku)

| Moku ID | Traditional Name |
|---|---|
| `molokai-koolau` | Ko'olau |
| `molokai-kona` | Kona |

## Lāna'i (1 moku)

| Moku ID | Traditional Name |
|---|---|
| `lanai-kona` | Kona |

## Ni'ihau (1 moku)

| Moku ID | Traditional Name |
|---|---|
| `niihau-niihau` | Ni'ihau |

**Note:** Ni'ihau has `status: restricted` in the Mokunet system. Kaho'olawe is excluded from the district system.

## Source

Moku boundaries are derived from the State of Hawaiʻi GIS datasets, stored in the `moku_districts` Supabase table. See the [Mokunet documentation](https://mokunet.us/lahui/research-commons/districts) for an interactive map.
