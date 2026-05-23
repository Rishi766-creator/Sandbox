import { VscNewFile, VscNewFolder, VscTrash } from 'react-icons/vsc'
import { IDE } from '../../styles/ideTokens'

function SidebarToolbar({ onNewFile, onNewFolder, onDelete, canDelete }) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        className={IDE.iconButton}
        onClick={onNewFile}
        title="New File"
        aria-label="New File"
      >
        <VscNewFile className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={IDE.iconButton}
        onClick={onNewFolder}
        title="New Folder"
        aria-label="New Folder"
      >
        <VscNewFolder className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`${IDE.iconButton} disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={onDelete}
        disabled={!canDelete}
        title="Delete Node"
        aria-label="Delete Node"
      >
        <VscTrash className="h-4 w-4" />
      </button>
    </div>
  )
}

export default SidebarToolbar
