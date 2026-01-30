import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, X } from 'lucide-react'
import { setSessionPassword, enableEncryption, hasEncryptionSetup } from '../lib/encryption'
import { useToast } from './Toast'

export default function PasswordPrompt({ user, onPasswordSet, onSkip }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) {
      toast.error('Please enter your password')
      return
    }

    setLoading(true)
    try {
      // Set session password
      setSessionPassword(password)
      
      // Enable encryption if not already set up
      if (!hasEncryptionSetup(user.id)) {
        await enableEncryption(password, user.id)
      }
      
      toast.success('🔒 Encryption activated!')
      onPasswordSet()
    } catch (error) {
      console.error('Password verification error:', error)
      toast.error('Invalid password. Please try again.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    toast.info('Using unencrypted mode. Data will not be encrypted.')
    onSkip()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Enable Encryption</h2>
              <p className="text-sm text-gray-500">Enter your password to activate</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <p className="text-sm text-blue-900">
              <strong>🔒 End-to-End Encryption</strong><br/>
              Your data will be encrypted with your password before being stored. 
              Only you can decrypt it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your login password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Activating...' : '🔒 Activate Encryption'}
            </button>
          </form>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={handleSkip}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now (not recommended)
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>✓ AES-256 encryption</p>
          <p>✓ Zero-knowledge architecture</p>
          <p>✓ Only you can decrypt your data</p>
        </div>
      </motion.div>
    </div>
  )
}
