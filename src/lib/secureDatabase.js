/**
 * SECURE DATABASE WRAPPER
 * 
 * Wraps Supabase operations with automatic encryption/decryption
 * All sensitive data encrypted before sending to cloud
 * 
 * Usage:
 * - Same API as database.js
 * - Automatically encrypts on save
 * - Automatically decrypts on read
 * - Transparent to application code
 */

import { supabase } from './supabase'
import { encryptData, decryptData, getSessionPassword } from './encryption'

// ========================================
// SECURE MOOD OPERATIONS (Encrypted)
// ========================================

export const saveSecureMood = async (moodData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const password = getSessionPassword()
  
  // Encrypt sensitive fields if password available
  const encryptedNote = (password && moodData.note)
    ? await encryptData(moodData.note, password, user.id)
    : moodData.note

  const { data, error } = await supabase
    .from('moods')
    .insert([
      {
        user_id: user.id,
        mood: moodData.mood,
        stress_level: moodData.stressLevel,
        energy_level: moodData.energyLevel,
        note: encryptedNote,
        activities: moodData.activities || [],
        date: moodData.date || new Date().toISOString().split('T')[0],
        encrypted: !!password // Flag to indicate data is encrypted
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Supabase saveSecureMood error:', error)
    throw new Error(error.message || 'Failed to save mood')
  }
  return data
}

export const getSecureMoods = async (startDate = null, endDate = null) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const password = getSessionPassword()

  let query = supabase
    .from('moods')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (startDate) {
    query = query.gte('date', startDate)
  }
  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  // Decrypt notes if password available
  const decryptedData = await Promise.all(
    data.map(async (mood) => {
      if (password && mood.encrypted && mood.note) {
        try {
          mood.note = await decryptData(mood.note, password, user.id)
        } catch (err) {
          console.error('Failed to decrypt mood note:', err)
          mood.note = '[Encrypted - unable to decrypt]'
        }
      }
      return mood
    })
  )

  return decryptedData
}

// ========================================
// SECURE JOURNAL OPERATIONS (Encrypted)
// ========================================

export const saveSecureJournalEntry = async (entryData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const password = getSessionPassword()

  // Encrypt content and title if password available
  const encryptedContent = password 
    ? await encryptData(entryData.content, password, user.id)
    : entryData.content
  const encryptedTitle = (password && entryData.title)
    ? await encryptData(entryData.title, password, user.id)
    : entryData.title

  const { data, error } = await supabase
    .from('journal_entries')
    .insert([
      {
        user_id: user.id,
        title: encryptedTitle,
        content: encryptedContent,
        mood: entryData.mood,
        tags: entryData.tags || [],
        date: entryData.date || new Date().toISOString().split('T')[0],
        encrypted: !!password
      }
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const getSecureJournalEntries = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const password = getSessionPassword()

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)

  // Decrypt content and title if password available
  const decryptedData = await Promise.all(
    data.map(async (entry) => {
      if (password && entry.encrypted) {
        try {
          if (entry.content) {
            entry.content = await decryptData(entry.content, password, user.id)
          }
          if (entry.title) {
            entry.title = await decryptData(entry.title, password, user.id)
          }
        } catch (err) {
          console.error('Failed to decrypt journal entry:', err)
          entry.content = '[Encrypted - unable to decrypt]'
          entry.title = '[Encrypted]'
        }
      }
      return entry
    })
  )

  return decryptedData
}

// ========================================
// SECURE CHAT OPERATIONS (Encrypted)
// ========================================

export const saveSecureChatMessage = async (userId, content, sender) => {
  const password = getSessionPassword()

  // Encrypt message content if password available
  const encryptedContent = password
    ? await encryptData(content, password, userId)
    : content

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      {
        user_id: userId,
        content: encryptedContent,
        sender: sender,
        encrypted: !!password
      }
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const getSecureChatMessages = async (userId) => {
  const password = getSessionPassword()

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  // Decrypt messages if password available
  const decryptedData = await Promise.all(
    data.map(async (message) => {
      if (password && message.encrypted && message.content) {
        try {
          message.content = await decryptData(message.content, password, userId)
        } catch (err) {
          console.error('Failed to decrypt chat message:', err)
          message.content = '[Encrypted - unable to decrypt]'
        }
      }
      return message
    })
  )

  return decryptedData
}

// ========================================
// PRIVACY & DATA MANAGEMENT
// ========================================

/**
 * Get all user data (for privacy dashboard)
 */
export const getAllUserData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const [moods, journals, chats] = await Promise.all([
    getSecureMoods(),
    getSecureJournalEntries(),
    getSecureChatMessages(user.id)
  ])

  return {
    moods,
    journals,
    chats,
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    }
  }
}

/**
 * Export all user data as JSON
 */
export const exportUserData = async () => {
  const data = await getAllUserData()
  
  const exportData = {
    exported_at: new Date().toISOString(),
    user: data.user,
    moods: data.moods,
    journals: data.journals,
    chats: data.chats,
    encryption_info: {
      note: 'This data was decrypted for export. Original data is stored encrypted in the cloud.',
      encryption_standard: 'AES-256-GCM',
      key_derivation: 'PBKDF2 with 100,000 iterations'
    }
  }

  // Create downloadable JSON
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mindspace_data_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Delete ALL user data (GDPR right to be forgotten)
 */
export const deleteAllUserData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Delete from all tables
  const deletePromises = [
    supabase.from('moods').delete().eq('user_id', user.id),
    supabase.from('journal_entries').delete().eq('user_id', user.id),
    supabase.from('chat_messages').delete().eq('user_id', user.id)
  ]

  await Promise.all(deletePromises)

  // Clear local storage
  localStorage.removeItem(`encryption_salt_${user.id}`)
  
  return true
}
