import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { Send, Bot, User, AlertCircle, Heart } from 'lucide-react'

export default function ChatbotPage({ user }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [showCrisisWarning, setShowCrisisWarning] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Load chat history
    const savedMessages = localStorage.getItem(`chat_${user.id}`)
    if (savedMessages && savedMessages !== 'undefined') {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed)
      } catch (e) {
        console.error('Failed to load chat history:', e)
        setWelcomeMessage()
      }
    } else {
      setWelcomeMessage()
    }
  }, [user, navigate])

  const setWelcomeMessage = () => {
    const welcomeMsg = [{
      id: Date.now(),
      type: 'bot',
      content: `Hello${user?.isAnonymous ? '' : `, ${user?.email?.split('@')[0]}`}. I'm MindSpace, your emotional wellbeing companion. This is a safe, judgment-free space. How are you feeling today?`,
      timestamp: Date.now()
    }]
    setMessages(welcomeMsg)
    localStorage.setItem(`chat_${user.id}`, JSON.stringify(welcomeMsg))
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const detectEmotionFromText = (text) => {
    const lowerText = text.toLowerCase()
    
    // Crisis keywords detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'die', 'hurt myself', 'self-harm']
    if (crisisKeywords.some(keyword => lowerText.includes(keyword))) {
      return { emotion: 'crisis', stress: 10 }
    }

    // Emotion detection
    const emotions = {
      anxious: ['anxious', 'worried', 'nervous', 'panic', 'overwhelmed', 'stressed'],
      sad: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely'],
      angry: ['angry', 'frustrated', 'mad', 'irritated', 'annoyed'],
      happy: ['happy', 'good', 'great', 'excited', 'joyful', 'content'],
      tired: ['tired', 'exhausted', 'drained', 'burnout', 'fatigued']
    }

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        const stress = ['anxious', 'sad', 'angry'].includes(emotion) ? 7 : 3
        return { emotion, stress }
      }
    }

    return { emotion: 'neutral', stress: 5 }
  }

  const generateResponse = (userMessage) => {
    const { emotion, stress } = detectEmotionFromText(userMessage)

    // Crisis response
    if (emotion === 'crisis') {
      setShowCrisisWarning(true)
      return `I'm really concerned about what you've shared. Your safety is the most important thing right now. Please reach out immediately to:

• KIRAN Mental Health Helpline: 1800-599-0019
• Vandrevala Foundation: 9999 666 555
• Emergency Services: 112

These professionals are trained to help and available 24/7. You don't have to face this alone.`
    }

    // Emotion-based responses
    const responses = {
      anxious: [
        "I hear that you're feeling anxious. That's a really common feeling, especially for students. Would you like to talk about what's making you feel this way?",
        "Anxiety can feel overwhelming. Let's take this one step at a time. Can you tell me what's been weighing on your mind?",
        "Thank you for sharing that you're feeling anxious. What specific situations or thoughts are contributing to this feeling?"
      ],
      sad: [
        "I'm sorry you're feeling down. It's okay to not be okay sometimes. Would you like to share what's been happening?",
        "Sadness can be really heavy to carry. I'm here to listen without judgment. What's been on your mind?",
        "Thank you for trusting me with how you're feeling. When did you start noticing these feelings?"
      ],
      angry: [
        "It sounds like something has really frustrated you. Anger is a valid emotion. What happened that made you feel this way?",
        "I can sense your frustration. Would you like to talk about what triggered these feelings?",
        "It's okay to feel angry. Let's explore what's behind these feelings together."
      ],
      happy: [
        "That's wonderful to hear! I'm glad you're feeling good. What's been going well for you?",
        "It's great to hear positive energy from you! What's bringing you joy today?",
        "I love hearing that you're feeling good! Would you like to share what's making you happy?"
      ],
      tired: [
        "Burnout and exhaustion are common among students. You're not alone in feeling this way. What's been draining your energy?",
        "It sounds like you've been carrying a lot. Let's talk about what's been taking up your energy.",
        "Feeling tired isn't just physical - emotional exhaustion is real too. What's been overwhelming you?"
      ],
      neutral: [
        "I'm here and listening. Can you tell me more about what's on your mind?",
        "Thank you for sharing. How have things been going for you lately?",
        "I'm here for you. What would you like to talk about today?"
      ]
    }

    const emotionResponses = responses[emotion] || responses.neutral
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateResponse(input)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: Date.now()
      }

      const updatedMessages = [...newMessages, botMessage]
      setMessages(updatedMessages)
      localStorage.setItem(`chat_${user.id}`, JSON.stringify(updatedMessages))
      setIsTyping(false)

      // Update mood tracking
      const { emotion, stress } = detectEmotionFromText(input)
      const moodData = {
        mood: emotion,
        stress,
        timestamp: Date.now()
      }
      
      // Save to history
      const dayIndex = Math.floor((Date.now() - (user.createdAt || Date.now())) / (1000 * 60 * 60 * 24))
      localStorage.setItem(`mood_day_${user.id}_${dayIndex}`, JSON.stringify(moodData))
      localStorage.setItem(`mood_${user.id}`, JSON.stringify(moodData))
    }, 1000 + Math.random() * 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!user) return null

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Crisis Warning Modal */}
      <AnimatePresence>
        {showCrisisWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCrisisWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 mb-4 text-center">
                We're Concerned About You
              </h2>
              <div className="space-y-3 text-gray-700 mb-6">
                <p className="font-medium">Please reach out immediately:</p>
                <p>🆘 KIRAN Helpline: <strong>1800-599-0019</strong></p>
                <p>💬 Vandrevala Foundation: <strong>9999 666 555</strong></p>
                <p>🚨 Emergency Services: <strong>112</strong></p>
              </div>
              <button
                onClick={() => setShowCrisisWarning(false)}
                className="w-full btn-primary"
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">MindSpace</h1>
              <p className="text-sm text-gray-500">Your emotional wellbeing companion</p>
            </div>
          </div>
          <Heart className="w-6 h-6 text-primary-500" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-2xl ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-gray-100' : 'bg-primary-100'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-5 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3 max-w-2xl"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-500" />
              </div>
              <div className="bg-gray-50 rounded-2xl px-5 py-3">
                <div className="flex space-x-2">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share how you're feeling... (Press Enter to send)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This is not therapy or medical advice. For emergencies, call 1800-599-0019 or 112.
          </p>
        </div>
      </div>
    </div>
  )
}
