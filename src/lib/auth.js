import { supabase } from './supabase'

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

/**
 * Sign up a new user
 */
export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.fullName || email.split('@')[0],
        role: userData.role || 'student'
      },
      emailRedirectTo: window.location.origin
    }
  })

  if (error) throw error
  return data
}

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

/**
 * Sign in anonymously
 */
export const signInAnonymously = async () => {
  // Create a guest account with valid email format
  const timestamp = Date.now()
  const guestEmail = `guest${timestamp}@guest.mindspace.app`
  const guestPassword = `Guest_${timestamp}_${Math.random().toString(36).slice(2)}`
  
  const { data, error } = await supabase.auth.signUp({
    email: guestEmail,
    password: guestPassword,
    options: {
      data: {
        full_name: 'Guest User',
        role: 'student',
        is_anonymous: true
      },
      emailRedirectTo: window.location.origin
    }
  })

  if (error) throw error
  return data
}

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user session
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  const session = await getSession()
  return !!session
}

/**
 * Reset password (send reset email)
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (error) throw error
  return data
}

/**
 * Update user password
 */
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw error
  return data
}

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

/**
 * Get user role from database
 */
export const getUserRole = async (userId = null) => {
  let uid = userId
  
  if (!uid) {
    const user = await getCurrentUser()
    if (!user) return null
    uid = user.id
  }

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', uid)
    .single()

  if (error) {
    console.error('Error getting user role:', error)
    return 'student' // Default role
  }

  return data?.role || 'student'
}

/**
 * Check if user has specific role
 */
export const hasRole = async (role) => {
  const userRole = await getUserRole()
  return userRole === role
}

/**
 * Check if user is teacher
 */
export const isTeacher = async () => {
  return await hasRole('teacher')
}

/**
 * Check if user is admin
 */
export const isAdmin = async () => {
  return await hasRole('admin')
}
