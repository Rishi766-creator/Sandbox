/**
 * Default starter project shown when the IDE first loads.
 * Each node needs: id, name, type, and (for files) content.
 * Folders use children[] and isOpen for the explorer UI.
 */

export const DEFAULT_ACTIVE_FILE_ID = 'file-index-html'

export const defaultFileTree = [
  {
    id: 'file-index-html',
    name: 'index.html',
    type: 'file',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SandBox</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="main.js"></script>
  </body>
</html>
`,
  },
  {
    id: 'file-style-css',
    name: 'style.css',
    type: 'file',
    content: `* {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: system-ui, sans-serif;
  background: #1e1e1e;
  color: #f3f4f6;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

#app h1 {
  font-size: 2rem;
}
`,
  },
  {
    id: 'file-main-js',
    name: 'main.js',
    type: 'file',
    content: `const app = document.getElementById('app')

app.innerHTML = '<h1>Hello, SandBox!</h1>'

// npm packages via esm.sh (bare names are auto-converted in preview):
// import axios from 'axios'
// import axios from 'https://esm.sh/axios'
//
// const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
// app.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>'
`,
  },
]
