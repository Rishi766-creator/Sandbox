/**
 * Prevent user code from breaking the preview iframe document.
 * A literal "</script>" inside JS/CSS would close the injected script tag early.
 */
export function sanitizeForHtmlInjection(content) {
  if (content == null) return ''
  return String(content).replace(/<\/script/gi, '<\\/script')
}
