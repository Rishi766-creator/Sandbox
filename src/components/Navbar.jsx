import { VscDebugRestart, VscRefresh } from 'react-icons/vsc'
import { useFileStore } from '../store'
import { useUiStore } from '../store/useUiStore'
import { IDE } from '../styles/ideTokens'
import { safeConfirm } from '../utils/safeBrowser'

function Navbar() {
  const resetProject = useFileStore((state) => state.resetProject)
  const triggerPreviewRefresh = useUiStore((state) => state.triggerPreviewRefresh)

  function handleResetProject() {
    const confirmed = safeConfirm(
      'Reset the project to starter files? Unsaved changes will be lost.',
    )
    if (confirmed) {
      resetProject()
    }
  }

  function handleRefreshPreview() {
    triggerPreviewRefresh()
  }

  return (
    <header
      className={`flex h-11 shrink-0 items-center justify-between border-b ${IDE.border} ${IDE.panel} px-3 sm:px-4`}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#007acc] text-xs font-bold text-white shadow-sm transition-transform duration-150 hover:scale-105"
          aria-hidden="true"
        >
          S
        </div>
        <div className="min-w-0">
          <h1 className={`truncate text-sm font-semibold tracking-tight ${IDE.textBright}`}>
            SandBox
          </h1>
          <p className={`hidden truncate text-[11px] sm:block ${IDE.muted}`}>
            Browser IDE
          </p>
        </div>
      </div>

      <nav
        className="flex items-center gap-1 sm:gap-1.5"
        aria-label="IDE actions"
      >
        <button
          type="button"
          className={`${IDE.button} flex items-center gap-1.5`}
          onClick={handleRefreshPreview}
          title="Refresh preview"
        >
          <VscDebugRestart className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Refresh Preview</span>
        </button>
        <button
          type="button"
          className={`${IDE.button} flex items-center gap-1.5`}
          onClick={handleResetProject}
          title="Reset project"
        >
          <VscRefresh className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset Project</span>
        </button>
      </nav>
    </header>
  )
}

export default Navbar
