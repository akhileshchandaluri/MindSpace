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
import { supabase } from './lib/supabase'
import { getUserRole } from './lib/auth'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing Supabase session with timeout
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Try to get role, but don't block on it
          try {
            const role = await Promise.race([
              getUserRole(session.user.id),
              new Promise((resolve) => setTimeout(() => resolve('student'), 3000))
            ])
            
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: role || 'student',
              isAnonymous: false,
              createdAt: Date.now()
            })
          } catch (err) {
            console.error('Error getting user role:', err)
            // Set user anyway with default role
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: 'student',
              isAnonymous: false,
              createdAt: Date.now()
            })
          }
        }
      } catch (err) {
        console.error('Error getting session:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const role = await getUserRole(session.user.id)
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

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('mindspace_user')
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
