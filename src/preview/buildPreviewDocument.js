import { processPreviewJavaScript } from './processPreviewJavaScript'
import { sanitizeForHtmlInjection } from './sanitizePreviewContent'

/**
 * Build a single HTML document for the preview iframe.
 *
 * Injects style.css and main.js inline. main.js runs as type="module" so
 * `import` statements can load packages from esm.sh inside the sandbox.
 */
export function buildPreviewDocument({ html = '', css = '', js = '' }) {
  let documentHtml = sanitizeForHtmlInjection(html)

  documentHtml = documentHtml.replace(
    /<link[^>]*href=["']style\.css["'][^>]*>/gi,
    '',
  )

  documentHtml = documentHtml.replace(
    /<script[^>]*src=["']main\.js["'][^>]*>\s*<\/script>/gi,
    '',
  )
  documentHtml = documentHtml.replace(
    /<script[^>]*src=["']main\.js["'][^>]*>/gi,
    '',
  )

  const { code: processedJs } = processPreviewJavaScript(js)
  const safeCss = sanitizeForHtmlInjection(css)
  const safeJs = sanitizeForHtmlInjection(processedJs)

  const styleBlock = `<style id="sandbox-injected-css">\n${safeCss}\n</style>`
  const scriptBlock = `<script type="module" id="sandbox-injected-js">\n${safeJs}\n</script>`

  if (!/<meta[^>]+charset/i.test(documentHtml) && /<head[^>]*>/i.test(documentHtml)) {
    documentHtml = documentHtml.replace(
      /<head[^>]*>/i,
      (match) => `${match}\n    <meta charset="UTF-8" />`,
    )
  }

  if (/<\/head>/i.test(documentHtml)) {
    documentHtml = documentHtml.replace(/<\/head>/i, `${styleBlock}\n</head>`)
  } else if (/<body[^>]*>/i.test(documentHtml)) {
    documentHtml = documentHtml.replace(
      /<body[^>]*>/i,
      (match) => `${match}\n${styleBlock}`,
    )
  } else {
    documentHtml = `${styleBlock}\n${documentHtml}`
  }

  if (/<\/body>/i.test(documentHtml)) {
    documentHtml = documentHtml.replace(/<\/body>/i, `${scriptBlock}\n</body>`)
  } else {
    documentHtml = `${documentHtml}\n${scriptBlock}`
  }

  return documentHtml
}
