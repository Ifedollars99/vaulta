import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const demoCredentials = {
  customer: { identifier: 'adewale.ogunleye@example.ng', password: 'Vaulta123!' },
  admin: { identifier: 'admin@vaulta.ng', password: 'Vaulta123!' },
}

/**
 * Shared post-login navigation: honour ?redirect=, else role-based home.
 */
export function useAuth() {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  const redirectTo = computed(() => {
    const target = route.query.redirect
    return typeof target === 'string' && target.startsWith('/') ? target : null
  })

  async function redirectAfterLogin(user) {
    const fallback = user?.role === 'admin' ? '/admin' : '/dashboard'
    await router.push(redirectTo.value ?? fallback)
  }

  return { auth, redirectTo, redirectAfterLogin, demoCredentials }
}
