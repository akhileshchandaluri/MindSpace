import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { Send, Bot, User, AlertCircle, Heart } from 'lucide-react'
import { generateAIResponse, detectCrisis, detectEmotion } from '../lib/aiService'
import { saveChatMessage, getChatMessages } from '../lib/database'

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

    // Load chat history from Supabase
    const loadMessages = async () => {
      try {
        console.log('Loading chat messages for user:', user.id)
        const chatHistory = await getChatMessages(user.id)
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
    try {
      const welcomeMsg = {
        id: Date.now(),
        type: 'bot',
        content: `Hello${user?.isAnonymous ? '' : `, ${user?.email?.split('@')[0]}`}. I'm MindSpace, your emotional wellbeing companion. This is a safe, judgment-free space. How are you feeling today?`,
        timestamp: Date.now()
      }
      setMessages([welcomeMsg])
      await saveChatMessage(user.id, welcomeMsg.content, 'bot')
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

    // Save user message to database
    await saveChatMessage(user.id, userInput, 'user')

    // Check for crisis keywords
    if (detectCrisis(userInput)) {
      setShowCrisisWarning(true)
    }

    try {
      // Get AI response with conversation history
      const aiResponse = await generateAIResponse(userInput, messages.slice(-10))
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: Date.now()
      }

      const updatedMessages = [...newMessages, botMessage]
      setMessages(updatedMessages)
      
      // Save bot response to database
      await saveChatMessage(user.id, aiResponse, 'bot')
      
      setIsTyping(false)

      // Detect emotion and update mood
      const { emotion, stressLevel } = detectEmotion(userInput)
      toast.success(`Mood detected: ${emotion}`)
      
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
