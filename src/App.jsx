import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PreviewPage from './pages/PreviewPage'
import ResultPage from './pages/ResultPage'
import AdminDashboard from './pages/AdminDashboard'
import { StagingProvider } from './context/StagingContext'

function App() {
  return (
    <BrowserRouter>
      <StagingProvider>
        <div className="min-h-screen bg-dark-bg text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </StagingProvider>
    </BrowserRouter>
  )
}

export default App
