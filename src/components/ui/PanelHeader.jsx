import { IDE } from '../../styles/ideTokens'

function PanelHeader({ title, children, className = '' }) {
  return (
    <div className={`${IDE.panelHeader} ${className}`}>
      <span className={IDE.sectionLabel}>{title}</span>
      {children}
    </div>
  )
}

export default PanelHeader
