# Network Coordination Audit — Messaging & Organizational Gaps

**Date:** 2026-06-10 · **Author:** joehagedorn (with Claude Code) · **Status:** findings captured, fixes pending

This audit reviews how the Mokunet-family codebases **communicate their purpose** and
**coordinate their handoffs** after recent role revisions. It is a messaging /
organizational-structure review, not a code review. Scope: `mokulearner-node`,
`mokunet-org`, `huikoeaina`, `mokulab`, `bgoodfarms-magoon-rfid`, the planned
`magoonlab` gateway, and this repo (`mokulearner-research`).

## Intended network (confirmed in code)

```
mokulearner-research ──(git PR, screened)──┐
                                            ▼
mokulearner-node ──(spatial backbone + APIs)── hawaii.mokunet.us ──► all clients
   │ offloads messaging+mapping                          ▲
   ▼                                                      │ writes contributions
mokunet-org (public voice + moku map)         magoonlab gateway (on-prem)
                                                          ▲
huikoeaina (web-only) ──► student-app + edge devices ─────┘
```

**Role summary (as intended):**

| Repo | Intended role |
|---|---|
| `mokulearner-research` (this repo) | Git-based dataset workflows; screening + rigor; researcher/org-facing |
| `mokulearner-node` | Cloud backend orchestrator + keeper of the spatial backbone; APIs; offloads messaging/mapping (the *gateway* tier is `magoonlab`, below — wording fixed 2026-07-12; see `onprem-pipeline-reconciliation.md`) |
| `mokunet-org` | Owner of general messaging + the moku map + onboarding/skills (offloaded from node) |
| `huikoeaina` | Web-only app; hands off student work + data acquisition to on-prem |
| `magoonlab` (on-prem) | Gateway: ingests student-app HTTP + edge MQTT → mokunet/Supabase; hosts field-guide skill-agent |
| `mokulab` | Platform for BIM model creation; edge devices source the `mokulab/#` telemetry (consumed by magoonlab) |
| `bgoodfarms-magoon-rfid` | Separate on-prem RFID substrate (Mosquitto + InfluxDB) at the Magoon site |

## What's working

`mokulearner-node` is the model the rest of the network should copy. Its offload to
`mokunet-org` is fully executed and *codified*: commit `39c4259` retired in-app
messaging, and `docs/general-specs/AGENT-JOURNEY-CANON.md` states an explicit
"repo-separation contract" (line 18) and "visual rendering … is mokunet-org's job"
(line 133). No drift on that end.

Every gap below is a variation of one theme: **handoffs are documented from the
sender's side but not the receiver's, and one critical node has no home at all.**

---

## Gap A — huikoeaina → magoonlab handoff has no discoverable home  `[deferred]`

> **Deferred 2026-06-10:** to be built directly in the on-prem Windows environment
> once the codebase is pulled from remote — `magoonlab` will be stood up there rather
> than in this WSL workspace.


