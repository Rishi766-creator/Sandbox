import {
  DEFAULT_ACTIVE_FILE_ID,
  defaultFileTree,
} from './defaultProject'
import {
  cloneTree,
  createId,
  findNode,
  getAllFiles,
  insertNode,
  nameExists,
  removeNodeFromTree,
  renameNodeInTree,
  toggleFolderInTree,
  uniqueName,
  updateContentInTree,
} from './fileTreeHelpers'

/**
 * File store state and actions (used with or without persist middleware).
 */
export function createFileStore(set, get) {
  return {
    fileTree: cloneTree(defaultFileTree),
    activeFileId: DEFAULT_ACTIVE_FILE_ID,

    getActiveFile: () => {
      const { fileTree, activeFileId } = get()
      if (!activeFileId) return null

      const found = findNode(fileTree, activeFileId)
      if (!found || found.node.type !== 'file') return null

      return found.node
    },

    getNodeById: (id) => {
      const found = findNode(get().fileTree, id)
      return found?.node ?? null
    },

    createFile: (parentId = null, name = 'untitled.txt') => {
      set((state) => {
        const parent = parentId
          ? findNode(state.fileTree, parentId)
          : { node: null, parent: state.fileTree }

        if (parentId && (!parent || parent.node.type !== 'folder')) {
          return state
        }

        const siblings = parent.parent
        const fileName = uniqueName(siblings, name)
        const newFile = {
          id: createId('file'),
          name: fileName,
          type: 'file',
          content: '',
        }

        return {
          fileTree: insertNode(state.fileTree, parentId, newFile),
          activeFileId: newFile.id,
        }
      })
    },

    createFolder: (parentId = null, name = 'new-folder') => {
      set((state) => {
        const parent = parentId
          ? findNode(state.fileTree, parentId)
          : { node: null, parent: state.fileTree }

        if (parentId && (!parent || parent.node.type !== 'folder')) {
          return state
        }

        const siblings = parent.parent
        const folderName = uniqueName(siblings, name)
        const newFolder = {
          id: createId('folder'),
          name: folderName,
          type: 'folder',
          isOpen: true,
          children: [],
        }

        return {
          fileTree: insertNode(state.fileTree, parentId, newFolder),
        }
      })
    },

    deleteNode: (id) => {
      set((state) => {
        const found = findNode(state.fileTree, id)
        if (!found) return state

        const nextTree = removeNodeFromTree(state.fileTree, id)
        let nextActiveId = state.activeFileId

        if (state.activeFileId === id) {
          const remainingFiles = getAllFiles(nextTree)
          nextActiveId = remainingFiles[0]?.id ?? null
        }

        return {
          fileTree: nextTree,
          activeFileId: nextActiveId,
        }
      })
    },

    renameNode: (id, newName) => {
      const trimmed = newName.trim()
      if (!trimmed) return

      set((state) => {
        const found = findNode(state.fileTree, id)
        if (!found) return state

        if (nameExists(found.parent, trimmed, id)) {
          return state
        }

        return {
          fileTree: renameNodeInTree(state.fileTree, id, trimmed),
        }
      })
    },

    selectFile: (id) => {
      const found = findNode(get().fileTree, id)
      if (!found || found.node.type !== 'file') return

      set({ activeFileId: id })
    },

    updateFileContent: (id, content) => {
      set((state) => {
        const found = findNode(state.fileTree, id)
        if (!found || found.node.type !== 'file') return state

        return {
          fileTree: updateContentInTree(state.fileTree, id, content),
        }
      })
    },

    toggleFolder: (id) => {
      set((state) => ({
        fileTree: toggleFolderInTree(state.fileTree, id),
      }))
    },

    resetProject: () => {
      set({
        fileTree: cloneTree(defaultFileTree),
        activeFileId: DEFAULT_ACTIVE_FILE_ID,
      })
    },
  }
}
