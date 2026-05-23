import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupMonacoEditor } from './config/monacoSetup'
import './index.css'
import App from './App.jsx'
import StoreHydrationGate from './components/StoreHydrationGate.jsx'

setupMonacoEditor()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreHydrationGate>
      <App />
    </StoreHydrationGate>
  </StrictMode>,
)
