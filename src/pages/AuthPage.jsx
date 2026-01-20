import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { signUp, signIn, getUserRole } from '../lib/auth'
import { useToast } from '../components/Toast'

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    consent: false
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      // Block teacher signup in frontend
      if (!isLogin && formData.email.toLowerCase().includes('teacher')) {
        setError('Teacher accounts must be created by administrators. Please contact your institution.')
        setLoading(false)
        return
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (!isLogin && !formData.consent) {
        setError('Please accept the consent terms')
        setLoading(false)
        return
      }

      let authData
      if (isLogin) {
        // Login with Supabase
        authData = await signIn(formData.email, formData.password)
      } else {
        // Signup with Supabase
        authData = await signUp(formData.email, formData.password)
      }

      if (!authData?.user) {
        setError('Authentication failed. Please try again.')
        setLoading(false)
        return
      }

      const user = authData.user

      // Get user role from database
      const role = await getUserRole(user.id)
      
      const userData = {
        id: user.id,
        email: user.email,
        role: role || 'student',
        isAnonymous: false,
        createdAt: Date.now()
      }

      onLogin(userData)
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')

      // Redirect based on role
      if (role === 'teacher') {
        navigate('/teacher-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/20 to-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Welcome to MindSpace
          </h1>
          <p className="text-gray-600">
            A safe space for students to explore emotions
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-11"
                  placeholder="your.email@university.edu"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use your college/university email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-field pl-11"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="bg-primary-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                    I understand that MindSpace is designed to help me understand my emotions and is <strong>not a substitute for professional mental health care</strong>. I consent to my emotional data being used anonymously to improve the platform.
                  </label>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            Your privacy is our priority. All data is encrypted and secure.
          </p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          This platform is designed exclusively for students
        </p>
      </motion.div>
    </div>
  )
}
