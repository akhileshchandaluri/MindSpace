import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X, Shield } from 'lucide-react'

export default function DisclaimerBanner({ type = 'app' }) {
  const [showBanner, setShowBanner] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('mindspace_disclaimer_seen')
    if (!hasSeenDisclaimer) {
      setShowBanner(true)
    } else {
      setIsMinimized(true)
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('mindspace_disclaimer_seen', 'true')
    setIsMinimized(true)
  }

  const disclaimerContent = {
    app: {
      title: 'Important Safety Information',
      message: `MindSpace uses AI technology to provide supportive conversations. Please understand:

• This is NOT therapy, counseling, or medical advice
• AI responses may occasionally be inaccurate or incomplete
• In emergencies, contact KIRAN Helpline: 1800-599-0019 or Emergency: 112
• Always consult a professional counselor for serious concerns
• This tool supplements, but does not replace, professional mental health care

By continuing, you acknowledge these limitations.`
    },
    chat: {
      title: 'Chat Safety Notice',
      message: `This chat uses AI which can make mistakes. Our safety systems reduce errors, but cannot eliminate them completely.

• Critical situations use expert-written protocols (not AI)
• General support uses AI with multiple safety checks
• Always verify advice with a counselor
• You can report concerning responses

In crisis: Call 1800-599-0019 immediately`
    }
  }

  const content = disclaimerContent[type]

  if (!showBanner) return null

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-16 right-4 z-40"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg hover:bg-yellow-100 transition-colors"
        >
          <Shield className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-900">Safety Info</span>
        </button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
        >
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {content.title}
              </h2>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {content.message}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowBanner(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Remind me later
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Inline disclaimer for chat messages
export function InlineDisclaimer({ show = true }) {
  if (!show) return null

  return (
    <div className="flex items-start space-x-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900 my-2">
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p>
        <strong>AI-generated response.</strong> Please verify with a counselor. Not medical advice.
      </p>
    </div>
  )
}

// Response confidence indicator
export function ConfidenceIndicator({ confidence, type }) {
  const getColor = () => {
    if (confidence >= 80) return 'text-green-600 bg-green-50'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getLabel = () => {
    if (type === 'crisis_protocol') return 'Expert Protocol'
    if (type === 'fallback') return 'Safe Fallback'
    if (confidence >= 80) return 'High Confidence'
    if (confidence >= 60) return 'Moderate Confidence'
    return 'Low Confidence'
  }

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getColor()}`}>
      <Shield className="w-3 h-3" />
      <span>{getLabel()}</span>
      {type === 'ai_generated' && <span>({confidence}%)</span>}
    </div>
  )
}
