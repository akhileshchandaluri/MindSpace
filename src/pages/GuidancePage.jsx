import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { Heart, Target, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { saveGoal, getGoals, updateGoal } from '../lib/database'

export default function GuidancePage({ user }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [selectedGoals, setSelectedGoals] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const loadGoals = async () => {
      try {
        const data = await getGoals()
        const completedGoals = data.filter(g => g.completed).map(g => g.title)
        setSelectedGoals(completedGoals)
      } catch (error) {
        console.error('Failed to load goals:', error)
      }
    }

    loadGoals()
  }, [user, navigate])

  const copingStrategies = [
    {
      category: 'Quick Relief',
      strategies: [
        { title: 'Deep Breathing', description: 'Take 5 slow, deep breaths', duration: '1 min' },
        { title: '5-4-3-2-1 Grounding', description: 'Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste', duration: '2 mins' },
        { title: 'Progressive Relaxation', description: 'Tense and release each muscle group', duration: '5 mins' },
        { title: 'Cold Water Splash', description: 'Splash cold water on your face to reset', duration: '30 secs' }
      ]
    },
    {
      category: 'Daily Practices',
      strategies: [
        { title: 'Morning Routine', description: 'Start your day with 10 minutes of calm', duration: '10 mins' },
        { title: 'Movement Break', description: 'Stretch or walk for a few minutes', duration: '5-10 mins' },
        { title: 'Gratitude Practice', description: 'Write down 3 things you\'re grateful for', duration: '3 mins' },
        { title: 'Digital Detox', description: 'Take a break from screens before bed', duration: '30 mins' }
      ]
    },
    {
      category: 'Long-term Wellbeing',
      strategies: [
        { title: 'Sleep Hygiene', description: 'Maintain consistent sleep schedule', duration: 'Daily' },
        { title: 'Social Connection', description: 'Reach out to friends or family', duration: 'Weekly' },
        { title: 'Creative Expression', description: 'Engage in art, music, or writing', duration: 'Weekly' },
        { title: 'Physical Activity', description: 'Exercise or move your body', duration: '3-5x/week' }
      ]
    }
  ]

  const weeklyGoals = [
    'Practice deep breathing daily',
    'Journal 3 times this week',
    'Connect with a friend',
    'Get 7+ hours of sleep',
    'Take regular study breaks',
    'Try one new coping strategy'
  ]

  const toggleGoal = async (goal) => {
    const isCompleted = selectedGoals.includes(goal)
    
    try {
      if (!isCompleted) {
        await saveGoal({
          title: goal,
          description: '',
          category: 'weekly',
          targetDate: null
        })
        await updateGoal(null, { completed: true })
        setSelectedGoals([...selectedGoals, goal])
        toast.success('Goal added! Keep going!')
      } else {
        setSelectedGoals(selectedGoals.filter(g => g !== goal))
      }
      
      if (!isCompleted && selectedGoals.length + 1 === weeklyGoals.length) {
        toast.success('🎉 All goals completed! Amazing work!')
      }
    } catch (error) {
      console.error('Failed to toggle goal:', error)
      toast.error('Failed to update goal')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Wellbeing Guidance</h1>
          <p className="text-lg text-gray-600">
            Personalized strategies to support your emotional health
          </p>
        </motion.div>

        {/* Coping Strategies */}
        {copingStrategies.map((section, sectionIndex) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span>{section.category}</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {section.strategies.map((strategy, index) => (
                <motion.div
                  key={strategy.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{strategy.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {strategy.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{strategy.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Weekly Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-primary-50 border-primary-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-medium text-gray-900">Your Weekly Goals</h2>
            </div>
            <span className="text-sm text-primary-700 font-medium">
              {selectedGoals.length}/{weeklyGoals.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {weeklyGoals.map((goal, index) => (
              <motion.button
                key={goal}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => toggleGoal(goal)}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${
                  selectedGoals.includes(goal)
                    ? 'bg-white border-2 border-primary-500'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedGoals.includes(goal)
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}>
                  {selectedGoals.includes(goal) && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={`text-left ${
                  selectedGoals.includes(goal)
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-700'
                }`}>
                  {goal}
                </span>
              </motion.button>
            ))}
          </div>

          {selectedGoals.length === weeklyGoals.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            >
              <p className="text-green-800 font-medium">
                🎉 Amazing! You've completed all your weekly goals!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Personalized Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mt-8 bg-gradient-to-r from-primary-50 to-white border-primary-100"
        >
          <div className="flex items-start space-x-4">
            <Heart className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                Your Personalized Tip for Today
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Based on your recent stress patterns, we recommend taking a 5-minute break every hour 
                during study sessions. This can help prevent burnout and improve focus.
              </p>
              <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium">
                <span>Try this now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
