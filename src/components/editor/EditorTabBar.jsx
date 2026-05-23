import { VscFile } from 'react-icons/vsc'
import { IDE } from '../../styles/ideTokens'

function EditorTabBar({ fileName }) {
  if (!fileName) {
    return (
      <div
        className={`flex h-9 shrink-0 items-center border-b ${IDE.border} ${IDE.panel} px-3`}
      >
        <span className={`text-xs ${IDE.muted}`}>No open files</span>
      </div>
    )
  }

  return (
    <div
      className={`flex h-9 shrink-0 items-end gap-0 border-b ${IDE.border} ${IDE.panel} px-1`}
    >
      <div
        className={`flex items-center gap-2 border-t border-[#1e1e1e] ${IDE.bg} px-3 py-1.5 text-xs text-white transition-colors duration-150`}
      >
        <VscFile className="h-3.5 w-3.5 shrink-0 text-[#519aba]" aria-hidden="true" />
        <span className="max-w-[200px] truncate font-medium">{fileName}</span>
      </div>
    </div>
  )
}

export default EditorTabBar
