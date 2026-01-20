import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function Navigation({ user, onLogout }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = user ? 
    (user.role === 'teacher' ? [
      { path: '/teacher-dashboard', label: 'Dashboard' },
    ] : [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/chat', label: 'Chat' },
      { path: '/mood-tracking', label: 'Mood' },
      { path: '/insights', label: 'Insights' },
      { path: '/journal', label: 'Journal' },
      { path: '/guidance', label: 'Guidance' },
      { path: '/resources', label: 'Resources' },
      { path: '/profile', label: 'Profile' },
    ]) : [
      { path: '/about', label: 'About' },
      { path: '/resources', label: 'Resources' },
    ]

  if (location.pathname === '/') {
    return null
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? (user.role === 'teacher' ? '/teacher-dashboard' : '/dashboard') : '/'} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Heart className="w-5 h-5 text-primary-500" />
            </div>
            <span className="text-xl font-medium text-gray-900">MindSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-100"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    onLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
