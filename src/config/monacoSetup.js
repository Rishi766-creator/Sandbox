import { loader } from '@monaco-editor/react'
import { isProd, monacoVersion } from './env'

/**
 * Monaco workers must load from a stable URL in production (Vercel static deploy).
 * In dev, Vite serves the editor from node_modules automatically.
 */
export function setupMonacoEditor() {
  if (!isProd) return

  loader.config({
    paths: {
      vs: `https://cdn.jsdelivr.net/npm/monaco-editor@${monacoVersion}/min/vs`,
    },
  })
}
