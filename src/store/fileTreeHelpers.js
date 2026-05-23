/**
 * Pure helper functions for working with the file tree.
 * Keeping these separate from Zustand makes the store easier to read and test.
 */

let idCounter = 0

/** Create a unique id for a new file or folder. */
export function createId(prefix = 'node') {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

/**
 * Search the tree for a node by id.
 * Returns the node, its parent array, and its index inside that array.
 */
export function findNode(tree, id, parent = null) {
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i]

    if (node.id === id) {
      return { node, parent: parent ?? tree, index: i }
    }

    if (node.type === 'folder' && node.children?.length) {
      const result = findNode(node.children, id, node.children)
      if (result) return result
    }
  }

  return null
}

/** Deep-clone the tree so Zustand always gets a new reference. */
export function cloneTree(tree) {
  return tree.map((node) => {
    if (node.type === 'folder') {
      return {
        ...node,
        children: cloneTree(node.children ?? []),
      }
    }
    return { ...node }
  })
}

/** Check if a sibling already uses this name (case-sensitive). */
export function nameExists(siblings, name, ignoreId = null) {
  return siblings.some(
    (node) => node.name === name && node.id !== ignoreId,
  )
}

/** Pick a unique name like "script.js", "script-2.js", etc. */
export function uniqueName(siblings, baseName) {
  if (!nameExists(siblings, baseName)) return baseName

  const dotIndex = baseName.lastIndexOf('.')
  const stem = dotIndex > 0 ? baseName.slice(0, dotIndex) : baseName
  const ext = dotIndex > 0 ? baseName.slice(dotIndex) : ''

  let counter = 2
  let candidate = `${stem}-${counter}${ext}`

  while (nameExists(siblings, candidate)) {
    counter += 1
    candidate = `${stem}-${counter}${ext}`
  }

  return candidate
}

/** Collect every file node in the tree (depth-first). */
export function getAllFiles(tree, files = []) {
  for (const node of tree) {
    if (node.type === 'file') {
      files.push(node)
    } else if (node.children?.length) {
      getAllFiles(node.children, files)
    }
  }
  return files
}

/** Remove a node from the tree by id. Returns a new tree array. */
export function removeNodeFromTree(tree, id) {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.type === 'folder' && node.children?.length) {
        return {
          ...node,
          children: removeNodeFromTree(node.children, id),
        }
      }
      return node
    })
}

/** Insert a new node. parentId = null means add to the project root. */
export function insertNode(tree, parentId, newNode) {
  if (!parentId) {
    return [...tree, newNode]
  }

  return tree.map((node) => {
    if (node.id === parentId && node.type === 'folder') {
      const children = node.children ?? []
      return {
        ...node,
        isOpen: true,
        children: [...children, newNode],
      }
    }

    if (node.type === 'folder' && node.children?.length) {
      return {
        ...node,
        children: insertNode(node.children, parentId, newNode),
      }
    }

    return node
  })
}

/** Rename a node anywhere in the tree. */
export function renameNodeInTree(tree, id, newName) {
  return tree.map((node) => {
    if (node.id === id) {
      return { ...node, name: newName }
    }

    if (node.type === 'folder' && node.children?.length) {
      return {
        ...node,
        children: renameNodeInTree(node.children, id, newName),
      }
    }

    return node
  })
}

/** Update content on a file node. */
export function updateContentInTree(tree, id, content) {
  return tree.map((node) => {
    if (node.id === id && node.type === 'file') {
      return { ...node, content }
    }

    if (node.type === 'folder' && node.children?.length) {
      return {
        ...node,
        children: updateContentInTree(node.children, id, content),
      }
    }

    return node
  })
}

/** Toggle folder open/closed state in the explorer. */
export function toggleFolderInTree(tree, id) {
  return tree.map((node) => {
    if (node.id === id && node.type === 'folder') {
      return { ...node, isOpen: !node.isOpen }
    }

    if (node.type === 'folder' && node.children?.length) {
      return {
        ...node,
        children: toggleFolderInTree(node.children, id),
      }
    }

    return node
  })
}

/**
 * Where to create a new file/folder when something is selected.
 * - Selected folder → create inside it
 * - Selected file → create in the same folder as that file
 * - Not found → project root (null)
 */
export function getCreateParentId(tree, nodeId) {
  const found = findNode(tree, nodeId)
  if (!found) return null

  if (found.node.type === 'folder') {
    return found.node.id
  }

  return findParentFolderId(tree, nodeId) ?? null
}

function findParentFolderId(tree, targetId, currentFolderId = null) {
  for (const node of tree) {
    if (node.id === targetId) {
      return currentFolderId
    }

    if (node.type === 'folder') {
      const parentId = findParentFolderId(
        node.children ?? [],
        targetId,
        node.id,
      )
      if (parentId !== undefined) {
        return parentId
      }
    }
  }

  return undefined
}
