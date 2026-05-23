/**
 * Browser preview package support (no real npm install).
 *
 * Tradeoffs:
 * - Packages load from esm.sh CDN at preview time, not from node_modules.
 * - Bare imports like `import axios from 'axios'` are rewritten to esm.sh URLs.
 * - Full URLs (https://esm.sh/axios) are kept as-is.
 * - Relative imports (./utils.js) are not bundled; they only work if you inline code.
 * - Requires network access inside the iframe; offline preview will fail for packages.
 * - Version pinning is not handled (esm.sh serves compatible latest builds).
 */

import { esmShOrigin } from '../config/env'

const ESM_SH_ORIGIN = esmShOrigin

const IMPORT_FROM_REGEX =
  /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g
const SIDE_EFFECT_IMPORT_REGEX = /import\s+['"]([^'"]+)['"]/g
const DYNAMIC_IMPORT_REGEX = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g

/** True for npm-style specifiers (axios, lodash/debounce, @vue/reactivity). */
export function isBarePackageSpecifier(specifier) {
  if (!specifier) return false
  if (specifier.startsWith('.') || specifier.startsWith('/')) return false
  if (/^https?:\/\//i.test(specifier)) return false
  if (specifier.startsWith('data:') || specifier.startsWith('blob:')) return false
  return true
}

/** Turn a bare package name into an esm.sh CDN URL. */
export function toEsmShUrl(specifier) {
  return `${ESM_SH_ORIGIN}/${specifier}`
}

/**
 * Find import statements in main.js for tooling and documentation.
 * Returns a list of { specifier, resolved, isBare }.
 */
export function detectImports(js = '') {
  const seen = new Set()
  const imports = []

  function addMatch(specifier) {
    if (seen.has(specifier)) return
    seen.add(specifier)

    const isBare = isBarePackageSpecifier(specifier)
    imports.push({
      specifier,
      resolved: isBare ? toEsmShUrl(specifier) : specifier,
      isBare,
    })
  }

  for (const match of js.matchAll(IMPORT_FROM_REGEX)) {
    addMatch(match[1])
  }

  for (const match of js.matchAll(SIDE_EFFECT_IMPORT_REGEX)) {
    addMatch(match[1])
  }

  for (const match of js.matchAll(DYNAMIC_IMPORT_REGEX)) {
    addMatch(match[1])
  }

  return imports
}

function rewriteSpecifierInQuotes(js, regex) {
  return js.replace(regex, (fullMatch, specifier) => {
    if (!isBarePackageSpecifier(specifier)) {
      return fullMatch
    }

    const resolved = toEsmShUrl(specifier)
    return fullMatch.replace(specifier, resolved)
  })
}

/**
 * Prepare main.js for the preview iframe:
 * - Detect imports
 * - Rewrite bare package names to esm.sh
 * - Preserve existing https://esm.sh/... URLs
 */
export function processPreviewJavaScript(js = '') {
  const imports = detectImports(js)

  let processed = js
  processed = rewriteSpecifierInQuotes(processed, IMPORT_FROM_REGEX)
  processed = rewriteSpecifierInQuotes(processed, SIDE_EFFECT_IMPORT_REGEX)
  processed = rewriteSpecifierInQuotes(processed, DYNAMIC_IMPORT_REGEX)

  const usesEsmImports = imports.some(
    (item) => item.isBare || item.resolved.includes('esm.sh'),
  )

  return {
    code: processed,
    imports,
    usesEsmImports,
  }
}
