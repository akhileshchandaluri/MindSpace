import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity, Calendar, AlertCircle } from 'lucide-react'
import { getSecureMoods } from '../lib/secureDatabase'

export default function InsightsPage({ user }) {
  const navigate = useNavigate()
  const [insights, setInsights] = useState(null)
  const [stats, setStats] = useState({ avgStress: 0, peakDay: 'N/A', trend: 'N/A', burnoutRisk: 'Low' })

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Load mood data from Supabase
    const loadInsights = async () => {
      try {
        const daysAgo30 = new Date()
        daysAgo30.setDate(daysAgo30.getDate() - 30)
        const startDate = daysAgo30.toISOString().split('T')[0]
        
        const moodHistory = await getSecureMoods(startDate, null) || []

        if (moodHistory.length === 0) {
          setInsights({
            moodDistribution: [],
            stressTrend: [],
            moodByWeekday: [],
            isEmpty: true
          })
          return
        }    // Calculate mood distribution
    const moodCounts = {}
    const moodColors = {
      'great': '#10b981',
      'good': '#3b82f6',
      'okay': '#eab308',
      'low': '#f97316',
      'struggling': '#ef4444'
    }
    
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    })

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: moodColors[mood]
    }))

    // Calculate stress trend (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const stressTrend = []
    const today = new Date()
    
    // Get last 7 days of data
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() - i)
      const dayName = days[targetDate.getDay()]
      
      // Find moods for this specific date
      const dayMoods = moodHistory.filter(m => {
        const moodDate = new Date(m.date || m.created_at)
        return moodDate.toDateString() === targetDate.toDateString()
      })
      
      // Average stress for this day (or 0 if no data)
      const avgStress = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + (m.stress_level || 0), 0) / dayMoods.length
        : 0
      
      stressTrend.push({
        day: dayName,
        stress: parseFloat(avgStress.toFixed(1))
      })
    }

        // Calculate mood distribution by day of week
        const moodByWeekday = {}
        days.forEach(day => {
          moodByWeekday[day] = { great: 0, good: 0, okay: 0, low: 0, struggling: 0 }
        })
        
        moodHistory.forEach(entry => {
          const dayName = days[new Date(entry.date || entry.created_at).getDay()]
          if (moodByWeekday[dayName] && entry.mood) {
            moodByWeekday[dayName][entry.mood]++
          }
        })
        
        // Convert to chart data - most common mood per day
        const moodByWeekdayChart = Object.entries(moodByWeekday).map(([day, moods]) => {
          const total = Object.values(moods).reduce((a, b) => a + b, 0)
          return {
            day,
            good: moods.great + moods.good,
            neutral: moods.okay,
            struggling: moods.low + moods.struggling,
            total
          }
        })

        // Calculate statistics
        const totalStress = moodHistory.reduce((sum, entry) => sum + (entry.stress_level || 0), 0)
        const avgStress = moodHistory.length > 0 ? (totalStress / moodHistory.length).toFixed(1) : 0
        
        // Find peak stress day
        const stressByDay = {}
        moodHistory.forEach(entry => {
          const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' })
          stressByDay[day] = (stressByDay[day] || []).concat(entry.stress_level || 0)
        })
        const dayAverages = Object.entries(stressByDay).map(([day, values]) => ({
          day,
          avg: values.reduce((a, b) => a + b, 0) / values.length
        }))
        const peakDay = dayAverages.sort((a, b) => b.avg - a.avg)[0]?.day || 'N/A'
        
        // Determine trend
        const recent = moodHistory.slice(-7).reduce((sum, e) => sum + (e.mood === 'great' ? 5 : e.mood === 'good' ? 4 : e.mood === 'okay' ? 3 : e.mood === 'low' ? 2 : 1), 0) / 7
        const older = moodHistory.slice(0, 7).reduce((sum, e) => sum + (e.mood === 'great' ? 5 : e.mood === 'good' ? 4 : e.mood === 'okay' ? 3 : e.mood === 'low' ? 2 : 1), 0) / 7
        const trend = recent > older ? 'Improving' : recent < older ? 'Declining' : 'Stable'
        
        // Calculate burnout risk
        // Based on: high stress (>7), declining mood, consecutive struggling days
        const recentStress = moodHistory.slice(-7)
        const highStressDays = recentStress.filter(m => (m.stress_level || 0) > 7).length
        const strugglingDays = recentStress.filter(m => m.mood === 'struggling' || m.mood === 'low').length
        
        let burnoutRisk = 'Low'
        if (avgStress > 7 && strugglingDays >= 4) {
          burnoutRisk = 'High'
        } else if (avgStress > 6 || highStressDays >= 4 || strugglingDays >= 3) {
          burnoutRisk = 'Moderate'
        } else if (avgStress > 5 || strugglingDays >= 2) {
          burnoutRisk = 'Low-Moderate'
        }

        setStats({ avgStress, peakDay, trend, burnoutRisk })
        setInsights({
          moodDistribution,
          stressTrend,
          moodByWeekday: moodByWeekdayChart,
          isEmpty: false
        })
      } catch (error) {
        console.error('Error loading insights:', error)
        setInsights({ isEmpty: true, moodDistribution: [], stressTrend: [], moodByWeekday: [] })
      }
    }

    loadInsights()
  }, [user, navigate])

  if (!user || !insights) return null

  if (insights.isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-medium text-gray-900 mb-2">Your Insights</h1>
            <p className="text-lg text-gray-600">Understanding your emotional patterns</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">No Data Yet</h2>
            <p className="text-gray-600 mb-6">Start tracking your mood to see insights and patterns</p>
            <a href="/mood-tracking" className="btn-primary inline-block">Start Tracking</a>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Your Insights</h1>
          <p className="text-lg text-gray-600">
            Understanding your emotional patterns
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <TrendingUp className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Mood Trend</p>
            <p className="text-2xl font-medium text-gray-900">{stats.trend}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <Activity className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Avg Stress</p>
            <p className="text-2xl font-medium text-gray-900">{stats.avgStress}/10</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <Calendar className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Peak Stress Day</p>
            <p className="text-2xl font-medium text-gray-900">{stats.peakDay}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <AlertCircle className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Burnout Risk</p>
            <p className={`text-2xl font-medium ${
              stats.burnoutRisk === 'High' ? 'text-red-600' : 
              stats.burnoutRisk === 'Moderate' ? 'text-orange-600' : 
              stats.burnoutRisk === 'Low-Moderate' ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {stats.burnoutRisk}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-xl font-medium text-gray-900 mb-6">Mood Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insights.moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {insights.moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Stress Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-medium text-gray-900 mb-6">Weekly Stress Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={insights.stressTrend}>
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Mood by Weekday */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6">Mood Patterns by Weekday</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.moodByWeekday}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="good" stackId="a" fill="#10b981" name="Great/Good" radius={[0, 0, 0, 0]} />
              <Bar dataKey="neutral" stackId="a" fill="#eab308" name="Okay" radius={[0, 0, 0, 0]} />
              <Bar dataKey="struggling" stackId="a" fill="#ef4444" name="Low/Struggling" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">Shows which days of the week you tend to feel better or worse</p>
        </motion.div>

        {/* Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-primary-50 border-primary-100 mt-8"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-4">AI Insights</h2>
          <div className="space-y-3 text-gray-700">
            <p>✓ Your mood trend is currently: <strong>{stats.trend}</strong></p>
            <p>✓ Average stress level: <strong>{stats.avgStress}/10</strong></p>
            <p>✓ You experience peak stress on <strong>{stats.peakDay}s</strong></p>
            <p>✓ Track your mood consistently to identify more patterns</p>
            <p className="text-sm text-primary-700 mt-4">
              💡 Suggestion: Consider planning lighter activities or self-care on your high-stress days to maintain balance
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
