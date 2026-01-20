import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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

        {/* About the Creator - College Initiative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card mb-6 bg-gradient-to-br from-primary-50 to-white border-primary-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-gray-900">A Student Initiative</h2>
              <p className="text-sm text-primary-600">Built with empathy, for students</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              MindSpace was born out of a deeply personal understanding of student mental health challenges. 
              Many students today face overwhelming academic pressure, social anxiety, loneliness, and depression—often 
              suffering in silence. The sad reality is that mental health struggles have become alarmingly common on 
              college campuses, yet access to timely support remains limited.
            </p>

            <div className="bg-white p-4 rounded-lg border border-primary-100">
              <p className="text-gray-800 italic mb-3">
                "I've been there. I've felt the crushing weight of academic stress, the loneliness of being surrounded 
                by people yet feeling completely alone. I realized that many of my peers were silently battling similar 
                struggles, unable to find immediate support when they needed it most. That's when I knew something had 
                to change."
              </p>
              <p className="text-sm text-gray-600">
                — The motivation behind MindSpace
              </p>
            </div>

            <div className="pt-4 border-t border-primary-100">
              <h3 className="text-lg font-medium text-gray-900 mb-3">About the Project</h3>
              <p className="leading-relaxed mb-4">
                MindSpace was developed as part of the <span className="font-semibold text-primary-700">Design 
                Thinking Lab (DTL)</span> course initiative at <span className="font-semibold text-primary-700">
                RV College of Engineering (RVCE)</span>. This project represents the culmination of technical expertise, 
                empathy-driven design, and a genuine commitment to making mental health support more accessible to students.
              </p>

              <div className="bg-gradient-to-r from-primary-100 to-blue-50 p-5 rounded-lg mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Created By</h4>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <span className="font-bold text-primary-700 text-lg">Naga Venkata Akhilesh Chandaluri</span>
                  </p>
                  <p className="text-gray-700">
                    Computer Science & AIML, 2nd Year<br />
                    RV College of Engineering, Bangalore
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Technical Excellence</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  This platform showcases cutting-edge technologies including React 18, Supabase for real-time 
                  database management, Groq's Llama 3.3 70B AI model for empathetic conversations, and a carefully 
                  crafted user experience designed with students' mental wellbeing in mind. Every feature—from mood 
                  tracking to AI-powered emotional support—was built with privacy, ethics, and genuine care at its core.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  What sets MindSpace apart is not just the technology, but the <span className="font-semibold">deep 
                  understanding of student struggles</span> that guided every design decision. This isn't just a 
                  technical project—it's a mission to make mental health support accessible, immediate, and judgment-free 
                  for every student who needs it.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Connect & Contribute</h4>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="mailto:nvakhileshc.ai24@rvce.edu.in"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <span>📧</span>
                    <span>Email</span>
                  </a>
                  <a 
                    href="https://github.com/akhileshchandaluri"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <span>💻</span>
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/akhilesh-chandaluri-b8a87b292"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <span>💼</span>
                    <span>LinkedIn</span>
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Open to collaborations, feedback, and conversations about mental health tech
                </p>
              </div>
            </div>

            <div className="bg-primary-100 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-primary-800">A Note of Gratitude:</span> This project wouldn't 
                have been possible without the support of RVCE's Design Thinking Lab initiative, which empowers 
                students to build solutions for real-world problems. MindSpace is proof that when technology meets 
                empathy, we can create tools that truly make a difference in people's lives.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card text-center bg-primary-50 border-primary-100"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Questions or Concerns?</h2>
          <p className="text-gray-700 mb-4">
            We're committed to creating the best possible experience for students.
          </p>
          <Link to="/feedback" className="text-primary-600 hover:text-primary-700 font-medium">
            Share your feedback →
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>MindSpace © 2026 • Designed for students, by a student who understands</p>
          <p className="mt-2">A Design Thinking Lab Initiative • RV College of Engineering</p>
        </motion.div>
      </div>
    </div>
  )
}
