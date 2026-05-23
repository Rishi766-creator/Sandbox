import { VscEdit } from 'react-icons/vsc'
import EmptyState from '../ui/EmptyState'
import { IDE } from '../../styles/ideTokens'

function EditorEmptyState() {
  return (
    <div className={`h-full ${IDE.bg}`}>
      <EmptyState
        icon={VscEdit}
        title="No file open"
        description="Choose a file from the explorer to edit code, or create a new file with the + button."
      />
    </div>
  )
}

export default EditorEmptyState
