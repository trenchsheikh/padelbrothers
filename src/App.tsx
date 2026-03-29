import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LiveGamePage } from './pages/LiveGamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/live" element={<LiveGamePage />} />
    </Routes>
  )
}

export default App
