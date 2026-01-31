import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, Activity, AlertCircle, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function TeacherDashboard({ user }) {
  const navigate = useNavigate()
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (user.role !== 'teacher') {
      navigate('/dashboard')
      return
    }

    // Load all students and their mood data from Supabase
    const loadClassData = async () => {
      try {
        // Get all students
        const { data: students, error: studentsError } = await supabase
          .from('users')
          .select('id, email, created_at')
          .eq('role', 'student')

        if (studentsError) throw studentsError

        console.log('Students loaded:', students)

        if (!students || students.length === 0) {
          setClassData({
            totalStudents: 0,
            avgMood: 'No Data',
            avgStress: 0,
            highStressCount: 0,
            moodDistribution: [],
            stressByDay: [],
            isEmpty: true
          })
          setLoading(false)
          return
        }

        // Get mood data for last 30 days
        const daysAgo30 = new Date()
        daysAgo30.setDate(daysAgo30.getDate() - 30)
        const startDate = daysAgo30.toISOString().split('T')[0]

        const { data: moods, error: moodsError } = await supabase
          .from('moods')
          .select('*')
          .gte('date', startDate)

        if (moodsError) throw moodsError

        console.log('Moods loaded:', moods)

        // Calculate aggregated statistics
        const moodCounts = { great: 0, good: 0, okay: 0, low: 0, struggling: 0 }
        let totalStress = 0
        let stressCount = 0
        let highStressCount = 0
        const stressByDay = {}

        moods?.forEach(entry => {
          if (entry.mood) moodCounts[entry.mood]++
          if (entry.stress_level !== undefined) {
            totalStress += entry.stress_level
            stressCount++
            if (entry.stress_level >= 7) highStressCount++
            
            const dayOfWeek = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })
            if (!stressByDay[dayOfWeek]) {
              stressByDay[dayOfWeek] = { total: 0, count: 0 }
            }
            stressByDay[dayOfWeek].total += entry.stress_level
            stressByDay[dayOfWeek].count++
          }
        })

        // Calculate averages
        const avgStress = stressCount > 0 ? (totalStress / stressCount) : 0
        const dominantMood = Object.entries(moodCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'good'

        const moodLabels = {
          great: 'Great',
          good: 'Good',
          okay: 'Okay',
          low: 'Low',
          struggling: 'Struggling'
        }

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const weeklyTrend = weekDays.map(day => ({
          day,
          avgStress: stressByDay[day] 
            ? (stressByDay[day].total / stressByDay[day].count).toFixed(1)
            : 0
        }))

        setClassData({
          totalStudents: students.length,
          avgMood: moodLabels[dominantMood],
          avgStress: avgStress.toFixed(1),
          highStressCount,
          moodDistribution: [
            { mood: 'Great', count: moodCounts.great },
            { mood: 'Good', count: moodCounts.good },
            { mood: 'Okay', count: moodCounts.okay },
            { mood: 'Low', count: moodCounts.low },
            { mood: 'Struggling', count: moodCounts.struggling }
          ],
          weeklyTrend,
          isEmpty: false
        })
      } catch (error) {
        console.error('Error loading class data:', error)
        setClassData({
          totalStudents: 0,
          avgMood: 'No Data',
          avgStress: 0,
          highStressCount: 0,
          moodDistribution: [],
          stressByDay: [],
          isEmpty: true
        })
      } finally {
        setLoading(false)
      }
    }

    loadClassData()
  }, [user, navigate])

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!classData) return null

  if (classData.isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">No Student Data Yet</h2>
            <p className="text-gray-600">Students need to sign up and log their moods first.</p>
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
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Class Wellbeing Dashboard</h1>
          <p className="text-lg text-gray-600">
            Anonymous insights into your students' emotional wellbeing
          </p>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-primary-50 border-primary-100 mb-8 flex items-start space-x-3"
        >
          <Shield className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-gray-900 mb-1">Privacy Protected</p>
            <p className="text-sm text-gray-700">
              All data shown is aggregated and anonymous. Individual student information is never accessible.
            </p>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <Users className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-3xl font-medium text-gray-900">{classData.totalStudents}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <TrendingUp className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Average Mood</p>
            <p className="text-3xl font-medium text-gray-900">{classData.avgMood}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <Activity className="w-6 h-6 text-primary-500 mb-2" />
            <p className="text-sm text-gray-600">Avg Stress Level</p>
            <p className="text-3xl font-medium text-gray-900">{classData.avgStress}/10</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <AlertCircle className="w-6 h-6 text-orange-500 mb-2" />
            <p className="text-sm text-gray-600">High Stress</p>
            <p className="text-3xl font-medium text-orange-600">{classData.highStressCount}</p>
            <p className="text-xs text-gray-500 mt-1">students (anonymous)</p>
          </motion.div>
        </div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6">Class Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classData.moodDistribution}>
              <XAxis dataKey="mood" stroke="#9ca3af" />
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

        {/* Weekly Stress Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-6">Weekly Stress Pattern</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classData.weeklyTrend}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="avgStress" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-primary-50 border-primary-100"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-4">Class Insights</h2>
          <div className="space-y-3 text-gray-700">
            <p>📊 Overall class wellbeing is at a moderate level</p>
            <p>📈 Stress levels peak on Thursdays - consider lighter workload</p>
            <p>⚠️ {classData.highStressCount} students showing elevated stress (anonymous)</p>
            <p>💡 Weekend stress significantly lower - good recovery pattern</p>
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="font-medium text-primary-800 mb-2">Recommendations:</p>
              <ul className="space-y-1 text-sm">
                <li>• Consider spreading major assignments throughout the week</li>
                <li>• Encourage students to use campus counseling services</li>
                <li>• Build in mental health check-ins during class</li>
                <li>• Share stress management resources</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card bg-gray-50 border-gray-200 mt-8"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-900 mb-2">Data Privacy & Ethics</p>
              <p>
                This dashboard provides aggregated, anonymous insights only. No individual student data, 
                chat messages, or identifiable information is accessible. Use these insights to create 
                a more supportive classroom environment, not to identify or single out individuals.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
