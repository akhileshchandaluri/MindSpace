import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity, Calendar, AlertCircle } from 'lucide-react'
import { getSecureMoods } from '../lib/secureDatabase'

export default function InsightsPage({ user }) {
  const navigate = useNavigate()
  const [insights, setInsights] = useState(null)

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
            stressSources: [],
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
    const today = new Date().getDay()
    
        for (let i = 6; i >= 0; i--) {
          const dayIndex = (today - i + 7) % 7
          const dayData = moodHistory.filter((_, idx) => idx >= moodHistory.length - 7 + (6 - i))[0]
          stressTrend.push({
            day: days[dayIndex],
            stress: dayData?.stress_level || dayData?.stress || 0
          })
        }

        // Mock stress sources (this would need chat analysis in production)
        const stressSources = [
          { source: 'Not enough data', count: 1 }
        ]

        setInsights({
          moodDistribution,
          stressTrend,
          stressSources,
          isEmpty: false
        })
      } catch (error) {
        console.error('Error loading insights:', error)
        setInsights({ isEmpty: true, moodDistribution: [], stressTrend: [], stressSources: [] })
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
            <p className="text-2xl font-medium text-gray-900">Improving</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <Activity className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Avg Stress</p>
            <p className="text-2xl font-medium text-gray-900">5.6/10</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <Calendar className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Peak Stress Day</p>
            <p className="text-2xl font-medium text-gray-900">Thursday</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <AlertCircle className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Burnout Risk</p>
            <p className="text-2xl font-medium text-yellow-600">Moderate</p>
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

        {/* Stress Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6">Top Stress Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.stressSources}>
              <XAxis dataKey="source" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
            <p>✓ Your mood has been trending upward over the past week</p>
            <p>✓ Stress levels peak on Thursdays - consider planning lighter activities</p>
            <p>✓ Academic pressure is your primary stress source</p>
            <p>✓ Weekend stress levels are significantly lower - good self-care pattern</p>
            <p className="text-sm text-primary-700 mt-4">
              💡 Suggestion: Try breaking down large assignments earlier in the week to reduce Thursday stress
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
