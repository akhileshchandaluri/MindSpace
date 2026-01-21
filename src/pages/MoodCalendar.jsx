import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, Smile, Meh, Frown } from 'lucide-react'import { getMoods } from '../lib/database'
export default function MoodCalendar({ user }) {
  const navigate = useNavigate()
  const [moodData, setMoodData] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Load all mood data
    const data = {}
    for (let i = 0; i < 60; i++) {
      const saved = localStorage.getItem(`mood_day_${user.id}_${i}`)
      if (saved) {
        try {
          const mood = JSON.parse(saved)
          data[mood.date] = mood
        } catch (e) {
          console.error('Failed to parse mood data:', e)
        }
      }
    }
    setMoodData(data)
  }, [user, navigate])

  if (!user) return null

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'great': return 'bg-green-400'
      case 'good': return 'bg-blue-400'
      case 'okay': return 'bg-yellow-400'
      case 'low': return 'bg-orange-400'
      case 'struggling': return 'bg-red-400'
      default: return 'bg-gray-200'
    }
  }

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'great':
      case 'good':
        return <Smile className="w-4 h-4 text-white" />
      case 'okay':
        return <Meh className="w-4 h-4 text-white" />
      case 'low':
      case 'struggling':
        return <Frown className="w-4 h-4 text-white" />
      default:
        return null
    }
  }

  // Generate calendar days
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Mood Calendar</h1>
          <p className="text-lg text-gray-600">Visual overview of your emotional journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Previous
            </button>
            <h2 className="text-xl font-medium text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={month >= new Date().getMonth() && year >= new Date().getFullYear()}
            >
              Next →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayMood = moodData[dateStr]

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`aspect-square rounded-lg flex items-center justify-center ${
                    dayMood ? getMoodColor(dayMood.mood) : 'bg-gray-100'
                  } ${day === new Date().getDate() && month === new Date().getMonth() ? 'ring-2 ring-primary-500' : ''}`}
                  title={dayMood ? `${dayMood.mood} - Stress: ${dayMood.stress}/10` : 'No data'}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-white mb-1">{day}</div>
                    {dayMood && getMoodIcon(dayMood.mood)}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Legend:</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-sm text-gray-700">Great</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm text-gray-700">Good</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-sm text-gray-700">Okay</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span className="text-sm text-gray-700">Struggling</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
