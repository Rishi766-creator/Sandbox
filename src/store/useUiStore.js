import { create } from 'zustand'

/** Default panel widths (pixels). */
export const DEFAULT_SIDEBAR_WIDTH = 260
export const DEFAULT_PREVIEW_WIDTH = 360

const MIN_SIDEBAR = 180
const MAX_SIDEBAR = 420
const MIN_PREVIEW = 220
const MAX_PREVIEW = 560

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * UI-only state: panel sizes and preview refresh trigger.
 * Keeps layout concerns separate from the file store.
 */
export const useUiStore = create((set) => ({
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
  previewWidth: DEFAULT_PREVIEW_WIDTH,
  previewRefreshKey: 0,

  setSidebarWidth: (width) =>
    set({ sidebarWidth: clamp(width, MIN_SIDEBAR, MAX_SIDEBAR) }),

  setPreviewWidth: (width) =>
    set({ previewWidth: clamp(width, MIN_PREVIEW, MAX_PREVIEW) }),

  triggerPreviewRefresh: () =>
    set((state) => ({
      previewRefreshKey: state.previewRefreshKey + 1,
    })),

  resetLayout: () =>
    set({
      sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      previewWidth: DEFAULT_PREVIEW_WIDTH,
    }),
}))
