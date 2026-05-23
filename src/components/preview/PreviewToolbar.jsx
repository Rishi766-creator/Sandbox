import { VscDebugRestart, VscLinkExternal } from 'react-icons/vsc'
import { IDE } from '../../styles/ideTokens'

function PreviewToolbar({ onRefresh, onOpenExternal, canOpen }) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        className={IDE.iconButton}
        onClick={onRefresh}
        title="Refresh preview"
        aria-label="Refresh preview"
      >
        <VscDebugRestart className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${IDE.iconButton} disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={onOpenExternal}
        disabled={!canOpen}
        title="Open preview in new tab"
        aria-label="Open preview in new tab"
      >
        <VscLinkExternal className="h-4 w-4" />
      </button>
    </div>
  )
}

export default PreviewToolbar
