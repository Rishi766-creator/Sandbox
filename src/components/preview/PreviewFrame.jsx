/**
 * Sandboxed iframe for the live preview.
 *
 * sandbox="allow-scripts":
 * - Runs inline module JS from srcDoc
 * - Allows fetch/load of external ES modules (e.g. https://esm.sh/axios)
 *
 * We intentionally omit allow-same-origin so preview code cannot access
 * the parent IDE origin. Tradeoff: no real node_modules — only CDN imports.
 *
 * srcDoc (not src=) keeps preview self-contained on Vercel static hosting.
 */
function PreviewFrame({ html, iframeKey }) {
  return (
    <iframe
      key={iframeKey}
      title="Live preview"
      srcDoc={html}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      className="h-full w-full border-0 bg-white"
    />
  )
}

export default PreviewFrame
