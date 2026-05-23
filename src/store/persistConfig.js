import { createJSONStorage } from 'zustand/middleware'
import { findNode, getAllFiles } from './fileTreeHelpers'

/**
 * localStorage key for the saved IDE project.
 * Flow: edit files → Zustand updates → persist middleware writes JSON here.
 * On reload: read JSON → merge into store → UI shows saved project.
 */
export const PERSIST_STORAGE_KEY = 'sandbox-ide-project'

/**
 * Validate data loaded from localStorage before applying it to the store.
 * Returns null if the saved data is missing or corrupted.
 */
export function sanitizePersistedProject(persisted) {
  if (!persisted || !Array.isArray(persisted.fileTree)) {
    return null
  }

  const fileTree = persisted.fileTree
  let activeFileId = persisted.activeFileId ?? null

  if (activeFileId) {
    const found = findNode(fileTree, activeFileId)
    if (!found || found.node.type !== 'file') {
      const files = getAllFiles(fileTree)
      activeFileId = files[0]?.id ?? null
    }
  }

  return { fileTree, activeFileId }
}

/**
 * Persist middleware options.
 * @see https://docs.pmnd.rs/zustand/integrations/persisting-store-data
 */
export const persistConfig = {
  name: PERSIST_STORAGE_KEY,
  storage: createJSONStorage(() => localStorage),

  // Only persist project data (not action functions).
  // File contents are stored inside each file node in fileTree.
  partialize: (state) => ({
    fileTree: state.fileTree,
    activeFileId: state.activeFileId,
  }),

  // Merge saved data over defaults when the app rehydrates.
  merge: (persistedState, currentState) => {
    const validated = sanitizePersistedProject(persistedState)
    if (!validated) return currentState

    return {
      ...currentState,
      fileTree: validated.fileTree,
      activeFileId: validated.activeFileId,
    }
  },

  // Runs after localStorage has been read back into the store.
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error(
        '[SandBox] Could not restore project from localStorage:',
        error,
      )
    }
  },

  version: 1,
}
