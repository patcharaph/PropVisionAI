import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PreviewPage from './pages/PreviewPage'
import ResultPage from './pages/ResultPage'
import AdminDashboard from './pages/AdminDashboard'
import { StagingProvider } from './context/StagingContext'
import { I18nProvider } from './context/I18nContext'
import LanguageSwitcher from './components/LanguageSwitcher'

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <StagingProvider>
          <div className="min-h-screen bg-dark-bg text-white">
            <LanguageSwitcher />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </StagingProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}

export default App
