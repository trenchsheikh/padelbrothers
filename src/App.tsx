import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LiveGamePage } from './pages/LiveGamePage'
import { WelcomePage } from './pages/WelcomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/season-4" element={<HomePage />} />
      <Route path="/live" element={<LiveGamePage />} />
    </Routes>
  )
}

export default App
