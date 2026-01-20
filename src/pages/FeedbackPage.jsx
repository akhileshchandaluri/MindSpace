import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ThumbsUp, ThumbsDown, Send } from 'lucide-react'

export default function FeedbackPage({ user }) {
  const [rating, setRating] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating) return

    // Save feedback (in production, send to backend)
    const feedbackData = {
      rating,
      feedback,
      timestamp: Date.now(),
      userId: user?.id || 'anonymous'
    }

    console.log('Feedback submitted:', feedbackData)
    setSubmitted(true)

    setTimeout(() => {
      setRating(null)
      setFeedback('')
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Your Feedback Matters</h1>
          <p className="text-lg text-gray-600">
            Help us improve MindSpace for all students
          </p>
        </motion.div>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  Was MindSpace helpful today?
                </label>
                <div className="flex justify-center space-x-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating('positive')}
                    className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${
                      rating === 'positive'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsUp className={`w-12 h-12 mb-2 ${
                      rating === 'positive' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-gray-700">Yes</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating('negative')}
                    className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${
                      rating === 'negative'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsDown className={`w-12 h-12 mb-2 ${
                      rating === 'negative' ? 'text-red-500' : 'text-gray-400'
                    }`} />
                    <span className="font-medium text-gray-700">No</span>
                  </motion.button>
                </div>
              </div>

              <div>
                <label htmlFor="feedback" className="block text-lg font-medium text-gray-900 mb-3">
                  Tell us more (optional)
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What would make MindSpace better for you?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  rows="5"
                />
              </div>

              <button
                type="submit"
                disabled={!rating}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-12 bg-green-50 border-green-200"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600">
              Your feedback helps us create a better experience for all students
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            All feedback is anonymous and used solely to improve MindSpace
          </p>
        </motion.div>
      </div>
    </div>
  )
}
