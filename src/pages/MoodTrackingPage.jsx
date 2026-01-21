import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Calendar, TrendingUp, Smile, Meh, Frown, Activity } from 'lucide-react'
import { getMoods } from '../lib/database'

export default function MoodTrackingPage({ user }) {
  const navigate = useNavigate()
  const [moodHistory, setMoodHistory] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Load mood history from Supabase
    const loadMoodHistory = async () => {
      try {
        const daysAgo30 = new Date()
        daysAgo30.setDate(daysAgo30.getDate() - 30)
        const startDate = daysAgo30.toISOString().split('T')[0]
        
        const moods = await getMoods(startDate, null)
        setMoodHistory(moods || [])
      } catch (error) {
        console.error('Error loading mood history:', error)
        setMoodHistory([])
      }
    }

    loadMoodHistory()
  }, [user, navigate])

  if (!user) return null

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'great':
      case 'good':
        return <Smile className="w-6 h-6 text-green-500" />
      case 'okay':
        return <Meh className="w-6 h-6 text-yellow-500" />
      case 'low':
      case 'struggling':
        return <Frown className="w-6 h-6 text-red-500" />
      default:
        return <Meh className="w-6 h-6 text-gray-400" />
    }
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'great':
        return 'bg-green-100 border-green-300'
      case 'good':
        return 'bg-blue-100 border-blue-300'
      case 'okay':
        return 'bg-yellow-100 border-yellow-300'
      case 'low':
        return 'bg-orange-100 border-orange-300'
      case 'struggling':
        return 'bg-red-100 border-red-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-medium text-gray-900 mb-2">Mood Tracking</h1>
              <p className="text-lg text-gray-600">
                Track your emotional journey over time
              </p>
            </div>
            <Link
              to="/mood-calendar"
              className="btn-primary flex items-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar View</span>
            </Link>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === 'week'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
          </div>
        </motion.div>

        {/* Mood Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-gray-900">Your Emotional Timeline</h2>
            <Calendar className="w-6 h-6 text-primary-500" />
          </div>

          {moodHistory.length === 0 ? (
            <div className="text-center py-8">
              <Meh className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No mood data yet. Start by checking in on your dashboard!</p>
              <a href="/dashboard" className="btn-primary inline-block mt-4">Go to Dashboard</a>
            </div>
          ) : (
            <div className="space-y-3">
            {moodHistory.slice(0, selectedPeriod === 'week' ? 7 : 14).map((entry, index) => (
              <motion.div
                key={entry.id || entry.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${getMoodColor(entry.mood)}`}
              >
                <div className="flex items-center space-x-4">
                  {getMoodIcon(entry.mood)}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{entry.mood}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.date || entry.created_at).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Stress: {entry.stress_level || entry.stress}/10
                  </span>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </motion.div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <TrendingUp className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Average Mood</h3>
            <p className="text-3xl font-medium text-gray-900">Good</p>
            <p className="text-sm text-gray-600 mt-2">Based on last 7 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <Activity className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Avg Stress Level</h3>
            <p className="text-3xl font-medium text-gray-900">5.2/10</p>
            <p className="text-sm text-gray-600 mt-2">Moderate stress detected</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <Calendar className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking Streak</h3>
            <p className="text-3xl font-medium text-gray-900">14 days</p>
            <p className="text-sm text-gray-600 mt-2">Keep it up!</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
