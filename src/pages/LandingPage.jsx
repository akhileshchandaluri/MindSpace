import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Shield, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: MessageCircle,
      title: 'Chat with MindSpace',
      description: 'Have natural conversations about your emotions in a safe, judgment-free space'
    },
    {
      icon: TrendingUp,
      title: 'Understand Emotions',
      description: 'Get insights into your emotional patterns and stress triggers over time'
    },
    {
      icon: Sparkles,
      title: 'Get Gentle Guidance',
      description: 'Receive personalized wellbeing suggestions and coping strategies'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-500" />
              </div>
              <span className="text-xl font-medium text-gray-900">MindSpace</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link to="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
                Resources
              </Link>
              <Link to="/auth" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              <span>Anonymous • Safe • Student-Only</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-medium text-gray-900 leading-tight">
              A calm digital space<br />
              <span className="text-primary-500">for students</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Understand your emotions, manage stress, and find peace through gentle AI-guided conversations
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/chat" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                <span>Start Chat</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/mood-tracking" className="btn-secondary text-lg px-8 py-4">
                Check My Wellbeing
              </Link>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500 pt-4"
            >
              This platform is designed exclusively for students
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft animation-delay-200"></div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to better emotional wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Safety */}
      <section className="py-24 bg-primary-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card text-center"
          >
            <Shield className="w-12 h-12 text-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl font-medium text-gray-900 mb-4">
              Your Privacy is Sacred
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>✓ Complete anonymity option available</p>
              <p>✓ Your conversations are private and secure</p>
              <p>✓ No personal data shared without consent</p>
              <p>✓ This is not medical advice or therapy</p>
              <p className="text-sm text-gray-500 pt-4">
                MindSpace is designed to help you understand emotions, not replace professional mental health support
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900">
              Ready to find your calm?
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of students finding emotional clarity
            </p>
            <Link to="/auth" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary-500" />
              <span className="text-gray-600">MindSpace © 2026</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link to="/resources" className="hover:text-gray-900 transition-colors">Resources</Link>
              <Link to="/feedback" className="hover:text-gray-900 transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
