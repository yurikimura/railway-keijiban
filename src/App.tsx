import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThreadProvider } from './contexts/ThreadContext'
import Home from './components/Home'
import Thread from './components/Thread'
import CreateThread from './components/CreateThread'
import './App.css'

function App() {
  return (
    <ThreadProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/threads/:thread_id" element={<Thread />} />
          <Route path="/create" element={<CreateThread />} />
        </Routes>
      </Router>
    </ThreadProvider>
  )
}

export default App
