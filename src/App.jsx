import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import { ToastProvider } from './components/Toast'
import DisclaimerBanner from './components/DisclaimerBanner'
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
import PrivacyDashboard from './pages/PrivacyDashboard'
import { supabase } from './lib/supabase'
import { getUserRole } from './lib/auth'
import { clearSessionPassword } from './lib/encryption'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Force stop loading after 1.5 seconds no matter what
    const forceLoadTimeout = setTimeout(() => {
      console.log('Force stopping loading...')
      setLoading(false)
    }, 1500)

    // Check for existing Supabase session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Set user immediately with default role
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'student',
            isAnonymous: false,
            createdAt: Date.now()
          })
          
          // Try to get actual role in background (don't block)
          getUserRole(session.user.id).then(role => {
            if (role && role !== 'student') {
              setUser(prev => ({ ...prev, role }))
            }
          }).catch(err => {
            console.error('Background role fetch error:', err)
          })
        }
      } catch (err) {
        console.error('Error getting session:', err)
      } finally {
        clearTimeout(forceLoadTimeout)
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const role = await Promise.race([
            getUserRole(session.user.id),
            new Promise(resolve => setTimeout(() => resolve('student'), 800))
          ])
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: role || 'student',
            isAnonymous: false,
            createdAt: Date.now()
          })
        } catch (err) {
          console.error('Auth state change error:', err)
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'student',
            isAnonymous: false,
            createdAt: Date.now()
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      clearTimeout(forceLoadTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('mindspace_user')
    clearSessionPassword() // Clear encryption password
  }

  const handleUpdateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('mindspace_user', JSON.stringify(userData))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MindSpace...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-white">
          {user && <DisclaimerBanner type="app" />}
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
            <Route path="/privacy" element={<PrivacyDashboard user={user} />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
