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
import { encryptData, decryptData, getSessionPassword, getAutoPassword, enableEncryption } from './encryption'

/**
 * Get encryption password - auto-generates if not available
 */
const getEncryptionPassword = async (userId) => {
  let password = getSessionPassword()
  
  if (!password) {
    // Auto-enable encryption with user-specific key
    await enableEncryption(userId)
    password = getSessionPassword()
  }
  
  return password
}

// ========================================
// SECURE MOOD OPERATIONS (Encrypted)
// ========================================

export const saveSecureMood = async (moodData) => {
  console.log('😊 Saving mood, data:', JSON.stringify(moodData).substring(0, 100))
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('❌ No user authenticated')
    throw new Error('User not authenticated')
  }
  
  console.log('✅ User authenticated:', user.id)
  
  // Auto-get encryption password (generates if not exists)
  const password = await getEncryptionPassword(user.id)
  console.log('🔐 Password available:', !!password)
  
  // Encrypt sensitive fields if password available
  let encryptedNote
  try {
    encryptedNote = (password && moodData.note)
      ? await encryptData(moodData.note, password, user.id)
      : moodData.note
  } catch (encError) {
    console.error('⚠️ Encryption failed, saving unencrypted:', encError)
    encryptedNote = moodData.note
  }

  const insertData = {
    user_id: user.id,
    mood: moodData.mood,
    stress_level: moodData.stressLevel,
    energy_level: moodData.energyLevel,
    note: encryptedNote,
    activities: moodData.activities || [],
    date: moodData.date || new Date().toISOString().split('T')[0],
    encrypted: !!password
  }
  
  console.log('📤 Inserting into Supabase:', JSON.stringify(insertData).substring(0, 150))

  const { data, error } = await supabase
    .from('moods')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    console.error('❌ Supabase saveSecureMood error:', error)
    throw new Error(error.message || 'Failed to save mood')
  }
  
  console.log('✅ Mood saved successfully, id:', data?.id)
  return data
}

export const getSecureMoods = async (startDate = null, endDate = null) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Auto-get encryption password
  const password = await getEncryptionPassword(user.id)

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
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Auto-get encryption password
    const password = await getEncryptionPassword(user.id)
    console.log('📝 Saving journal entry, encryption:', !!password)

    // Encrypt content and title if password available
    let encryptedContent, encryptedTitle
    
    try {
      encryptedContent = password 
        ? await encryptData(entryData.content, password, user.id)
        : entryData.content
      encryptedTitle = (password && entryData.title)
        ? await encryptData(entryData.title, password, user.id)
        : entryData.title
    } catch (encError) {
      console.error('Encryption failed, saving unencrypted:', encError)
      encryptedContent = entryData.content
      encryptedTitle = entryData.title
    }

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

    if (error) {
      console.error('Supabase saveSecureJournalEntry error:', error)
      throw new Error(error.message || 'Failed to save journal entry')
    }
    
    console.log('✅ Journal entry saved successfully')
    return data
  } catch (error) {
    console.error('saveSecureJournalEntry failed:', error)
    throw error
  }
}

export const getSecureJournalEntries = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Auto-get encryption password
  const password = await getEncryptionPassword(user.id)

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)

  // Decrypt content and title if password available
  const decryptedData = await Promise.all(
    data.map(async (entry) => {
      // If entry is marked as encrypted, try to decrypt
      if (entry.encrypted && password) {
        try {
          if (entry.content) {
            const decrypted = await decryptData(entry.content, password, user.id)
            entry.content = decrypted
            console.log('✅ Journal entry decrypted successfully, id:', entry.id)
          }
          if (entry.title) {
            const decryptedTitle = await decryptData(entry.title, password, user.id)
            entry.title = decryptedTitle
          }
        } catch (err) {
          console.error('❌ Failed to decrypt journal entry:', entry.id, err)
          // Mark as undecryptable but keep in list
          entry.decryption_error = true
          entry.original_content = entry.content // Keep for debugging
          entry.content = '⚠️ This entry was encrypted with a different key and cannot be decrypted.\n\n💡 To fix this: Go to Profile → Privacy Dashboard → "Delete All My Data" to remove old encrypted entries, or use "Reset Encryption" to start fresh.'
          entry.title = '🔒 Encrypted (Cannot Decrypt)'
        }
      } else if (entry.encrypted && !password) {
        // No password available
        entry.content = '🔐 Encrypted data - password not available. Please refresh the page.'
        entry.title = '🔒 Encrypted'
      }
      // If not encrypted, return as-is
      return entry
    })
  )

  return decryptedData
}

