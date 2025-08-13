import { supabase } from './supabase'

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
}

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}