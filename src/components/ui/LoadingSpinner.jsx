function LoadingSpinner({ label = 'Loading…', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`${sizeClass} animate-spin rounded-full border-2 border-[#007acc] border-t-transparent`}
        role="status"
        aria-label={label}
      />
      {label && (
        <p className="text-sm text-[#858585] transition-opacity duration-200">
          {label}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
