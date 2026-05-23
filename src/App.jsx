import Navbar from './components/Navbar'
import IDEWorkspace from './components/layout/IDEWorkspace'
import { IDE } from './styles/ideTokens'

function App() {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden ${IDE.bg} transition-colors duration-200`}
    >
      <Navbar />
      <IDEWorkspace />
    </div>
  )
}

export default App
