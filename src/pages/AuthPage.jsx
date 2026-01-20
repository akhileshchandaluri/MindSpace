import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [anonymous, setAnonymous] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    consent: false
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (anonymous) {
      const anonymousUser = {
        id: 'anon_' + Date.now(),
        email: 'Anonymous User',
        isAnonymous: true,
        role: 'student',
        createdAt: Date.now()
      }
      onLogin(anonymousUser)
      navigate('/dashboard')
      return
    }

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    // Block teacher signup in frontend
    if (!isLogin && formData.email.toLowerCase().includes('teacher')) {
      setError('Teacher accounts must be created by administrators. Please contact your institution.')
      return
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!isLogin && !formData.consent) {
      setError('Please accept the consent terms')
      return
    }

    // Check if teacher login (must exist in "database")
    if (isLogin && formData.email.toLowerCase().includes('teacher')) {
      // In production, this would verify against actual database
      // For now, allow any teacher email to login (simulated)
      const teacherUser = {
        id: Date.now(),
        email: formData.email,
        isAnonymous: false,
        role: 'teacher',
        createdAt: Date.now()
      }
      onLogin(teacherUser)
      navigate('/teacher-dashboard')
      return
    }

    // Regular student authentication
    const user = {
      id: Date.now(),
      email: formData.email,
      isAnonymous: false,
      role: 'student',
      createdAt: Date.now()
    }

    onLogin(user)
    navigate('/dashboard')
  }

  const handleAnonymous = () => {
    const anonymousUser = {
      id: 'anon_' + Date.now(),
      email: 'Anonymous User',
      isAnonymous: true,
      role: 'student'
    }
    onLogin(anonymousUser)
    navigate('/dashboard')
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
            {!anonymous && (
              <>
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
              </>
            )}

            <button type="submit" className="w-full btn-primary py-3">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleAnonymous}
            className="w-full btn-secondary py-3 flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Continue Anonymously</span>
          </button>

          <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            Your privacy is our priority. All data is encrypted and you can choose to remain completely anonymous.
          </p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          This platform is designed exclusively for students
        </p>
      </motion.div>
    </div>
  )
}
