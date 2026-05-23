import { useState } from 'react'
import { VscFolder } from 'react-icons/vsc'
import { useFileStore } from '../store'
import { getCreateParentId } from '../store/fileTreeHelpers'
import { IDE } from '../styles/ideTokens'
import FileTreeNode from './sidebar/FileTreeNode'
import SidebarToolbar from './sidebar/SidebarToolbar'
import PanelHeader from './ui/PanelHeader'
import EmptyState from './ui/EmptyState'

function Sidebar() {
  const fileTree = useFileStore((state) => state.fileTree)
  const activeFileId = useFileStore((state) => state.activeFileId)
  const selectFile = useFileStore((state) => state.selectFile)
  const createFile = useFileStore((state) => state.createFile)
  const createFolder = useFileStore((state) => state.createFolder)
  const deleteNode = useFileStore((state) => state.deleteNode)
  const toggleFolder = useFileStore((state) => state.toggleFolder)

  const [selectedNodeId, setSelectedNodeId] = useState(activeFileId)

  const parentIdForCreate = selectedNodeId
    ? getCreateParentId(fileTree, selectedNodeId)
    : null

  const nodeToDelete = selectedNodeId ?? activeFileId

  function handleNewFile() {
    createFile(parentIdForCreate)
    setSelectedNodeId(useFileStore.getState().activeFileId)
  }

  function handleNewFolder() {
    createFolder(parentIdForCreate)
  }

  function handleDelete() {
    if (!nodeToDelete) return
    deleteNode(nodeToDelete)
    setSelectedNodeId(useFileStore.getState().activeFileId)
  }

  function handleSelectFile(id) {
    selectFile(id)
    setSelectedNodeId(id)
  }

  return (
    <aside
      className={`flex h-full w-full flex-col ${IDE.panel}`}
      data-panel="sidebar"
    >
      <PanelHeader
        title="Explorer"
        className="px-2"
      >
        <SidebarToolbar
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
          onDelete={handleDelete}
          canDelete={Boolean(nodeToDelete)}
        />
      </PanelHeader>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <p className={`px-3 pb-1.5 ${IDE.sectionLabel}`}>Project</p>

        {fileTree.length === 0 ? (
          <EmptyState
            icon={VscFolder}
            title="Empty project"
            description="Create a file or folder using the toolbar above."
          />
        ) : (
          <div className="px-1.5">
            {fileTree.map((node) => (
              <FileTreeNode
                key={node.id}
                node={node}
                activeFileId={activeFileId}
                selectedNodeId={selectedNodeId}
                onSelectFile={handleSelectFile}
                onSelectNode={setSelectedNodeId}
                onToggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
