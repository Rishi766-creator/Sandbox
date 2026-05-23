import { detectImports } from '../../preview/processPreviewJavaScript'
import { useFileStore } from '../../store'
import { findFileByName } from '../../preview/getPreviewSources'

/**
 * Small hint when main.js uses CDN package imports.
 */
function PreviewPackageHint() {
  const fileTree = useFileStore((state) => state.fileTree)
  const mainFile = findFileByName(fileTree, 'main.js')
  const imports = detectImports(mainFile?.content ?? '')
  const packages = imports.filter((item) => item.isBare || item.resolved.includes('esm.sh'))

  if (packages.length === 0) return null

  return (
    <div className="shrink-0 border-b border-[#2d2d2d] bg-[#252526] px-2 py-1.5 transition-colors duration-150">
      <p className="text-[10px] leading-relaxed text-[#858585]">
        CDN packages:{' '}
        <span className="font-mono text-[#cccccc]">
          {packages.map((p) => p.specifier).join(', ')}
        </span>
      </p>
    </div>
  )
}

export default PreviewPackageHint