`magoonlab` is where all student work and field-data acquisition is supposed to land,
plus the Claude skill-agent that writes contributions. It exists only as a Windows path
inside one buried doc: `huikoeaina/huikoeaina/docs/migration-web-android-split.md`
lines 5-8, 27, 85 (`E:\CodeProjects\magoonlab\gateway\`). There is **no magoonlab repo,
no README, no reciprocal description from its own side.** Verified that neither
`mokulab` (BIM platform) nor `bgoodfarms-magoon-rfid` (separate Mosquitto/InfluxDB RFID
substrate) is the target.

**Recommend:** stand up `magoonlab` as a tracked repo with a README stating its role
from its own end — "ingests student-app HTTP + edge-device MQTT, normalizes to one
schema, syncs to mokunet/Supabase, hosts the field-guide skill-agent." Until then the
system's busiest integration point is owner-less and invisible to anyone not reading
huikoeaina's migration plan.

## Gap B — mokunet-org accepted the offload but never says so  `[addressed 2026-06-10]`

> **Done:** added a "Role in the network" section to `mokunet-org/README.md` stating
> the offload contract from its own side (owns / does not own / the seam), mirroring
> mokulearner-node's repo-separation contract.


`mokulearner-node` points at mokunet.org and declares mokunet-org owns the map and the
public copy. But mokunet-org's own `README.md` and `docs/VOICE.md` describe it only as
"the public, explanatory front door" — they never claim ownership of *general messaging
+ mapping, offloaded from mokulearner-node*. A reader landing on mokunet-org alone
cannot tell it is the canonical owner; the offload reads as one-directional.

**Recommend:** add a short "Role in the network / what we own" section to mokunet-org's
README mirroring mokulearner-node's contract — the same statement, stated from both ends.

## Gap C — Two contribution pipelines; only one is screened  `[addressed 2026-06-10 — gateway wiring pending]`

> **Done:** added [ingestion-paths.md](ingestion-paths.md) reconciling the two paths
> (Git PR vs on-prem field/gateway), declaring `schemas/metadata.schema.json` the
> single validation authority for both, fixing field/agent data at `preliminary` until
> reviewed, and requiring path-aware provenance. Linked from the README's Quality Levels
> section.
> **Pending (on-prem):** wire the actual `magoonlab` gateway data contract to
> `schemas/metadata.schema.json` — lands with Gap A.


This repo's value proposition is *screened, version-controlled, reviewed-before-ingestion*
data with declared quality levels. But the migration plan creates a **second ingestion
path**: the gateway's Claude skill-agent "write[s] contributions directly" to
mokunet/Supabase (`migration-web-android-split.md` lines 33-35, 60-61, 93-95) —
bypassing the git PR + GitHub Actions screening entirely.

This repo's `README.md` and `CONTRIBUTING.md` present the PR path as *the* way data
enters the commons and never mention the field/agent path. So the "screening and rigor
as specified" intended for this repo is silently undercut by a parallel automated writer.

**Recommend:** reconcile both paths in writing, both directions.
1. Point the gateway's Phase-0 data contract at this repo's `schemas/metadata.schema.json`
   as the single validation authority, so agent-written field data passes the same checks.
2. Add a section here describing how automated field/student contributions relate to git
   contributions — do they arrive as PRs? what `quality_level` does an agent-written
   reading get (presumably `preliminary`)? — so the rigor story is honest end-to-end.

## Gap D — "mokulab" is overloaded; student-app name collides  `[resolved 2026-06-19 — see onprem-pipeline-reconciliation.md §4]`

> **Resolved:** gateway owner pinned to **magoonlab** (not mokulab). Field-sensor vs mokulab-BIM
> topic namespaces to be split per [onprem-pipeline-reconciliation.md](onprem-pipeline-reconciliation.md) §4.
> Student-app folder/repo is `mokulab-student-app` (remote `Aina-Design-Corp/mokulab-student-app`,
> now exists — Gap supersedes the old "Windows path only" note).


"mokulab" now means three things: the BIM model-creation product (`mokulab.io`), the
edge-device MQTT topic root (`mokulab/#`, intentional — those are mokulab
`EdgeSignalDescriptor` devices), and the education student-app folder
`E:\CodeProjects\mokulab-student-app` — which has nothing to do with BIM.

**Recommend:** rename the student app into the education namespace
(`magoonlab-student-app` or `huikoeaina-student-app`). Separately, add one line to
mokulab's docs noting the magoonlab gateway consumes its edge telemetry — that real link
is currently undocumented on the mokulab side.

## Gap E — Two on-prem stacks "at Magoon," mutually unaware  `[resolved 2026-06-19 — see onprem-pipeline-reconciliation.md §3]`

> **Resolved:** the brokers are DIFFERENT software, so no shared-port conflict if separated:
> **magoonlab = aedes:1883** (its actual `broker/server.js`; the earlier "pinned to Mosquitto" note
> was wrong — corrected), **bgoodfarms-magoon-rfid = Mosquitto:1883** (Impinj readers). Default to
> separate hosts; if co-located, repoint aedes via env `MQTT_PORT`. See §3 + `magoonlab/docs/TRANSPORT.md`.


`bgoodfarms-magoon-rfid` (Mosquitto :1883 + InfluxDB, cloud-*pull*) and the planned
`magoonlab` gateway (aedes broker, *push* to mokunet) are both on-prem at the Magoon
site, both MQTT, **different brokers, zero cross-reference.** If they share a host,
Mosquitto and aedes both wanting MQTT is a real conflict.

**Recommend:** confirm same-host vs separate-host, and cross-link the two READMEs with a
"related on-prem systems at this site" note.

## Gap F — Career-pathways data has three homes, no declared source of truth  `[low]`

`huikoeaina/.../src/data/careerData.ts:5` says it's "curated from
mokulearner-node/datasets/career-pathways/programs.json"; the migration plan moves it to
`gateway/src/schemas/careerPathways.js` driving the student app; the public web copy is
now informational-only. Three copies, no statement of which is canonical.

**Recommend:** declare the canonical source and the copy direction in one place.

---

## Suggested order of attention

1. ~~**Gap A** — create the missing magoonlab node.~~ **Deferred** to the on-prem
   Windows env (built there after pulling from remote).
2. ~~**Gap B** — mokunet-org "Role in the network" section.~~ **Done 2026-06-10.**
3. ~~**Gap C** — dual-pipeline reconciliation + point gateway contract at this repo's schema.~~
   **Doc half done 2026-06-10;** gateway-wiring half deferred to on-prem (with Gap A).
4. **Gaps D / E / F** — naming cleanup, on-prem cross-link, career-data source of truth.

A, B, and C are structural: A creates the missing node; B and C make existing handoffs
mutual instead of one-sided.
