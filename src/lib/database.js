import { supabase } from './supabase'

// ========================================
// MOOD OPERATIONS
// ========================================

export const saveMood = async (moodData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('moods')
    .insert([
      {
        user_id: user.id,
        mood: moodData.mood,
        stress_level: moodData.stressLevel,
        energy_level: moodData.energyLevel,
        note: moodData.note,
        activities: moodData.activities || [],
        date: moodData.date || new Date().toISOString().split('T')[0]
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Supabase saveMood error:', error)
    throw new Error(error.message || 'Failed to save mood')
  }
  return data
}

export const getMoods = async (startDate = null, endDate = null) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

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
  if (error) throw error
  return data
}

export const updateMood = async (moodId, updates) => {
  const { data, error } = await supabase
    .from('moods')
    .update(updates)
    .eq('id', moodId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteMood = async (moodId) => {
  const { error } = await supabase
    .from('moods')
    .delete()
    .eq('id', moodId)

  if (error) throw error
}

// ========================================
// JOURNAL OPERATIONS
// ========================================

export const saveJournalEntry = async (entryData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('journal_entries')
    .insert([
      {
        user_id: user.id,
        title: entryData.title,
        content: entryData.content,
        mood: entryData.mood,
        tags: entryData.tags || [],
        is_private: entryData.isPrivate !== false,
        date: entryData.date || new Date().toISOString().split('T')[0]
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getJournalEntries = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

export const updateJournalEntry = async (entryId, updates) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteJournalEntry = async (entryId) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)

  if (error) throw error
}

// ========================================
// CHAT OPERATIONS
// ========================================

export const saveChatMessage = async (sender, content, context = {}) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      {
        user_id: user.id,
        sender,
        content,
        context
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getChatMessages = async (limit = 50) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

export const clearChatHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', user.id)

  if (error) throw error
}

// ========================================
// GOALS OPERATIONS
// ========================================

export const saveGoal = async (goalData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        user_id: user.id,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        target_date: goalData.targetDate,
        completed: false
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getGoals = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateGoal = async (goalId, updates) => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteGoal = async (goalId) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)

  if (error) throw error
}

// ========================================
// FEEDBACK OPERATIONS
// ========================================

export const submitFeedback = async (feedbackData) => {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('feedback')
    .insert([
      {
        user_id: user?.id || null,
        type: feedbackData.type,
        subject: feedbackData.subject,
        message: feedbackData.message,
        rating: feedbackData.rating
      }
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

// ========================================
// USER PROFILE OPERATIONS
// ========================================

export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ========================================
// TEACHER DASHBOARD OPERATIONS
// ========================================

export const getStudentMoodStats = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Get teacher's students
  const { data: students, error: studentsError } = await supabase
    .from('teacher_students')
    .select('student_id')
    .eq('teacher_id', user.id)
    .eq('consent_given', true)

  if (studentsError) throw studentsError

  if (!students || students.length === 0) {
    return []
  }

  const studentIds = students.map(s => s.student_id)

  // Get aggregated mood data
  const { data: moods, error: moodsError } = await supabase
    .from('moods')
    .select('mood, stress_level, date')
    .in('user_id', studentIds)
    .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  if (moodsError) throw moodsError

  return moods
}
