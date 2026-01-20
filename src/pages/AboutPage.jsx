import { motion } from 'framer-motion'
import { Heart, Shield, Eye, Lock, CheckCircle, AlertCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl font-medium text-gray-900 mb-2">About MindSpace</h1>
          <p className="text-lg text-gray-600">
            A calm digital space for students to understand their emotions
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            MindSpace is designed exclusively for students to help them understand their emotions, 
            manage stress, and find emotional clarity in a safe, judgment-free environment. We believe 
            that every student deserves access to tools that support their mental wellbeing, especially 
            during the challenging years of academic life.
          </p>
        </motion.div>

        {/* What MindSpace Is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span>What MindSpace Is</span>
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>A safe space to explore and understand your emotions</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>An AI-powered chatbot for empathetic conversations about feelings</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Tools to track mood patterns and stress levels</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>Gentle guidance and coping strategies for wellbeing</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-primary-500 mt-1">✓</span>
              <span>A completely private and anonymous option</span>
            </li>
          </ul>
        </motion.div>

        {/* What MindSpace Is NOT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-6 bg-red-50 border-red-100"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span>What MindSpace Is NOT</span>
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start space-x-3">
              <span className="text-red-500 mt-1">✗</span>
              <span>Not a replacement for professional therapy or medical care</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-red-500 mt-1">✗</span>
              <span>Not a crisis intervention service</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-red-500 mt-1">✗</span>
              <span>Not able to diagnose mental health conditions</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-red-500 mt-1">✗</span>
              <span>Not a substitute for human connection and support</span>
            </li>
          </ul>
        </motion.div>

        {/* Privacy & Ethics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary-500" />
            <span>Privacy & Data Ethics</span>
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Your Data is Protected</p>
                <p className="text-sm">All conversations and journal entries are encrypted and stored securely. We never sell or share your personal data.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Anonymous Usage Option</p>
                <p className="text-sm">You can use MindSpace completely anonymously. No email or personal information required.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-1">Aggregated Analytics Only</p>
                <p className="text-sm">Teachers/mentors see only aggregated, anonymous class-level data. Individual student information is never accessible.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Technology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4">AI Technology</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            MindSpace uses a pre-trained AI chatbot designed to understand emotional language and respond 
            empathetically. The AI is trained to:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Recognize emotional patterns in conversation</li>
            <li>• Respond with empathy and without judgment</li>
            <li>• Detect crisis keywords and provide emergency resources</li>
            <li>• Never diagnose or provide medical advice</li>
            <li>• Maintain appropriate boundaries</li>
          </ul>
        </motion.div>

        {/* System Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card mb-6 bg-gray-50"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4">System Limitations</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We believe in complete transparency about what MindSpace can and cannot do:
          </p>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• The AI is not a mental health professional and cannot provide clinical diagnosis</li>
            <li>• Responses are based on patterns, not deep psychological understanding</li>
            <li>• The system may not always understand complex emotional situations</li>
            <li>• Crisis detection is not 100% accurate - always seek help if you're in distress</li>
            <li>• This platform works best as a complement to, not replacement for, professional support</li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card text-center bg-primary-50 border-primary-100"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Questions or Concerns?</h2>
          <p className="text-gray-700 mb-4">
            We're committed to creating the best possible experience for students.
          </p>
          <a href="/feedback" className="text-primary-600 hover:text-primary-700 font-medium">
            Share your feedback →
          </a>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>MindSpace © 2026 • Designed for students, by students</p>
          <p className="mt-2">This platform is designed exclusively for students</p>
        </motion.div>
      </div>
    </div>
  )
}
