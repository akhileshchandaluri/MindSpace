import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { Send, Bot, User, AlertCircle, Heart, Shield, Info } from 'lucide-react'
import { getSafeChatResponse } from '../lib/safeChatbot'
import { detectEmotion } from '../lib/aiService'
import { saveSecureChatMessage, getSecureChatMessages } from '../lib/secureDatabase'
import DisclaimerBanner, { InlineDisclaimer, ConfidenceIndicator } from '../components/DisclaimerBanner'

export default function ChatbotPage({ user }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [showCrisisWarning, setShowCrisisWarning] = useState(false)
  const [showSafetyInfo, setShowSafetyInfo] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    // Load chat history from Supabase
    const loadMessages = async () => {
      try {
        if (!user?.id) {
          console.log('No user ID available')
          await setWelcomeMessage()
          return
        }
        
        console.log('Loading chat messages for user:', user.id)
        const chatHistory = await getSecureChatMessages(user.id)
        console.log('Chat history loaded:', chatHistory)
        
        if (chatHistory && chatHistory.length > 0) {
          setMessages(chatHistory.map(msg => ({
            id: msg.id,
            type: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.created_at).getTime()
          })))
        } else {
          console.log('No chat history, setting welcome message')
          await setWelcomeMessage()
        }
      } catch (error) {
        console.error('Error loading chat messages:', error)
        toast.error('Failed to load chat history')
        await setWelcomeMessage()
      }
    }
    
    loadMessages()
  }, [user, navigate])

  const setWelcomeMessage = async () => {
    try {      if (!user?.id) {
        console.error('Cannot set welcome message: user ID missing')
        return
      }
            const welcomeMsg = {
        id: Date.now(),
        type: 'bot',
        content: `Hello${user?.isAnonymous ? '' : `, ${user?.email?.split('@')[0]}`}. I'm MindSpace, your emotional wellbeing companion. This is a safe, judgment-free space. How are you feeling today?`,
        timestamp: Date.now()
      }
      setMessages([welcomeMsg])
      await saveSecureChatMessage(user.id, welcomeMsg.content, 'bot')
      console.log('Welcome message set')
    } catch (error) {
      console.error('Error setting welcome message:', error)
      // Still show welcome message even if save fails
      const welcomeMsg = {
        id: Date.now(),
        type: 'bot',
        content: `Hello. I'm MindSpace, your emotional wellbeing companion. This is a safe, judgment-free space. How are you feeling today?`,
        timestamp: Date.now()
      }
      setMessages([welcomeMsg])
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return
    if (!user?.id) {
      toast.error('Please log in to continue')
      return
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    const userInput = input
    setInput('')
    setIsTyping(true)

    try {
      await saveSecureChatMessage(user.id, userInput, 'user')
    } catch (error) {
      console.error('Failed to save user message:', error)
    }

    try {
      // Get SAFE AI response with multi-layer protection
      const safeResponse = await getSafeChatResponse(userInput, messages.slice(-10))
      
      // Show crisis warning if critical/high crisis detected
      if (safeResponse.crisisLevel === 'CRITICAL' || safeResponse.crisisLevel === 'HIGH') {
        setShowCrisisWarning(true)
      }
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: safeResponse.response,
        timestamp: Date.now(),
        metadata: {
          confidence: safeResponse.confidence,
          aiGenerated: safeResponse.aiGenerated,
          responseType: safeResponse.type,
          crisisLevel: safeResponse.crisisLevel,
          validationWarnings: safeResponse.validationWarnings || [],
          processingTime: safeResponse.processingTime
        }
      }

      const updatedMessages = [...newMessages, botMessage]
      setMessages(updatedMessages)
      
      // Save bot response to database
      try {
        await saveSecureChatMessage(user.id, safeResponse.response, 'bot')
      } catch (error) {
        console.error('Failed to save bot message:', error)
      }
      
      setIsTyping(false)

      // Detect emotion and update mood
      const { emotion, stressLevel } = detectEmotion(userInput)
      if (emotion !== 'neutral') {
        toast.info(`Emotion detected: ${emotion}`)
      }

      // Show warning for low confidence responses
      if (safeResponse.confidence < 70 && safeResponse.aiGenerated) {
        toast.warning('Response generated with lower confidence. Consider consulting a counselor.')
      }
      
    } catch (error) {
      console.error('Error generating response:', error)
      toast.error('Failed to get response. Please try again.')
      setIsTyping(false)
    }
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
      {/* Disclaimer Banner */}
      <DisclaimerBanner type="chat" />
      
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
              <h1 className="text-lg font-medium text-gray-900">MindSpace AI</h1>
              <p className="text-sm text-gray-500">Multi-layer safety system active</p>
            </div>
          </div>
          <button
            onClick={() => setShowSafetyInfo(!showSafetyInfo)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Safety Info</span>
          </button>
        </div>
        
        {/* Safety Info Panel */}
        {showSafetyInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-4xl mx-auto mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <h3 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Active Safety Systems</span>
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Crisis detection (rule-based, 100% accurate)</li>
              <li>✓ Template protocols for critical situations (no AI)</li>
              <li>✓ Constitutional AI (self-critique)</li>
              <li>✓ Multi-layer validation (blocks unsafe content)</li>
              <li>✓ Response confidence scoring</li>
              <li>✓ Audit logging for transparency</li>
            </ul>
          </motion.div>
        )}
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
                  <div className="space-y-2">
                    <div className={`rounded-2xl px-5 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    {/* Show confidence indicator for bot messages */}
                    {message.type === 'bot' && message.metadata && (
                      <ConfidenceIndicator 
                        confidence={message.metadata.confidence}
                        responseType={message.metadata.responseType}
                        aiGenerated={message.metadata.aiGenerated}
                      />
                    )}
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
        
        {/* Show inline disclaimer periodically */}
        {messages.length > 0 && messages.length % 5 === 0 && (
          <div className="max-w-4xl mx-auto mt-4">
            <InlineDisclaimer />
          </div>
        )}
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

      {/* Enhanced Disclaimer */}
      <div className="bg-yellow-50 border-t-2 border-yellow-200 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-900">
              <strong>AI Safety Notice:</strong> This chat uses AI with multi-layer safety systems. 
              Critical situations use expert-written protocols (not AI). AI responses may occasionally 
              be imperfect - always verify with a counselor. In crisis: <strong>KIRAN 1800-599-0019</strong> or <strong>Emergency 112</strong>
            </p>
          </div>
        </div>
      </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This is not therapy or medical advice. For emergencies, call 1800-599-0019 or 112.
          </p>
        </div>
      </div>
    </div>
  )
}
