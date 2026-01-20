import { motion } from 'framer-motion'
import { Phone, Mail, AlertCircle, Heart, ExternalLink, Shield } from 'lucide-react'

export default function ResourcesPage() {
  const emergencyResources = [
    {
      name: 'National Emergency Helpline',
      contact: '112',
      description: '24/7 emergency services for immediate help',
      type: 'phone'
    },
    {
      name: 'KIRAN Mental Health Helpline',
      contact: '1800-599-0019',
      description: '24/7 toll-free mental health support',
      type: 'phone'
    },
    {
      name: 'Vandrevala Foundation',
      contact: '9999 666 555',
      description: '24/7 crisis support and counseling',
      type: 'phone'
    }
  ]

  const supportResources = [
    {
      name: 'RVCE Cadabam\'s Mental Health',
      contact: '097414 76476',
      description: 'Professional mental health support for students',
      hours: '24/7 Support Available',
      website: 'cadabamshospitals.com',
      highlight: true
    },
    {
      name: 'iCall - TISS Helpline',
      contact: '9152987821',
      description: 'Free counseling service by TISS Mumbai',
      hours: 'Mon-Sat 8am-10pm',
      website: 'icallhelpline.org'
    },
    {
      name: 'MPower 1on1',
      contact: '1800-120-820050',
      description: 'Mental health helpline and counseling',
      hours: '24/7',
      website: 'mpowerminds.com'
    },
    {
      name: 'Your College Counseling Center',
      contact: 'Check your institution',
      description: 'Most colleges offer free student counseling',
      hours: 'Campus hours',
      website: 'Contact your college office'
    }
  ]

  const whenToSeek = [
    'Persistent feelings of sadness or hopelessness lasting more than two weeks',
    'Thoughts of self-harm or suicide',
    'Significant changes in sleep, appetite, or energy levels',
    'Difficulty functioning in daily activities or academics',
    'Overwhelming anxiety or panic attacks',
    'Substance use to cope with emotions',
    'Withdrawal from friends, family, or activities you once enjoyed'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Support & Resources</h1>
          <p className="text-lg text-gray-600">
            You're not alone. Help is always available.
          </p>
        </motion.div>

        {/* Emergency Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-medium text-gray-900">Emergency Support</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {emergencyResources.map((resource, index) => (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card bg-red-50 border-red-200"
              >
                <Phone className="w-8 h-8 text-red-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {resource.name}
                </h3>
                <p className="text-2xl font-bold text-red-600 mb-2">
                  {resource.contact}
                </p>
                <p className="text-sm text-gray-700">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* General Support Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary-500" />
            <span>Mental Health Support</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {supportResources.map((resource, index) => (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`card ${resource.highlight ? 'bg-primary-50 border-2 border-primary-300' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {resource.name}
                  </h3>
                  {resource.website && resource.website !== 'Contact your college office' && (
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-primary-600 font-bold text-xl mb-2">{resource.contact}</p>
                <p className="text-gray-700 mb-2">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${resource.highlight ? 'text-primary-700 font-bold' : 'text-gray-500'}`}>
                    {resource.highlight ? '🟢 ' : ''}Hours: {resource.hours}
                  </p>
                </div>
                {resource.website && resource.website !== 'Contact your college office' && (
                  <p className="text-sm text-primary-500 mt-2">{resource.website}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* When to Seek Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-primary-50 border-primary-100 mb-8"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4">
            When Should I Seek Professional Help?
          </h2>
          <p className="text-gray-700 mb-4">
            It's important to reach out to a mental health professional if you experience:
          </p>
          <ul className="space-y-2">
            {whenToSeek.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-start space-x-3 text-gray-700"
              >
                <span className="text-primary-500 mt-1">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Mental Health Awareness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-4">
            Understanding Mental Health
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Mental health is just as important as physical health.</strong> Just like you would 
              see a doctor for a physical injury, it's important to seek help for emotional difficulties.
            </p>
            <p>
              <strong>It's okay to not be okay.</strong> Everyone struggles sometimes. Seeking help is a 
              sign of strength, not weakness.
            </p>
            <p>
              <strong>Recovery is possible.</strong> With the right support and treatment, people can and 
              do recover from mental health challenges.
            </p>
            <p>
              <strong>You deserve support.</strong> Your feelings are valid, and you deserve to feel better. 
              Don't hesitate to reach out.
            </p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-gray-50 border-gray-200 mt-8"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-900 mb-2">Important Disclaimer</p>
              <p>
                MindSpace is designed to help students understand their emotions and is <strong>not a substitute 
                for professional mental health care</strong>. We are not a crisis service. If you are in crisis 
                or experiencing a mental health emergency, please contact emergency services or one of the crisis 
                resources listed above immediately.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
