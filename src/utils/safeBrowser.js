/**
 * Guards for APIs that only exist in the browser (not during SSR/build).
 */

export function isBrowser() {
  return typeof window !== 'undefined'
}

export function safeConfirm(message) {
  if (!isBrowser()) return false
  return window.confirm(message)
}

export function safeOpenBlank(url) {
  if (!isBrowser() || !url) return null
  return window.open(url, '_blank', 'noopener,noreferrer')
}
