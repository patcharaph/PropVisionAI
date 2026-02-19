import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PreviewPage from './pages/PreviewPage'
import ResultPage from './pages/ResultPage'
import AdminDashboard from './pages/AdminDashboard'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import { StagingProvider } from './context/StagingContext'
import { I18nProvider } from './context/I18nContext'
import LanguageSwitcher from './components/LanguageSwitcher'
import InstallButton from './components/InstallButton'

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <StagingProvider>
          <div className="min-h-screen bg-dark-bg text-white">
            <div className="flex items-center justify-between px-6 py-3">
              <LanguageSwitcher />
              <InstallButton />
            </div>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            </Routes>
          </div>
        </StagingProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}

export default App
