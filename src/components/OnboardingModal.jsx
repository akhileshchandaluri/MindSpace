import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, TrendingUp, BookOpen, X } from 'lucide-react'

export default function OnboardingModal({ user }) {
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (user && !user.isAnonymous) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.id}`)
      if (!hasSeenOnboarding) {
        setShowModal(true)
      }
    }
  }, [user])

  const handleClose = () => {
    setShowModal(false)
    localStorage.setItem(`onboarding_${user.id}`, 'true')
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  const steps = [
    {
      icon: Heart,
      title: 'Welcome to MindSpace!',
      description: 'A calm, safe space designed exclusively for students to understand their emotions and manage stress.',
      color: 'text-primary-500'
    },
    {
      icon: MessageCircle,
      title: 'Chat with MindSpace',
      description: 'Share how you\'re feeling with our AI companion. It\'s judgment-free, empathetic, and always available.',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Track Your Patterns',
      description: 'Log your daily mood and stress levels to see patterns over time and understand what affects your wellbeing.',
      color: 'text-green-500'
    },
    {
      icon: BookOpen,
      title: 'Your Privacy Matters',
      description: 'All your data is private and secure. You can even use MindSpace completely anonymously if you prefer.',
      color: 'text-purple-500'
    }
  ]

  const currentStep = steps[step]

  return (
    <AnimatePresence>
      {showModal && (
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
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <currentStep.icon className={`w-8 h-8 ${currentStep.color}`} />
                </div>

                <h2 className="text-2xl font-medium text-gray-900 mb-3">
                  {currentStep.title}
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {currentStep.description}
                </p>
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === step
                        ? 'w-8 bg-primary-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 btn-primary"
                >
                  {step === steps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
