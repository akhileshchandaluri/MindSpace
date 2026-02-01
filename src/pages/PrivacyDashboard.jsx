import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Download, Trash2, Eye, EyeOff, Lock, Database, Server, AlertCircle, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { getAllUserData, exportUserData, deleteAllUserData, resetUserEncryption, deleteOldEncryptedData } from '../lib/secureDatabase'
import { hasEncryptionSetup } from '../lib/encryption'

export default function PrivacyDashboard({ user }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [dataStats, setDataStats] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [encryptionEnabled, setEncryptionEnabled] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    loadDataStats()
    setEncryptionEnabled(hasEncryptionSetup(user.id))
  }, [user, navigate])

  const loadDataStats = async () => {
    try {
      setLoading(true)
      const data = await getAllUserData()
      
      setDataStats({
        moods: data.moods.length,
        journals: data.journals.length,
        chats: data.chats.length,
        totalRecords: data.moods.length + data.journals.length + data.chats.length,
        accountCreated: new Date(data.user.created_at).toLocaleDateString()
      })
    } catch (error) {
      console.error('Failed to load data stats:', error)
      toast.error('Failed to load privacy information')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      toast.info('Preparing your data export...')
      await exportUserData()
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export data')
    }
  }

  const handleDelete = async () => {
    if (deleteInput !== 'DELETE MY DATA') {
      toast.error('Please type the confirmation text exactly')
      return
    }

    try {
      toast.info('Deleting all your data...')
      await deleteAllUserData()
      toast.success('All data deleted successfully')
      setShowDeleteConfirm(false)
      navigate('/auth')
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete data')
    }
  }

  const handleResetEncryption = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true)
      return
    }

    try {
      toast.info('Resetting encryption...')
      await resetUserEncryption()
      toast.success('✅ Encryption reset! Your old data may not be accessible, but new data will save correctly.')
      setShowResetConfirm(false)
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      console.error('Reset encryption failed:', error)
      toast.error('Failed to reset encryption')
    }
  }

  const handleUnlockOldData = async () => {
    try {
      toast.info('Deleting old unreadable encrypted data...')
      await deleteOldEncryptedData()
      toast.success('✅ Done! Old encrypted data deleted. You can now save new data that will be readable!')
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('Delete old data failed:', error)
      toast.error('Failed to delete old encrypted data')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-8 h-8 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy & Data Control</h1>
          <p className="text-gray-600">Complete transparency and control over your data</p>
        </div>

        {/* Encryption Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border-2 ${
            encryptionEnabled 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <div className="flex items-start space-x-4">
            {encryptionEnabled ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {encryptionEnabled ? 'End-to-End Encryption Active' : 'Encryption Not Set Up'}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {encryptionEnabled ? (
                  <>
                    All your data is encrypted with AES-256 before being stored in the cloud. 
                    Only you can decrypt it with your password. Even we cannot read your data.
                  </>
                ) : (
                  <>
                    Set up encryption to protect your data with end-to-end encryption. 
                    Your data will be encrypted before leaving your device.
                  </>
                )}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>AES-256-GCM • PBKDF2 Key Derivation • Zero-Knowledge Architecture</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Your Data Overview</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{dataStats.moods}</div>
              <div className="text-sm text-gray-600 mt-1">Mood Entries</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{dataStats.journals}</div>
              <div className="text-sm text-gray-600 mt-1">Journal Entries</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{dataStats.chats}</div>
              <div className="text-sm text-gray-600 mt-1">Chat Messages</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900">{dataStats.totalRecords}</div>
              <div className="text-sm text-gray-600 mt-1">Total Records</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Account Created:</strong> {dataStats.accountCreated}
            </p>
          </div>
        </motion.div>

        {/* Storage Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <span>Where Your Data is Stored</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Encrypted Cloud Storage</h3>
                <p className="text-sm text-gray-600 mt-1">
                  All sensitive data (moods, journals, chats) stored encrypted in Supabase cloud. 
                  Works across all your devices.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Client-Side Encryption</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Data encrypted on YOUR device before upload. Only you have the decryption key.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Who Can Access Your Data?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>ONLY YOU.</strong> Not us, not Supabase admins, not anyone else. 
                  Without your password, the data is unreadable.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export All My Data</span>
            </button>

            {/* Clear Old Encrypted Data Button */}
            <button
              onClick={handleUnlockOldData}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>🗑️ Clear Old Encrypted Data (Can't Be Decrypted)</span>
            </button>
            
            {showResetConfirm ? (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800 mb-3">
                  ⚠️ <strong>Warning:</strong> This will reset your encryption key. Old encrypted data may become inaccessible. 
                  Only use this if you're seeing "unable to decrypt" errors.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetEncryption}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Yes, Reset Encryption
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleResetEncryption}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span>Reset Encryption (Fix Decryption Issues)</span>
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete All My Data</span>
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              <strong>Export:</strong> Downloads all your data as JSON. 
              <strong>Clear Old:</strong> Deletes old encrypted data that can't be read anymore.
              <strong>Reset:</strong> Fixes decryption errors for new data.
              <strong>Delete All:</strong> Permanently removes everything.
            </p>
          </div>
        </motion.div>

        {/* Privacy Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
        >
          <h3 className="font-semibold text-lg text-gray-900 mb-3">Our Privacy Guarantees</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Zero-knowledge encryption - we cannot read your data</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Data encrypted before leaving your device</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>No data shared with third parties</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Complete data export and deletion rights (GDPR compliant)</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Open source encryption code - verifiable by anyone</span>
            </li>
          </ul>
        </motion.div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Delete All Data?</h2>
            <p className="text-gray-600 mb-4 text-center">
              This will permanently delete ALL your data including moods, journals, and chat history. 
              This action cannot be undone.
            </p>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE MY DATA</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Type here..."
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteInput('')
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== 'DELETE MY DATA'}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
