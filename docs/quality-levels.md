# Quality Levels

Every contribution to the Mokunet Research Commons declares a quality level. This affects how the data is displayed, weighted in analytics, and reviewed during ingestion.

Quality levels also determine how your data is used relative to county-level baselines. Even preliminary data can fill a gap where no local measurements exist — the quality level tells the platform (and other researchers) how much confidence to place in your observations when comparing against federal indicators.

## Levels

### preliminary

**Raw field data, not yet QA'd.**

- Data has been collected but not reviewed for errors
- Methods may not be fully documented
- Suitable for early sharing of time-sensitive observations
- Admin performs a spot-check during PR review
- Displayed with a "Preliminary" label in the graph

### verified

**QA'd by the contributor, methods documented.**

- Data has been checked for accuracy by the contributing organization
- Collection methods and instruments are documented
- Standard quality control procedures have been applied
- Admin performs a thorough review during PR review
- This is the recommended level for most contributions

### peer_reviewed

**Published or reviewed by an external party.**

- Data has been through external peer review or is part of a published study
- Methods and results have been independently validated
- Citation to the published work should be included in metadata
- Fast-track review during PR process
- Highest confidence level in the graph

## Choosing a Quality Level

| If your data... | Use |
|---|---|
| Was just collected from the field | `preliminary` |
| Has been checked and cleaned by your team | `verified` |
| Is part of a published paper or report | `peer_reviewed` |

## Upgrading Quality

You can upgrade a contribution's quality level at any time by opening a new PR that updates the `quality` field in `metadata.json`. For example, if preliminary data later gets published, update the quality to `peer_reviewed` and add the citation.

## Baseline Coverage

Every quality level contributes to moku-level baseline coverage. County-level indicators from Data Commons provide the federal reference point, but many moku districts have no local research supplementing those baselines. A moku with preliminary local data is better characterized than one with only county-level numbers — so don't wait for peer review to contribute. The platform tracks which moku districts have local research coverage and which still rely entirely on county baselines.
