import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Download, Trash2, Save } from 'lucide-react'
import { useToast } from '../components/Toast'
import { getAllUserData, exportUserData, deleteAllUserData } from '../lib/secureDatabase'
import { supabase } from '../lib/supabase'

export default function ProfilePage({ user, onUpdateUser }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    setFormData(prev => ({ 
      ...prev, 
      email: user?.email || '',
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
    }))
  }, [user, navigate])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    try {
      let updated = false
      
      // Update name if changed
      if (formData.name && formData.name !== user?.user_metadata?.full_name) {
        const { error: nameError } = await supabase.auth.updateUser({
          data: { full_name: formData.name }
        })
        
        if (nameError) throw nameError
        
        // Update parent component state
        if (onUpdateUser) {
          onUpdateUser({
            ...user,
            user_metadata: { ...user.user_metadata, full_name: formData.name }
          })
        }
        
        updated = true
        toast.success('Name updated successfully!')
      }
      
      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }
        
        if (formData.newPassword.length < 6) {
          toast.error('Password must be at least 6 characters')
          return
        }

        // Update password in Supabase
        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword
        })

        if (error) throw error
        
        updated = true
        toast.success('Password updated successfully!')
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }
      
      if (!updated) {
        toast.info('No changes to save')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleExportData = async () => {
    try {
      await exportUserData()
      toast.success('Data exported successfully!')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mindspace-data-${Date.now()}.json`
      a.click()
      
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Failed to export data:', error)
      toast.error('Failed to export data')
    }
  }

  const handleDeleteData = async () => {
    if (window.confirm('Are you sure? This will delete ALL your data permanently!')) {
      try {
        await deleteAllUserData()
        toast.success('All data deleted')
        setTimeout(() => navigate('/'), 1000)
      } catch (error) {
        console.error('Failed to delete data:', error)
        toast.error('Failed to delete data')
      }
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-lg text-gray-600">Manage your account and data</p>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center space-x-2">
            <User className="w-5 h-5 text-primary-500" />
            <span>Account Information</span>
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-11"
                  placeholder="Enter your name"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This name will be displayed on your dashboard</p>
            </div>

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
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="input-field"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="input-field"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </form>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6">Data Management</h2>

          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export My Data</span>
            </button>

            <p className="text-sm text-gray-600">
              Download all your mood history, journal entries, and chat logs as a JSON file.
            </p>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-red-50 border-red-200"
        >
          <h2 className="text-xl font-medium text-red-900 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            <button
              onClick={handleDeleteData}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete All My Data</span>
            </button>

            <p className="text-sm text-red-700">
              ⚠️ This action is permanent and cannot be undone. All your mood logs, journal entries, and chat history will be deleted.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
