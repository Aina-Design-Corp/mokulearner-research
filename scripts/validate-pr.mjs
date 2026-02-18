#!/usr/bin/env node
/**
 * Validate research contributions in a pull request.
 *
 * Checks:
 * 1. metadata.json exists and validates against the JSON Schema
 * 2. Referenced data files exist
 * 3. Contributor slug is approved in registry/contributors.json
 * 4. CSV required fields are present and non-null
 * 5. Value types match declared schema
 * 6. Coordinates within Hawaii bounds (lat 18-23, lng -161 to -154)
 * 7. No duplicate site_id values
 * 8. moku_ids validated when provided (warning only)
 * 9. Coverage required when data lacks coordinates and moku_ids
 *
 * Usage:
 *   CHANGED_DIRS="uh-ctahr/soil-koolaupoko-2025" node scripts/validate-pr.mjs
 *
 * Writes validation-report.json for the GitHub Actions summary comment.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { parse } from 'csv-parse/sync'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ---------------------------------------------------------------------------
// Load reference data
// ---------------------------------------------------------------------------

const metadataSchema = JSON.parse(readFileSync(join(ROOT, 'schemas/metadata.schema.json'), 'utf8'))
const validMokuIds = JSON.parse(readFileSync(join(ROOT, 'schemas/valid-moku-ids.json'), 'utf8')).moku_ids
const registry = JSON.parse(readFileSync(join(ROOT, 'registry/contributors.json'), 'utf8'))
const approvedSlugs = new Set(
  registry.contributors.filter(c => c.status === 'approved').map(c => c.slug)
)

// ---------------------------------------------------------------------------
// JSON Schema validator
// ---------------------------------------------------------------------------

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
const validateMetadata = ajv.compile(metadataSchema)

// ---------------------------------------------------------------------------
// Determine which contribution directories to validate
// ---------------------------------------------------------------------------

function getContributionDirs() {
  const changedDirs = process.env.CHANGED_DIRS?.trim()

  if (changedDirs) {
    // From GitHub Actions: list of relative paths like "uh-ctahr/soil-koolaupoko-2025"
    return changedDirs
      .split('\n')
      .filter(Boolean)
      .map(d => join(ROOT, 'contributions', d))
  }

  // Fallback: validate all non-underscore contribution directories
  const contribRoot = join(ROOT, 'contributions')
  const dirs = []
  for (const contributor of readdirSync(contribRoot)) {
    if (contributor.startsWith('_') || contributor.startsWith('.')) continue
    const contributorPath = join(contribRoot, contributor)
    if (!statSync(contributorPath).isDirectory()) continue
    for (const dataset of readdirSync(contributorPath)) {
      const datasetPath = join(contributorPath, dataset)
      if (statSync(datasetPath).isDirectory()) {
        dirs.push(datasetPath)
      }
    }
  }
  return dirs
}

// ---------------------------------------------------------------------------
// Validate a single contribution directory
// ---------------------------------------------------------------------------

function validateContribution(dirPath) {
  const relPath = dirPath.replace(ROOT + '/', '')
  const result = {
    directory: relPath,
    valid: true,
    errors: [],
    warnings: [],
    stats: null,
  }

  // 1. Check metadata.json exists
  const metadataPath = join(dirPath, 'metadata.json')
  if (!existsSync(metadataPath)) {
    result.errors.push('metadata.json not found')
    result.valid = false
    return result
  }

  // 2. Parse and validate metadata
  let metadata
  try {
    metadata = JSON.parse(readFileSync(metadataPath, 'utf8'))
  } catch (e) {
    result.errors.push(`metadata.json parse error: ${e.message}`)
    result.valid = false
    return result
  }

  const schemaValid = validateMetadata(metadata)
  if (!schemaValid) {
    for (const err of validateMetadata.errors) {
      result.errors.push(`Schema: ${err.instancePath || '/'} ${err.message}`)
    }
    result.valid = false
    return result
  }

  // 3. Check contributor is approved
  if (!approvedSlugs.has(metadata.contributor)) {
    result.errors.push(
      `Contributor "${metadata.contributor}" is not approved in registry/contributors.json`
    )
    result.valid = false
  }

  // 4. Validate each dataset
  let totalRecords = 0
  let totalRejected = 0
  let totalFlagged = 0

  for (const dataset of metadata.datasets) {
    // Check data file exists
    const dataPath = join(dirPath, dataset.file)
    if (!existsSync(dataPath)) {
      result.errors.push(`Data file not found: ${dataset.file}`)
      result.valid = false
      continue
    }

    // Validate moku_ids when provided (optional — warning only for invalid IDs)
    if (Array.isArray(dataset.moku_ids) && dataset.moku_ids.length > 0) {
      for (const mokuId of dataset.moku_ids) {
        if (!validMokuIds.includes(mokuId)) {
          result.warnings.push(`Unknown moku_id: "${mokuId}" in dataset "${dataset.title}" — verify against docs/moku-districts.md`)
        }
      }
    }

    // Check geographic coverage: datasets need coordinates, moku_ids, or a coverage description
    const schemaFields = Object.keys(dataset.schema || {})
    const hasCoordinates = schemaFields.includes('latitude') && schemaFields.includes('longitude')
    const hasMokuIds = Array.isArray(dataset.moku_ids) && dataset.moku_ids.length > 0
    const hasCoverage = typeof dataset.coverage === 'string' && dataset.coverage.length >= 10

    if (!hasCoordinates && !hasMokuIds && !hasCoverage) {
      result.errors.push(
        `Dataset "${dataset.title}" has no coordinate columns, no moku_ids, and no coverage description. ` +
        `Provide at least one: latitude/longitude columns in schema, moku_ids, or a coverage text field.`
      )
      result.valid = false
    }

    // If CSV, validate records
    if (dataset.file.endsWith('.csv')) {
      const csvContent = readFileSync(dataPath, 'utf8')
      let records
      try {
        records = parse(csvContent, { columns: true, skip_empty_lines: true })
      } catch (e) {
        result.errors.push(`CSV parse error in ${dataset.file}: ${e.message}`)
        result.valid = false
        continue
      }

      totalRecords += records.length

      // Check required fields
      if (records.length > 0) {
        const headers = Object.keys(records[0])
        for (const field of dataset.required_fields) {
          if (!headers.includes(field)) {
            result.errors.push(
              `Required field "${field}" not found in CSV headers. Available: ${headers.join(', ')}`
            )
            result.valid = false
          }
        }

        // Check declared schema fields exist
        for (const field of Object.keys(dataset.schema)) {
          if (!headers.includes(field)) {
            result.warnings.push(
              `Schema field "${field}" not found in CSV headers`
            )
          }
        }
      }

      // Validate individual records
      const siteIds = new Set()
      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        const row = i + 2 // 1-indexed + header row

        // Required fields non-null
        for (const field of dataset.required_fields) {
          if (record[field] === undefined || record[field] === null || record[field] === '') {
            result.errors.push(`Row ${row}: required field "${field}" is empty`)
            totalRejected++
            result.valid = false
          }
        }

        // Type checking for number fields
        for (const [field, type] of Object.entries(dataset.schema)) {
          if (type === 'number' && record[field] !== undefined && record[field] !== '') {
            if (isNaN(Number(record[field]))) {
              result.errors.push(`Row ${row}: field "${field}" expected number, got "${record[field]}"`)
              totalRejected++
              result.valid = false
            }
          }
        }

        // Coordinate bounds check
        const lat = Number(record.latitude)
        const lng = Number(record.longitude)
        if (record.latitude && record.longitude) {
          if (!isNaN(lat) && !isNaN(lng)) {
            if (lat < 18 || lat > 23 || lng < -161 || lng > -154) {
              result.warnings.push(
                `Row ${row}: coordinates (${lat}, ${lng}) outside Hawaii bounds`
              )
              totalFlagged++
            }
          }
        }

        // Duplicate site_id check
        if (record.site_id) {
          if (siteIds.has(record.site_id)) {
            result.errors.push(`Row ${row}: duplicate site_id "${record.site_id}"`)
            totalRejected++
            result.valid = false
          }
          siteIds.add(record.site_id)
        }
      }
    }

    // GeoJSON validation (basic)
    if (dataset.file.endsWith('.geojson')) {
      try {
        const geojson = JSON.parse(readFileSync(dataPath, 'utf8'))
        if (geojson.type !== 'FeatureCollection') {
          result.errors.push(`${dataset.file}: expected FeatureCollection, got ${geojson.type}`)
          result.valid = false
        } else {
          totalRecords += geojson.features?.length || 0
        }
      } catch (e) {
        result.errors.push(`GeoJSON parse error in ${dataset.file}: ${e.message}`)
        result.valid = false
      }
    }
  }

  result.stats = {
    total: totalRecords,
    rejected: totalRejected,
    flagged: totalFlagged,
  }

  return result
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const dirs = getContributionDirs()

if (dirs.length === 0) {
  console.log('No contribution directories to validate.')
  process.exit(0)
}

console.log(`Validating ${dirs.length} contribution(s)...\n`)

const report = { results: [] }
let hasErrors = false

for (const dir of dirs) {
  const result = validateContribution(dir)
  report.results.push(result)

  const icon = result.valid ? '\u2705' : '\u274c'
  console.log(`${icon} ${result.directory}`)

  if (result.errors.length > 0) {
    for (const err of result.errors) {
      console.log(`   \u274c ${err}`)
    }
    hasErrors = true
  }

  if (result.warnings.length > 0) {
    for (const warn of result.warnings) {
      console.log(`   \u26a0\ufe0f  ${warn}`)
    }
  }

  if (result.stats) {
    console.log(`   Records: ${result.stats.total} total, ${result.stats.rejected} rejected, ${result.stats.flagged} flagged`)
  }
  console.log()
}

// Write report for GitHub Actions
writeFileSync(join(ROOT, 'validation-report.json'), JSON.stringify(report, null, 2))

if (hasErrors) {
  console.log('Validation failed. Fix the errors above and push again.')
  process.exit(1)
} else {
  console.log('All contributions validated successfully.')
  process.exit(0)
}
