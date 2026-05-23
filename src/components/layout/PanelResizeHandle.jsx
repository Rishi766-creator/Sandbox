function PanelResizeHandle({
  orientation = 'vertical',
  onMouseDown,
  label,
  className = '',
}) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      aria-label={label}
      onMouseDown={onMouseDown}
      className={`group relative z-20 shrink-0 transition-colors duration-150 ${
        isVertical
          ? 'w-1 cursor-col-resize hover:bg-[#007fd4]/50 active:bg-[#007fd4]/70'
          : 'h-1 cursor-row-resize hover:bg-[#007fd4]/50 active:bg-[#007fd4]/70'
      } bg-transparent ${className}`}
    >
      <span
        className={`absolute transition-colors duration-150 group-hover:bg-[#007fd4]/30 ${
          isVertical
            ? 'inset-y-0 -left-1 -right-1 w-3'
            : 'inset-x-0 -top-1 -bottom-1 h-3'
        }`}
      />
    </div>
  )
}

export default PanelResizeHandle
