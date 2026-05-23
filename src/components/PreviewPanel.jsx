import { useEffect, useState } from 'react'
import { VscLock } from 'react-icons/vsc'
import { usePreviewHtml } from '../preview/usePreviewHtml'
import { safeOpenBlank } from '../utils/safeBrowser'
import { IDE } from '../styles/ideTokens'
import PanelHeader from './ui/PanelHeader'
import LoadingSpinner from './ui/LoadingSpinner'
import PreviewEmptyState from './preview/PreviewEmptyState'
import PreviewFrame from './preview/PreviewFrame'
import PreviewPackageHint from './preview/PreviewPackageHint'
import PreviewToolbar from './preview/PreviewToolbar'

function PreviewPanel() {
  const { previewHtml, missingFiles, refresh, refreshKey } = usePreviewHtml()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const canPreview = Boolean(previewHtml)
  const iframeKey = canPreview ? `${refreshKey}-${previewHtml}` : String(refreshKey)

  useEffect(() => {
    if (!canPreview) return
    setIsRefreshing(true)
    const timer = setTimeout(() => setIsRefreshing(false), 280)
    return () => clearTimeout(timer)
  }, [iframeKey, canPreview])

  function handleRefresh() {
    refresh()
  }

  function handleOpenExternal() {
    if (!previewHtml) return

    const blob = new Blob([previewHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    safeOpenBlank(url)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <aside
      className={`flex h-full w-full flex-col ${IDE.bg}`}
      data-panel="preview"
    >
      <PanelHeader title="Preview">
        <PreviewToolbar
          onRefresh={handleRefresh}
          onOpenExternal={handleOpenExternal}
          canOpen={canPreview}
        />
      </PanelHeader>

      <div
        className={`flex shrink-0 items-center gap-2 border-b ${IDE.border} ${IDE.surface} px-2 py-1.5`}
      >
        <VscLock className="h-3.5 w-3.5 shrink-0 text-[#858585]" aria-hidden="true" />
        <div
          className={`min-w-0 flex-1 truncate rounded px-2 py-0.5 font-mono text-[11px] ${IDE.bg} ${IDE.muted}`}
        >
          sandbox://preview · esm.sh
        </div>
      </div>

      <PreviewPackageHint />

      <div className="relative min-h-0 flex-1">
        {canPreview ? (
          <>
            <PreviewFrame html={previewHtml} iframeKey={iframeKey} />
            {isRefreshing && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#1e1e1e]/60 transition-opacity duration-200">
                <LoadingSpinner label="Updating preview…" size="sm" />
              </div>
            )}
          </>
        ) : (
          <PreviewEmptyState missingFiles={missingFiles} />
        )}
      </div>
    </aside>
  )
}

export default PreviewPanel
