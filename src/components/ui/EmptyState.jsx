function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-8 text-center">
      {Icon && (
        <Icon
          className="h-10 w-10 shrink-0 text-[#3c3c3c] transition-colors duration-200"
          aria-hidden="true"
        />
      )}
      <p className="text-sm font-medium tracking-tight text-[#cccccc]">
        {title}
      </p>
      {description && (
        <p className="max-w-xs text-xs leading-relaxed text-[#858585]">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

export default EmptyState
