import { useAuthStore } from '@/stores/auth'

/**
 * Route guards: public / requiresAuth / requiresAdmin.
 * Auth store is restored once before the first navigation.
 */
export function setupGuards(router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    if (!auth.initialized) auth.restore()

    if (to.meta.requiresAdmin && (!auth.isAuthenticated || !auth.isAdmin)) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { path: auth.isAdmin ? '/admin' : '/dashboard' }
    }
    return true
  })
}
