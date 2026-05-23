import { useMemo, useState, useCallback } from 'react'
import { useFileStore } from '../store'
import { useUiStore } from '../store/useUiStore'
import { buildPreviewDocument } from './buildPreviewDocument'
import { getPreviewSources } from './getPreviewSources'

/**
 * Builds preview HTML from the Zustand file tree.
 * Recomputes automatically when file content changes.
 */
export function usePreviewHtml() {
  const fileTree = useFileStore((state) => state.fileTree)
  const previewRefreshKey = useUiStore((state) => state.previewRefreshKey)
  const [refreshKey, setRefreshKey] = useState(0)

  const preview = useMemo(() => {
    const sources = getPreviewSources(fileTree)

    if (!sources.isReady) {
      return {
        html: null,
        missingFiles: sources.missing,
      }
    }

    return {
      html: buildPreviewDocument(sources),
      missingFiles: [],
    }
  }, [fileTree, refreshKey, previewRefreshKey])

  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  return {
    previewHtml: preview.html,
    missingFiles: preview.missingFiles,
    refresh,
    refreshKey,
  }
}
