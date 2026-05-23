import { getAllFiles } from '../store/fileTreeHelpers'

/** File names needed to build the live preview. */
export const PREVIEW_FILE_NAMES = ['index.html', 'style.css', 'main.js']

/**
 * Find a file anywhere in the tree by its exact name.
 */
export function findFileByName(tree, fileName) {
  const files = getAllFiles(tree)
  return files.find((file) => file.name === fileName) ?? null
}

/**
 * Read index.html, style.css, and main.js from the project tree.
 */
export function getPreviewSources(fileTree) {
  const htmlFile = findFileByName(fileTree, 'index.html')
  const cssFile = findFileByName(fileTree, 'style.css')
  const jsFile = findFileByName(fileTree, 'main.js')

  const missing = PREVIEW_FILE_NAMES.filter(
    (name) => !findFileByName(fileTree, name),
  )

  return {
    html: htmlFile?.content ?? '',
    css: cssFile?.content ?? '',
    js: jsFile?.content ?? '',
    missing,
    isReady: missing.length === 0,
  }
}
