import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import { ToastProvider } from './components/Toast'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import StudentDashboard from './pages/StudentDashboard'
import ChatbotPage from './pages/ChatbotPage'
import MoodTrackingPage from './pages/MoodTrackingPage'
import MoodCalendar from './pages/MoodCalendar'
import InsightsPage from './pages/InsightsPage'
import JournalPage from './pages/JournalPage'
import GuidancePage from './pages/GuidancePage'
import ResourcesPage from './pages/ResourcesPage'
import TeacherDashboard from './pages/TeacherDashboard'
import FeedbackPage from './pages/FeedbackPage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import AdminPanel from './pages/AdminPanel'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('mindspace_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    const userWithTimestamp = {
      ...userData,
      createdAt: userData.createdAt || Date.now()
    }
    setUser(userWithTimestamp)
    localStorage.setItem('mindspace_user', JSON.stringify(userWithTimestamp))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('mindspace_user')
  }

  const handleUpdateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('mindspace_user', JSON.stringify(userData))
  }

  if (loading) return null

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navigation user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<StudentDashboard user={user} />} />
            <Route path="/chat" element={<ChatbotPage user={user} />} />
            <Route path="/mood-tracking" element={<MoodTrackingPage user={user} />} />
            <Route path="/mood-calendar" element={<MoodCalendar user={user} />} />
            <Route path="/insights" element={<InsightsPage user={user} />} />
            <Route path="/journal" element={<JournalPage user={user} />} />
            <Route path="/guidance" element={<GuidancePage user={user} />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard user={user} />} />
            <Route path="/feedback" element={<FeedbackPage user={user} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage user={user} onUpdateUser={handleUpdateUser} />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
