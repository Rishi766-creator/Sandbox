/**
 * Environment-safe access to Vite env variables.
 * Use import.meta.env only through this module in app code.
 */

export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const mode = import.meta.env.MODE

/** Base URL for assets and routing (Vite `base` option). */
export const baseUrl = import.meta.env.BASE_URL || '/'

/** CDN origin for npm packages in the preview iframe. */
export const esmShOrigin =
  import.meta.env.VITE_ESM_SH_ORIGIN?.trim() || 'https://esm.sh'

/** Monaco editor version served from CDN in production builds. */
export const monacoVersion =
  import.meta.env.VITE_MONACO_VERSION?.trim() || '0.55.1'
