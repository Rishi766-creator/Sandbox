import {
  VscChevronDown,
  VscChevronRight,
  VscFile,
  VscFolder,
  VscFolderOpened,
} from 'react-icons/vsc'
import { IDE } from '../../styles/ideTokens'

function FileTreeNode({
  node,
  depth = 0,
  activeFileId,
  selectedNodeId,
  onSelectFile,
  onSelectNode,
  onToggleFolder,
}) {
  const paddingLeft = 8 + depth * 12
  const isFolder = node.type === 'folder'
  const isActiveFile = !isFolder && node.id === activeFileId
  const isSelected = node.id === selectedNodeId

  const rowClass = [
    'flex w-full items-center gap-1.5 rounded-sm py-0.5 pr-2 text-left text-[13px] transition-colors duration-150',
    isActiveFile
      ? IDE.activeFile
      : isSelected
        ? 'bg-[#37373d] text-[#ffffff]'
        : `${IDE.text} ${IDE.hover}`,
  ].join(' ')

  if (isFolder) {
    const isOpen = node.isOpen ?? false

    return (
      <div>
        <button
          type="button"
          className={rowClass}
          style={{ paddingLeft }}
          onClick={() => {
            onSelectNode(node.id)
            onToggleFolder(node.id)
          }}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <VscChevronDown className="h-3.5 w-3.5 shrink-0 text-[#858585]" />
          ) : (
            <VscChevronRight className="h-3.5 w-3.5 shrink-0 text-[#858585]" />
          )}
          {isOpen ? (
            <VscFolderOpened className="h-4 w-4 shrink-0 text-[#dcb67a]" />
          ) : (
            <VscFolder className="h-4 w-4 shrink-0 text-[#dcb67a]" />
          )}
          <span className="truncate">{node.name}</span>
        </button>

        {isOpen &&
          (node.children ?? []).map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              activeFileId={activeFileId}
              selectedNodeId={selectedNodeId}
              onSelectFile={onSelectFile}
              onSelectNode={onSelectNode}
              onToggleFolder={onToggleFolder}
            />
          ))}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={rowClass}
      style={{ paddingLeft: paddingLeft + 14 }}
      onClick={() => {
        onSelectNode(node.id)
        onSelectFile(node.id)
      }}
    >
      <VscFile className="h-4 w-4 shrink-0 text-[#519aba]" />
      <span className="truncate">{node.name}</span>
    </button>
  )
}

export default FileTreeNode
