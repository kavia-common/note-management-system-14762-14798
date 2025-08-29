import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { api } from '@/services/api'

const TOKEN_KEY = 'notes.token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  if (token.value) {
    api.setToken(token.value)
  }

  const isAuthenticated = computed(() => !!token.value)

  async function fetchMe() {
    if (!token.value) return
    try {
      loading.value = true
      user.value = await api.me()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn('Failed to fetch profile', msg)
      logout()
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function login(email: string, password: string) {
    /** Login and persist token, user. */
    try {
      loading.value = true
      error.value = null
      const res = await api.login(email, password)
      token.value = res.token
      api.setToken(res.token)
      localStorage.setItem(TOKEN_KEY, res.token)
      user.value = res.user
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed'
      error.value = msg
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function register(name: string, email: string, password: string) {
    /** Register then login-like behavior storing token. */
    try {
      loading.value = true
      error.value = null
      const res = await api.register(name, email, password)
      token.value = res.token
      api.setToken(res.token)
      localStorage.setItem(TOKEN_KEY, res.token)
      user.value = res.user
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed'
      error.value = msg
      throw e
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  function logout() {
    /** Clear auth token and user from state/storage. */
    token.value = null
    user.value = null
    api.setToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, user, loading, error, isAuthenticated, login, register, logout, fetchMe }
})
