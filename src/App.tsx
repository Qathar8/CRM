import { Routes, Route, Navigate } from 'react-router-dom'
import { Providers } from './components/providers'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import PipelinePage from './pages/PipelinePage'
import ContactsPage from './pages/ContactsPage'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pipeline" element={<PipelinePage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  )
}

export default App