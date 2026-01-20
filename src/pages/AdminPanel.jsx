import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, UserPlus, AlertCircle } from 'lucide-react'
import { useToast } from '../components/Toast'

export default function AdminPanel() {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
    schoolId: ''
  })
  const toast = useToast()

  // In a real app, this would be environment variable
  const ADMIN_KEY = 'mindspace_admin_2024'

  const handleAdminAuth = (e) => {
    e.preventDefault()
    if (adminKey === ADMIN_KEY) {
      setIsAuthenticated(true)
      toast.success('Admin access granted')
    } else {
      toast.error('Invalid admin key')
    }
  }

  const handleCreateTeacher = (e) => {
    e.preventDefault()
    
    if (!teacherData.name || !teacherData.email || !teacherData.schoolId) {
      toast.error('All fields are required')
      return
    }

    // Check if teacher already exists
    const existingTeacher = localStorage.getItem(`user_${teacherData.email}`)
    if (existingTeacher) {
      toast.error('Teacher account already exists')
      return
    }

    // Create teacher account
    const teacherAccount = {
      id: `teacher_${Date.now()}`,
      name: teacherData.name,
      email: teacherData.email,
      schoolId: teacherData.schoolId,
      role: 'teacher',
      createdAt: Date.now(),
      password: 'teacher123' // Default password (should be changed on first login)
    }

    localStorage.setItem(`user_${teacherData.email}`, JSON.stringify(teacherAccount))
    
    toast.success(`Teacher account created successfully! Default password: teacher123`)
    
    // Reset form
    setTeacherData({ name: '', email: '', schoolId: '' })
  }

  const listTeachers = () => {
    const teachers = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('user_') && key.includes('teacher')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key))
          if (userData.role === 'teacher') {
            teachers.push(userData)
          }
        } catch (e) {
          console.error('Failed to parse user data:', e)
        }
      }
    }
    return teachers
  }

  const teachers = isAuthenticated ? listTeachers() : []

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="card">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-primary-500" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 text-center mb-6">
              Admin Panel Access
            </h2>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Access Key
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="input-field"
                  placeholder="Enter admin key"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Authenticate
              </button>
            </form>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  This panel is for administrators only. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-lg text-gray-600">Manage teacher accounts</p>
        </motion.div>

        {/* Create Teacher Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <UserPlus className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-medium text-gray-900">Create Teacher Account</h2>
          </div>

          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher Name
              </label>
              <input
                type="text"
                value={teacherData.name}
                onChange={(e) => setTeacherData({...teacherData, name: e.target.value})}
                className="input-field"
                placeholder="Enter teacher's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={teacherData.email}
                onChange={(e) => setTeacherData({...teacherData, email: e.target.value})}
                className="input-field"
                placeholder="teacher@school.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School/Institution ID
              </label>
              <input
                type="text"
                value={teacherData.schoolId}
                onChange={(e) => setTeacherData({...teacherData, schoolId: e.target.value})}
                className="input-field"
                placeholder="e.g., RVCE, IIT-D"
                required
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Default password will be: <strong>teacher123</strong>
                <br />
                Teacher must change this on first login.
              </p>
            </div>

            <button type="submit" className="btn-primary w-full">
              Create Teacher Account
            </button>
          </form>
        </motion.div>

        {/* Existing Teachers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Existing Teacher Accounts</h2>
          
          {teachers.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No teacher accounts found</p>
          ) : (
            <div className="space-y-3">
              {teachers.map((teacher, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                      <p className="text-xs text-gray-500 mt-1">School ID: {teacher.schoolId}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(teacher.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                In production, this panel should be protected with proper authentication,
                HTTPS, and role-based access control. Teacher accounts should have strong
                password requirements and 2FA enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
