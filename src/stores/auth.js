import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginRequest, logoutRequest, registerRequest } from '@/services/auth.service'

/**
 * Global session only. Per-screen auth UI state stays local to pages.
 * Session persists to localStorage so refresh keeps the demo logged in.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref('')
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function restore() {
    try {
      const raw = localStorage.getItem('vaulta.session')
      if (raw) {
        const parsed = JSON.parse(raw)
        user.value = parsed.user
        token.value = parsed.token
      }
    } catch {
      // Corrupt session — start logged out.
    }
    initialized.value = true
  }

  function persist(remember = true) {
    const storage = remember ? localStorage : sessionStorage
    try {
      localStorage.removeItem('vaulta.session')
      sessionStorage.removeItem('vaulta.session')
      if (user.value && token.value) {
        storage.setItem('vaulta.session', JSON.stringify({ user: user.value, token: token.value }))
      }
    } catch {
      // Storage unavailable (private mode) — session simply won't persist.
    }
  }

  async function login(payload) {
    loading.value = true
    error.value = ''
    try {
      const res = await loginRequest(payload)
      user.value = res.user
      token.value = res.token
      persist(payload.rememberMe !== false)
      return res.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = ''
    try {
      const res = await registerRequest(payload)
      user.value = res.user
      token.value = res.token
      persist(true)
      return res.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await logoutRequest()
    user.value = null
    token.value = null
    persist()
  }

  return { user, token, loading, error, initialized, isAuthenticated, isAdmin, restore, login, register, logout }
})
