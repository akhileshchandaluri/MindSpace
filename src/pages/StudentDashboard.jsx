import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import OnboardingModal from '../components/OnboardingModal'
import { saveMood, getMoods } from '../lib/database'
import { 
  MessageCircle, TrendingUp, BookOpen, Heart, 
  Smile, Meh, Frown, Activity, ArrowRight 
} from 'lucide-react'

export default function StudentDashboard({ user }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [currentMood, setCurrentMood] = useState(null)
  const [stressLevel, setStressLevel] = useState(5)
  const [showStressSlider, setShowStressSlider] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Load today's mood from Supabase
    const loadTodayMood = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const moods = await getMoods(today, today)
        if (moods && moods.length > 0) {
          const latestMood = moods[0]
          setCurrentMood(latestMood.mood)
          setStressLevel(latestMood.stress_level || 5)
        }
      } catch (error) {
        console.error('Error loading mood:', error)
      }
    }

    loadTodayMood()
  }, [user, navigate])

  if (!user) return null

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Talk to MindSpace',
      description: 'Share how you\'re feeling today',
      link: '/chat',
      color: 'primary'
    },
    {
      icon: TrendingUp,
      title: 'View Insights',
      description: 'See your emotional patterns',
      link: '/insights',
      color: 'primary'
    },
    {
      icon: BookOpen,
      title: 'Journal',
      description: 'Write your thoughts',
      link: '/journal',
      color: 'primary'
    },
    {
      icon: Heart,
      title: 'Wellbeing Tips',
      description: 'Get personalized guidance',
      link: '/guidance',
      color: 'primary'
    }
  ]

  const moodOptions = [
    { icon: Smile, label: 'Great', value: 'great', color: 'text-green-500' },
    { icon: Smile, label: 'Good', value: 'good', color: 'text-blue-500' },
    { icon: Meh, label: 'Okay', value: 'okay', color: 'text-yellow-500' },
    { icon: Frown, label: 'Low', value: 'low', color: 'text-orange-500' },
    { icon: Frown, label: 'Struggling', value: 'struggling', color: 'text-red-500' }
  ]

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood.value)
    setShowStressSlider(true)
  }

  const handleSaveMoodAndStress = async () => {
    try {
      const now = new Date()
      const dateKey = now.toISOString().split('T')[0]
      
      const moodData = {
        mood: currentMood,
        stressLevel: stressLevel,
        energyLevel: 5, // Default value
        note: '',
        activities: [],
        date: dateKey
      }
      
      // Save to Supabase
      await saveMood(moodData)
      
      toast.success('Mood and stress level saved!')
      setShowStressSlider(false)
    } catch (error) {
      console.error('Error saving mood:', error)
      toast.error('Failed to save mood. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <OnboardingModal user={user} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">
            Welcome back{user?.isAnonymous ? '' : user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="text-lg text-gray-600">
            How are you feeling today?
          </p>
        </motion.div>

        {/* Mood Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-1">Today's Check-in</h2>
              <p className="text-gray-600">Take a moment to reflect on how you're feeling</p>
            </div>
            <Activity className="w-8 h-8 text-primary-500" />
          </div>

          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((mood, index) => (
              <motion.button
                key={mood.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  currentMood === mood.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <mood.icon className={`w-8 h-8 mb-2 ${mood.color}`} />
                <span className="text-sm font-medium text-gray-700">{mood.label}</span>
              </motion.button>
            ))}
          </div>

          {showStressSlider && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <div className="p-6 bg-white rounded-xl border-2 border-primary-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">How stressed are you feeling?</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>No stress</span>
                    <span className="font-medium text-lg text-primary-600">{stressLevel}/10</span>
                    <span>Very stressed</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    style={{
                      background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${stressLevel * 10}%, #e5e7eb ${stressLevel * 10}%, #e5e7eb 100%)`
                    }}
                  />
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveMoodAndStress}
                      className="flex-1 btn-primary"
                    >
                      Save Check-in
                    </button>
                    <button
                      onClick={() => {
                        setCurrentMood(null)
                        setShowStressSlider(false)
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!showStressSlider && currentMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-primary-50 rounded-lg"
            >
              <p className="text-sm text-primary-800">
                ✓ Mood logged for today. Keep tracking to see your patterns!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Current Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium">Today's Mood</h3>
              <Smile className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-medium text-gray-900 capitalize">
              {currentMood || 'Not set'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium">Stress Level</h3>
              <Activity className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-medium text-gray-900">
              {stressLevel}/10
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium">This Week</h3>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-medium text-gray-900">
              7 days tracked
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link to={action.link} className="card flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <action.icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helpful Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card bg-primary-50 border-primary-100 mt-8"
        >
          <div className="flex items-start space-x-4">
            <Heart className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Remember: You're not alone
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Taking time to understand your emotions is a sign of strength. If you're feeling overwhelmed, 
                please reach out to a mental health professional or use our{' '}
                <Link to="/resources" className="text-primary-600 hover:text-primary-700 font-medium">
                  support resources
                </Link>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
