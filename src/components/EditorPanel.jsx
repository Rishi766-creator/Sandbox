import { useMemo } from 'react'
import { useFileStore } from '../store'
import { findNode } from '../store/fileTreeHelpers'
import {
  getEditorLanguage,
  getEditorLanguageLabel,
} from '../utils/getEditorLanguage'
import { IDE } from '../styles/ideTokens'
import CodeEditor from './editor/CodeEditor'
import EditorEmptyState from './editor/EditorEmptyState'
import EditorTabBar from './editor/EditorTabBar'

function EditorPanel() {
  const fileTree = useFileStore((state) => state.fileTree)
  const activeFileId = useFileStore((state) => state.activeFileId)
  const updateFileContent = useFileStore((state) => state.updateFileContent)

  const activeFile = useMemo(() => {
    if (!activeFileId) return null

    const found = findNode(fileTree, activeFileId)
    if (!found || found.node.type !== 'file') return null

    return found.node
  }, [fileTree, activeFileId])

  const language = activeFile ? getEditorLanguage(activeFile.name) : null
  const languageLabel = language
    ? getEditorLanguageLabel(language)
    : 'No file'

  function handleContentChange(newContent) {
    if (!activeFileId) return
    updateFileContent(activeFileId, newContent)
  }

  return (
    <section
      className={`flex h-full min-w-0 flex-1 flex-col ${IDE.bg}`}
      data-panel="editor"
    >
      <EditorTabBar fileName={activeFile?.name} />

      <div className="relative min-h-0 flex-1">
        {activeFile ? (
          <CodeEditor
            fileId={activeFile.id}
            fileName={activeFile.name}
            content={activeFile.content}
            onChange={handleContentChange}
          />
        ) : (
          <EditorEmptyState />
        )}
      </div>

      <div
        className={`flex h-6 shrink-0 items-center justify-between border-t ${IDE.border} bg-[#007acc] px-3 font-mono text-[11px] text-white`}
      >
        <span className="transition-opacity duration-150">{languageLabel}</span>
        <span className="truncate opacity-90">
          {activeFile ? activeFile.name : '—'}
        </span>
      </div>
    </section>
  )
}

export default EditorPanel