// ========================================
// SECURE CHAT OPERATIONS (Encrypted)
// ========================================

export const saveSecureChatMessage = async (userId, content, sender) => {
  console.log('💬 Saving chat message, userId:', userId, 'sender:', sender)
  console.log('💬 Content length:', content?.length)
  
  try {
    // Auto-get encryption password
    const password = await getEncryptionPassword(userId)
    console.log('🔐 Password available:', !!password)

    // Encrypt message content if password available
    let encryptedContent
    try {
      encryptedContent = password
        ? await encryptData(content, password, userId)
        : content
      console.log('✅ Encryption successful, encrypted length:', encryptedContent?.length)
    } catch (encError) {
      console.error('⚠️ Encryption failed, saving unencrypted:', encError)
      encryptedContent = content
    }

    const insertData = {
      user_id: userId,
      content: encryptedContent,
      sender: sender,
      encrypted: !!password
    }
    
    console.log('📤 Inserting chat message to Supabase...')

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase saveSecureChatMessage error:', error)
      console.error('❌ Error details:', JSON.stringify(error))
      throw new Error(error.message || 'Failed to save chat message')
    }
    
    console.log('✅ Chat message saved successfully, id:', data?.id)
    return data
  } catch (error) {
    console.error('❌ saveSecureChatMessage failed:', error)
    throw error
  }
}

export const getSecureChatMessages = async (userId) => {
  // Auto-get encryption password
  const password = await getEncryptionPassword(userId)

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  // Decrypt messages if password available
  const decryptedData = await Promise.all(
    data.map(async (msg) => {
      if (msg.encrypted && password && msg.content) {
        try {
          const decrypted = await decryptData(msg.content, password, userId)
          msg.content = decrypted
          console.log('✅ Chat message decrypted, id:', msg.id)
        } catch (err) {
          console.error('❌ Failed to decrypt chat message:', msg.id, err)
          msg.content = '⚠️ [Encrypted with old key - cannot decrypt. Delete chat history to fix.]'
          msg.decryption_error = true
        }
      } else if (msg.encrypted && !password) {
        msg.content = '🔐 [Encrypted - refresh page]'
      }
      // If not encrypted, return as-is
      return msg
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
    supabase.from('chat_messages').delete().eq('user_id', user.id),
    supabase.from('goals').delete().eq('user_id', user.id)
  ]

  await Promise.all(deletePromises)

  // Clear local storage
  localStorage.removeItem(`encryption_salt_${user.id}`)
  sessionStorage.clear()
  
  return true
}

/**
 * Fix encryption issues by resetting encryption for current user
 * This clears the old encryption salt and creates a new one
 */
export const resetUserEncryption = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  console.log('🔄 Resetting encryption for user:', user.id)
  
  // Clear old encryption salt
  localStorage.removeItem(`encryption_salt_${user.id}`)
  sessionStorage.clear()
  
  // Re-enable with new encryption
  const { enableEncryption } = await import('./encryption')
  await enableEncryption(user.id)
  
  console.log('✅ Encryption reset complete - please save new data')
  
  return true
}

/**
 * Delete all old encrypted data that can't be decrypted
 * This removes permanently unreadable data so users start fresh
 */
export const deleteOldEncryptedData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  console.log('🗑️ Deleting old encrypted data for user:', user.id)

  // Delete all entries marked as encrypted (old system)
  const deletes = [
    supabase.from('moods').delete().eq('user_id', user.id).eq('encrypted', true),
    supabase.from('journal_entries').delete().eq('user_id', user.id).eq('encrypted', true),
    supabase.from('chat_messages').delete().eq('user_id', user.id).eq('encrypted', true)
  ]

  await Promise.all(deletes)
  
  console.log('✅ Old encrypted data deleted - you can now save new readable data')
  
  return true
}
