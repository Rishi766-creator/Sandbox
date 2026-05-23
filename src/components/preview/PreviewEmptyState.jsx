import { VscWarning } from 'react-icons/vsc'
import EmptyState from '../ui/EmptyState'
import { IDE } from '../../styles/ideTokens'

function PreviewEmptyState({ missingFiles }) {
  return (
    <div className={`h-full ${IDE.bg}`}>
      <EmptyState
        icon={VscWarning}
        title="Preview unavailable"
        description="Add these files to your project to enable the live preview:"
      >
        <ul className="mt-1 space-y-1 text-left text-xs">
          {missingFiles.map((name) => (
            <li
              key={name}
              className="rounded bg-[#2d2d2d] px-2 py-1 font-mono text-[#cccccc]"
            >
              {name}
            </li>
          ))}
        </ul>
      </EmptyState>
    </div>
  )
}

export default PreviewEmptyState
