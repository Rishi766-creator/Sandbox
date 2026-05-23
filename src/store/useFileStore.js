import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createFileStore } from './createFileStore'
import { persistConfig } from './persistConfig'

/**
 * Zustand file store with localStorage persistence.
 *
 * Persistence flow:
 * 1. You edit files → actions update fileTree / activeFileId in memory.
 * 2. persist middleware saves only those fields to localStorage (JSON).
 * 3. On refresh, persisted JSON is read and merged into the store (rehydration).
 * 4. StoreHydrationGate waits for step 3 before rendering the IDE UI.
 *
 * Usage:
 *   const fileTree = useFileStore((state) => state.fileTree)
 *   const createFile = useFileStore((state) => state.createFile)
 */
export const useFileStore = create(
  persist(
    (set, get) => createFileStore(set, get),
    persistConfig,
  ),
)
