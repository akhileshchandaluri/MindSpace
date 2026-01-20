import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { BookOpen, Plus, Calendar, Lock, Search } from 'lucide-react'

export default function JournalPage({ user }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('')
  const [showPrompts, setShowPrompts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const prompts = [
    "What made me smile today?",
    "What challenge did I face and how did I handle it?",
    "What am I grateful for right now?",
    "What emotion dominated my day and why?",
    "What would help me feel better tomorrow?"
  ]

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const savedEntries = localStorage.getItem(`journal_${user.id}`)
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [user, navigate])

  const handleSaveEntry = () => {
    if (!newEntry.trim()) {
      toast.warning('Please write something before saving')
      return
    }

    const entry = {
      id: Date.now(),
      content: newEntry,
      date: new Date().toISOString(),
      mood: 'neutral'
    }

    const updatedEntries = [entry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem(`journal_${user.id}`, JSON.stringify(updatedEntries))
    setNewEntry('')
    toast.success('Journal entry saved!')
  }

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Your Journal</h1>
          <p className="text-lg text-gray-600">
            A private space for your thoughts and reflections
          </p>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-primary-50 border-primary-100 mb-8 flex items-start space-x-3"
        >
          <Lock className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-700">
              Your journal entries are completely private and stored only on your device. 
              They are never shared or analyzed without your permission.
            </p>
          </div>
        </motion.div>

        {/* New Entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900">New Entry</h2>
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showPrompts ? 'Hide' : 'Show'} Prompts
            </button>
          </div>

          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 space-y-2"
            >
              <p className="text-sm text-gray-600 mb-2">Need inspiration? Try one of these:</p>
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setNewEntry(prompt + '\n\n')}
                  className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}

          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write freely about your day, feelings, or thoughts..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none mb-4"
            rows="8"
          />

          <button
            onClick={handleSaveEntry}
            disabled={!newEntry.trim()}
            className="btn-primary flex items-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>Save Entry</span>
          </button>
        </motion.div>

        {/* Past Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-primary-500" />
              <span>Past Entries</span>
            </h2>
            {entries.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search entries..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            )}
          </div>

          {searchQuery && filteredEntries.length === 0 ? (
            <div className="card text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No entries found matching "{searchQuery}"</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No entries yet. Start writing to begin your journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Weekly Summary */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-primary-50 border-primary-100 mt-8"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">Weekly Reflection</h3>
            <div className="space-y-2 text-gray-700">
              <p>✓ You've journaled {entries.length} {entries.length === 1 ? 'time' : 'times'} this week</p>
              <p>✓ Consistent reflection helps build emotional awareness</p>
              <p className="text-sm text-primary-700 mt-3">
                💡 Try to journal at the same time each day to build a healthy habit
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
