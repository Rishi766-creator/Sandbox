import { useUiStore } from '../../store/useUiStore'
import { usePanelResize } from '../../hooks/usePanelResize'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import PanelResizeHandle from './PanelResizeHandle'
import Sidebar from '../Sidebar'
import EditorPanel from '../EditorPanel'
import PreviewPanel from '../PreviewPanel'

const DESKTOP_LAYOUT = '(min-width: 1024px)'

function IDEWorkspace() {
  const isDesktop = useMediaQuery(DESKTOP_LAYOUT)

  const sidebarWidth = useUiStore((state) => state.sidebarWidth)
  const previewWidth = useUiStore((state) => state.previewWidth)
  const setSidebarWidth = useUiStore((state) => state.setSidebarWidth)
  const setPreviewWidth = useUiStore((state) => state.setPreviewWidth)

  const sidebarResize = usePanelResize('horizontal', (delta) => {
    const current = useUiStore.getState().sidebarWidth
    setSidebarWidth(current + delta)
  })

  const previewResize = usePanelResize('horizontal', (delta) => {
    const current = useUiStore.getState().previewWidth
    setPreviewWidth(current - delta)
  })

  const sidebarStyle = isDesktop
    ? { width: sidebarWidth, height: '100%' }
    : { width: '100%', height: '26vh', minHeight: 120 }

  const previewStyle = isDesktop
    ? { width: previewWidth, height: '100%' }
    : { width: '100%', height: '30vh', minHeight: 140 }

  return (
    <main
      className={`flex min-h-0 flex-1 overflow-hidden ${
        isDesktop ? 'flex-row' : 'flex-col'
      }`}
    >
      <div
        className="flex shrink-0 flex-col overflow-hidden border-[#2d2d2d] max-lg:border-b lg:border-b-0 lg:border-r"
        style={sidebarStyle}
      >
        <Sidebar />
      </div>

      {isDesktop && (
        <PanelResizeHandle
          orientation="vertical"
          label="Resize sidebar"
          onMouseDown={sidebarResize.startResize}
        />
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <EditorPanel />
      </div>

      {isDesktop && (
        <PanelResizeHandle
          orientation="vertical"
          label="Resize preview"
          onMouseDown={previewResize.startResize}
        />
      )}

      <div
        className="flex shrink-0 flex-col overflow-hidden border-[#2d2d2d] max-lg:border-t lg:border-l"
        style={previewStyle}
      >
        <PreviewPanel />
      </div>
    </main>
  )
}

export default IDEWorkspace
