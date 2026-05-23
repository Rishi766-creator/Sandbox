import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { getEditorLanguage } from '../../utils/getEditorLanguage'
import LoadingSpinner from '../ui/LoadingSpinner'
import { IDE } from '../../styles/ideTokens'

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 8 },
  wordWrap: 'on',
  tabSize: 2,
  smoothScrolling: true,
  cursorBlinking: 'smooth',
}

function CodeEditor({ fileId, fileName, content, onChange }) {
  const [isLoading, setIsLoading] = useState(true)
  const language = getEditorLanguage(fileName)

  useEffect(() => {
    setIsLoading(true)
  }, [fileId])

  return (
    <div className={`relative h-full w-full ${IDE.bg}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1e1e1e]/90">
          <LoadingSpinner label="Loading editor…" size="sm" />
        </div>
      )}
      <Editor
        key={fileId}
        height="100%"
        language={language}
        value={content}
        theme="vs-dark"
        loading={null}
        onChange={(value) => onChange(value ?? '')}
        onMount={() => setIsLoading(false)}
        options={editorOptions}
      />
    </div>
  )
}

export default CodeEditor
