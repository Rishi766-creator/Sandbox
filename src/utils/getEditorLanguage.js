/**
 * Map a file name to a Monaco editor language id.
 */
export function getEditorLanguage(fileName = '') {
  const dotIndex = fileName.lastIndexOf('.')
  const extension = dotIndex > -1 ? fileName.slice(dotIndex).toLowerCase() : ''

  switch (extension) {
    case '.html':
      return 'html'
    case '.css':
      return 'css'
    case '.js':
      return 'javascript'
    default:
      return 'plaintext'
  }
}

/** Human-readable label for the status bar. */
export function getEditorLanguageLabel(language) {
  const labels = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    plaintext: 'Plain Text',
  }

  return labels[language] ?? 'Plain Text'
}
