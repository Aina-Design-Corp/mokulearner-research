# On-Prem Field/Sensor Pipeline — Reconciliation

**Date:** 2026-06-19 · **Status:** decided (gateway owner pinned); per-repo action items open
**Resolves:** [network-coordination-audit.md](network-coordination-audit.md) Gaps D & E, and a
naming drift introduced by `mokulab-student-app` commit `86a547a` (2026-06-17).

This note pins the cross-repo contract for the Magoon-site on-prem data pipeline so each repo
can specialize on its own topics + skills without re-litigating ownership.

## 1. Component roles (authoritative)

| Component | Role | Speaks |
|---|---|---|
| **magoonlab** | **On-prem gateway + source-of-truth for field data.** MQTT broker + subscriber, field skill-agent (claude-opus-4-8 tool-use loop), REST ingest + readback, normalizes everything into `measures[].point`. | MQTT (in), REST (in/out) |
| **mokulab** | Platform for **BIM model creation** (`mokulab.io`). **NOT** the field gateway. Its `mokulab/#` MQTT root is for mokulab BIM `EdgeSignalDescriptor` devices, consumed by the magoonlab gateway. | MQTT (`mokulab/bim/#` — see §4) |
| **huikoeaina** | Web-only presentation; **owns the gateway CONTRACTS** (`docs/contracts/`) magoonlab implements. Read-only reflection of field data; not in the ingest path. | REST (out) |
| **mokulab-student-app** | REST-only client of the magoonlab gateway. Human field entry + skill-agent chat over HTTP POST; displays sensor readings via REST GET. **Does not speak MQTT.** | REST (in/out) |
| **bgoodfarms-magoon-rfid** | Separate on-prem RFID substrate at the same site. | MQTT (own broker — see §3) |
| **mokulearner-node** | Cloud backend orchestrator. Receives normalized field records from the gateway's `mokulearner` sink (see §5). | REST (in) |

> **Naming fix:** `mokulab-student-app/docs/sensor-integration.md` (commit `86a547a`) names
> "mokulab" as broker/subscriber/source-of-truth. That role is **magoonlab**. `config.ts` and
> `gatewayClient.ts` in the same repo already say "magoonlab" — the sensor doc is the outlier.

## 2. Transport split (decided — both, partitioned by data origin)

```
HUMAN data   --REST POST-->  magoonlab gateway   (/ingest/reading, /agent/turn)
DEVICE data  --MQTT-------->  magoonlab broker    (QoS 1, retained; source:"device")
                                   |  normalize both into measures[].point
BOTH read back --REST GET--  magoonlab gateway   (/readings/latest, /readings)
                                   |
                        student-app (display) + huikoeaina (web)
```

Human-entered = REST; device telemetry = MQTT; they converge at the gateway and fan back out as
REST. `measures[].point` carries `source: "device" | <human>` provenance through the whole chain.

## 3. Broker / port (resolves Gap E) — DECIDED + implemented 2026-06-19

- **magoonlab runs aedes on `:1883`** (`broker/server.js`; pure-Node, Windows-native — the *actual*
  shipped broker for the MokuLab edge tier). NOTE: the student-app `sensor-integration.md` says
  "Mosquitto" — that's doc drift; the firmware is a standard MQTT client and works against aedes.
  Fix that doc.
- **bgoodfarms-magoon-rfid runs Mosquitto on `:1883`** (Impinj readers) — a SEPARATE substrate.
- **Co-host resolution:** unrelated systems → default **separate hosts**. If co-located, repoint aedes
  via env (`MQTT_PORT=1884` + the boards' `zone_cfg.mqttPort`); the gateway reads `MQTT_URL` from env,
  so no code change. Implementation authority: `magoonlab/docs/TRANSPORT.md`.

## 4. Topic namespace (resolves Gap D) — DECIDED + implemented 2026-06-19

Field sensors were colliding with mokulab BIM zone-simulators on the shared `mokulab/` root — the one
`mokulab/#` subscriber fed both payload shapes through the wrong normalizer (`fromEdgeSignal`),
producing garbage records for field readings. **Decision — carve into two roots on the one aedes broker:**

- `mokulab/{zoneId}/{pointId}` → mokulab BIM zone-simulator EdgeSignalDescriptors (kept).
- `field/{unitId}/sensor_reading` → student-app field sensors (re-rooted off `mokulab/`).

**Implemented gateway-side** (subscribes both roots, routes by topic prefix **plus a payload-shape
fallback** so the cutover needs no flag day): `magoonlab/docs/TRANSPORT.md`. Per-board ACLs already
scope within each fleet; this separates the two populations. **Owed (producer side):** the firmware
topic change (`mokulab/` → `field/`, reflash) and adding `sensor_reading` to huikoeaina's
`gateway-schema.md` §2 KINDS.

## 5. mokulearner-node implication (transport-independent)

Regardless of how data reached the gateway, the gateway's `mokulearner` sink (currently a stub)
must POST normalized records to node. Two things are owed on the node side (from the
2026-06-19 auth review):

1. **`POST /api/services/research` does not exist** (route is GET-only). Add the authenticated
   write endpoint.
2. **No service-to-service auth path** — the gateway plans `MOKUNET_API_KEY`; node has no API-key
   validator. (Auth-review recommended-order item #4.)
3. Map `source: device|human` → node `ResearchRecord` provenance + BigQuery; agent/device-authored
   readings land at `quality_level: preliminary` (per [ingestion-paths.md](ingestion-paths.md)).

## 6. Per-repo action items (each repo specializes)

- **mokulab-student-app** — fix `sensor-integration.md` naming (mokulab→magoonlab for the
  gateway/source-of-truth role); apply the §4 topic-root decision in firmware + the readback doc.
- **magoonlab** — ✅ MQTT subscriber + namespace carve + `fromFieldSensor` normalize done 2026-06-19
  (`docs/TRANSPORT.md`). Remaining: REST readback (`/readings/latest`, `/readings`), broker user/ACL
  provisioning, and the `mokulearner` sink (POST to node) sending `MOKUNET_API_KEY`.
- **mokulearner-node** — add authenticated `POST /api/services/research` + an API-key validation
  path for service callers.
- **mokulab** — declare its `mokulab/#` (or `mokulab/bim/#`) BIM device namespace explicitly.
- **bgoodfarms-magoon-rfid** — confirm broker co-host topology; cross-link READMEs (§3).
