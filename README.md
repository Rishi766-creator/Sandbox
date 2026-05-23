# SandBox — Browser IDE

A full-featured, in-browser integrated development environment for building and previewing small web projects. SandBox combines a VS Code–inspired UI, Monaco-based editing, a live HTML/CSS/JS preview, and project persistence—all running client-side with no backend required.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-764ABC)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)

---

## Table of contents

- [Project overview](#project-overview)
- [Features](#features-implemented)
- [Architecture decisions](#architecture-decisions)
- [Zustand state management](#zustand-state-management)
- [Recursive file tree](#recursive-file-tree)
- [Monaco editor integration](#monaco-editor-integration)
- [Live preview architecture](#live-preview-architecture)
- [Persistence strategy](#persistence-strategy)
- [npm package support](#npm-package-support-tradeoffs)
- [AI tools used](#ai-tools-used)
- [Example prompts](#example-prompts-used-during-development)
- [Known limitations](#known-limitations)
- [Future improvements](#future-improvements)
- [Setup instructions](#setup-instructions)
- [Deployment](#deployment-vercel)

---

## Project overview

SandBox is a **browser IDE** aimed at learners and rapid prototyping. Users can create files and folders, edit code with syntax highlighting, see a live preview of `index.html` + `style.css` + `main.js`, and have their work restored after a page refresh.

The entire app is a **single-page application (SPA)** built with React and Vite. There is no server-side file system, no real `npm install`, and no build step for user projects—only for the IDE itself.

### Tech stack

| Layer | Technology |
|--------|------------|
| UI | React 19, Tailwind CSS 4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| State | Zustand (with `persist` middleware) |
| Tooling | Vite 8, ESLint |
| Icons | react-icons (VS Code style) |
| Deploy | Vercel (static hosting) |

---

## Features implemented

### IDE layout

- Full-screen dark theme (VS Code–like)
- Top navbar with project branding and actions
- Three-panel layout: **Explorer** | **Editor** | **Preview**
- Draggable panel resizing on desktop (≥1024px)
- Responsive stacked layout on smaller screens

### File explorer

- Tree view for files and folders (recursive)
- Create file / create folder / delete node
- Expand and collapse folders
- Active file highlighting
- Empty project state messaging

### Code editor

- Monaco Editor with `vs-dark` theme
- Language detection by extension (`.html`, `.css`, `.js`)
- Live sync with Zustand on every edit
- Loading state while Monaco initializes
- Empty state when no file is selected

### Live preview

- Renders `index.html`, `style.css`, and `main.js` inside a **sandboxed iframe**
- Injects CSS and JS into HTML dynamically
- Updates automatically when file content changes
- Manual refresh from navbar or preview toolbar
- Open preview in a new tab
- Placeholder when required files are missing
- Optional **esm.sh** CDN imports for npm-style packages

### Persistence & project actions

- **localStorage** persistence via Zustand `persist`
- Hydration gate on startup (avoids flash of default project)
- **Reset Project** restores starter files
- **Refresh Preview** forces preview rebuild

### Production readiness

- Vite production build
- Monaco CDN loader for static deploys
- Preview content sanitization (`</script>` escaping)
- Environment-safe config (`src/config/env.js`)
- Vercel SPA routing (`vercel.json`)

---

## Architecture decisions

### Client-only, modular folders

Logic is split by concern so the codebase stays approachable:

```
src/
├── components/     # UI (layout, sidebar, editor, preview, shared ui/)
├── config/         # env.js, monacoSetup.js
├── hooks/          # usePanelResize, useMediaQuery
├── preview/        # HTML builder, esm.sh processing, usePreviewHtml
├── store/          # file store + persist + UI store
├── styles/         # ideTokens.js (shared Tailwind class groups)
└── utils/          # editor language, safe browser helpers
```

### Two Zustand stores

| Store | Responsibility |
|--------|----------------|
| `useFileStore` | Project files, tree, active file, editor content |
| `useUiStore` | Panel widths, preview refresh trigger |

Separating **project data** from **layout/UI** keeps persistence simple (only the file store is saved to `localStorage`) and avoids serializing UI actions.

### Pure helpers outside the store

`fileTreeHelpers.js` holds immutable tree operations (`findNode`, `insertNode`, `removeNodeFromTree`, etc.). The store calls these helpers instead of embedding complex logic—easier to read, test, and reason about.

### Composition over a heavy framework

No React Router (single view), no global context provider chain, and no backend API layer. The IDE is one screen with focused child components (`FileTreeNode`, `CodeEditor`, `PreviewFrame`).

---

## Zustand state management

### Why Zustand?

- **Minimal boilerplate** compared to Redux
- **No Provider required**—components subscribe with selectors
- Built-in **`persist` middleware** for `localStorage`
- Fits a beginner-friendly codebase while scaling to more actions later

### File store shape

```js
{
  fileTree: [ /* files and folders at project root */ ],
  activeFileId: 'file-index-html',
  // actions: createFile, deleteNode, updateFileContent, ...
}
```

**File node**

```js
{ id, name, type: 'file', content }
```

**Folder node**

```js
{ id, name, type: 'folder', isOpen, children: [] }
```

### Persistence flow

1. User edits → `updateFileContent` updates `fileTree`
2. `persist` middleware writes `fileTree` + `activeFileId` to `localStorage` (`sandbox-ide-project`)
3. On reload → data is rehydrated and merged with defaults
4. `StoreHydrationGate` blocks the UI until rehydration completes

Only **data** is persisted (`partialize`); action functions are excluded from storage.

---

## Recursive file tree

The explorer does not use a flat file list. Folders contain `children` arrays, and the UI mirrors that structure.

### `FileTreeNode` component

- If `node.type === 'folder'`: render chevron + folder icon, toggle `isOpen`, map over `children` and render `<FileTreeNode />` again with `depth + 1`
- If `node.type === 'file'`: render file row; click calls `selectFile(id)`

Recursion matches the data shape directly—no separate “flattened” view to keep in sync.

### Tree operations (helpers)

| Operation | Behavior |
|-----------|----------|
| `findNode` | Depth-first search by `id` |
| `insertNode` | Add to root or inside a folder |
| `removeNodeFromTree` | Remove file or entire folder subtree |
| `updateContentInTree` | Patch file `content` anywhere in the tree |
| `getCreateParentId` | Resolve where “New File” should be created based on selection |

---

## Monaco editor integration

- Wrapped in `CodeEditor.jsx` using `@monaco-editor/react`
- **Controlled** via `value={content}` and `onChange` → `updateFileContent`
- **`key={fileId}`** remounts Monaco when switching files (clean state per file)
- **Production**: `monacoSetup.js` points Monaco’s loader to jsDelivr CDN so workers load correctly on Vercel static hosting
- **Development**: Monaco is served from `node_modules` by default

Language mapping (`getEditorLanguage.js`):

| Extension | Monaco language |
|-----------|-----------------|
| `.html` | `html` |
| `.css` | `css` |
| `.js` | `javascript` |
| other | `plaintext` |

---

## Live preview architecture

```
fileTree (Zustand)
       ↓
getPreviewSources()  →  index.html, style.css, main.js by filename
       ↓
processPreviewJavaScript()  →  bare imports → esm.sh URLs
       ↓
buildPreviewDocument()  →  single HTML string (inline CSS + module JS)
       ↓
PreviewFrame (iframe srcDoc + sandbox="allow-scripts")
```

### Design choices

- **`srcDoc`** instead of a blob URL or separate route—keeps preview self-contained on static hosting
- **Removes** `<link href="style.css">` and `<script src="main.js">` from user HTML, then **injects** inline `<style>` and `<script type="module">`
- **`type="module"`** is required for `import` statements (esm.sh CDN)
- **Sandbox** omits `allow-same-origin` so preview code cannot access the parent IDE origin
- **Sanitization** escapes `</script>` sequences inside user code so the iframe document is not broken

`usePreviewHtml` recomputes when `fileTree` or `previewRefreshKey` (navbar refresh) changes.

---

## Persistence strategy

| Aspect | Implementation |
|--------|----------------|
| Storage | `localStorage` |
| Key | `sandbox-ide-project` |
| Library | Zustand `persist` + `createJSONStorage` |
| Saved fields | `fileTree`, `activeFileId` (content lives inside tree nodes) |
| Validation | `sanitizePersistedProject()` on rehydrate |
| UX | Loading screen until hydration finishes |

**Tradeoff:** Large projects may approach `localStorage` size limits (~5MB per origin). No cloud sync or multi-device support.

---

## npm package support tradeoffs

SandBox does **not** run `npm install`. Instead, `main.js` can use **ES module imports** resolved through [esm.sh](https://esm.sh):

```js
import axios from 'axios'                        // rewritten to https://esm.sh/axios
import axios from 'https://esm.sh/axios'         // used as-is
```

| Benefit | Limitation |
|---------|------------|
| Works in the browser immediately | Requires network access in preview |
| No backend or `node_modules` | No version pinning by default |
| Beginner-friendly `import` syntax | Relative imports (`./utils.js`) are not bundled |
| Sandboxed iframe | Some packages may fail if they expect Node APIs |

See `src/preview/processPreviewJavaScript.js` for rewrite logic and documented tradeoffs.

---

## AI tools used

This project was developed with assistance from:

| Tool | Role |
|------|------|
| **[Cursor](https://cursor.com)** | Primary IDE: inline edits, codebase search, multi-file refactors, terminal builds |
| **[ChatGPT](https://chat.openai.com)** | Design discussion, prompt refinement, architecture feedback |

AI was used as a **development accelerator**, not as a runtime dependency. The shipped app does not call any AI APIs.

---

## Example prompts used during development

These are representative prompts used while building SandBox (paraphrased from the actual workflow):

1. **Scaffold UI**
   > Create a clean browser IDE layout using React and Tailwind CSS with a navbar, sidebar, Monaco editor panel, preview panel, and resizable-ready flex layout. Keep components modular. No functionality yet.

2. **State layer**
   > Create a Zustand store for a browser IDE with a file tree, CRUD operations, activeFileId, and default starter files (index.html, style.css, main.js). Use plain JavaScript.

3. **Wire explorer**
   > Connect the Sidebar to the Zustand file store with a recursive FileTreeNode, folder expand/collapse, active file highlight, and toolbar actions (New File, New Folder, Delete).

4. **Editor**
   > Integrate Monaco Editor with the file store: show active file content, update on change, switch language by extension, empty state when no file is selected.

5. **Preview**
   > Implement live preview from index.html, style.css, and main.js inside a sandboxed iframe with automatic updates on edit.

6. **Persistence**
   > Persist the Zustand file store to localStorage with persist middleware and restore on reload.

7. **CDN packages**
   > Add basic npm package support in the preview via esm.sh, preserving ES module imports in the iframe.

8. **UX polish**
   > Add resizable panels, loading states, navbar Reset Project / Refresh Preview, empty states, and consistent dark IDE styling.

9. **Deploy**
   > Prepare the project for Vercel: production build, SPA routing, Monaco CDN in production, iframe preview fixes, environment-safe config.

10. **Documentation**
    > Create a professional README with architecture, tradeoffs, AI tools, limitations, and setup instructions.

---

## Known limitations

- **No real file system** — files exist only in memory / `localStorage`
- **No `npm install` or `package.json` for user projects** — CDN imports only
- **Preview expects** `index.html`, `style.css`, and `main.js` by exact name
- **Single active tab** in the editor (no multi-tab session)
- **No rename UI** in the sidebar (store supports `renameNode`; UI not exposed)
- **No undo/redo** or collaborative editing
- **localStorage cap** — very large files may fail to persist
- **Monaco** loads from CDN in production (requires network on first editor open)
- **Preview sandbox** — no `allow-same-origin`; some advanced APIs may be restricted
- **No TypeScript** in the IDE itself (plain JS project files only)

---

## Future improvements

- [ ] Multi-tab editor with open file list
- [ ] Inline rename and drag-and-drop in the file tree
- [ ] Debounced persistence to reduce `localStorage` writes
- [ ] Export / download project as ZIP
- [ ] Import project from ZIP or GitHub gist
- [ ] Console panel (capture `iframe` errors)
- [ ] Optional TypeScript / JSX support in preview (esbuild-wasm or similar)
- [ ] User-configurable esm.sh versions (`axios@1.6.0`)
- [ ] Themes (light mode, custom accent)
- [ ] Keyboard shortcuts (save, new file, toggle preview)
- [ ] Cloud sync (Firebase, Supabase, or custom backend)
- [ ] Real `npm install` via sandboxed bundler (Sandpack, WebContainer)

---

## Setup instructions

### Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node)

### Install and run

```bash
# Clone the repository
git clone <your-repo-url>
cd SandBox

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |
| `npm start` | Alias for `vite preview` |

### Optional environment variables

Copy `.env.example` to `.env` for local overrides:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_BASE_PATH` | `/` | Asset base path (subpath deploys) |
| `VITE_ESM_SH_ORIGIN` | `https://esm.sh` | CDN origin for preview imports |
| `VITE_MONACO_VERSION` | `0.55.1` | Monaco version on CDN (production) |

---

## Deployment (Vercel)

1. Push the project to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Confirm settings (or use defaults from `vercel.json`):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Framework:** Vite
4. Deploy.

`vercel.json` includes SPA rewrites so refreshing any route serves `index.html`. Static assets under `/assets/` are served normally.

### Post-deploy checklist

- [ ] Editor loads (Monaco CDN)
- [ ] Preview runs starter project
- [ ] Refresh keeps files (`localStorage`)
- [ ] esm.sh import works over HTTPS

---

## License

This project is private (`"private": true` in `package.json`). Add a license file if you plan to open-source it.

---

## Acknowledgments

Built as a learning-focused browser IDE. Thanks to the teams behind [Monaco Editor](https://microsoft.github.io/monaco-editor/), [esm.sh](https://esm.sh), [Zustand](https://zustand.docs.pmnd.rs/), and [Vite](https://vite.dev/).
