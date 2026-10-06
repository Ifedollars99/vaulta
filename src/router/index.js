import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

/**
 * Sitemap per architecture. All authenticated/admin pages are lazy-loaded.
 * Phase 0 ships minimal placeholder pages — real UI lands in Phases 1–7.
 */
const routes = [
  { path: '/', component: () => import('@/pages/LandingPage.vue') },
  { path: '/login', meta: { guestOnly: true }, component: () => import('@/pages/auth/LoginPage.vue') },
  { path: '/register', meta: { guestOnly: true }, component: () => import('@/pages/auth/RegisterPage.vue') },
  { path: '/forgot-password', meta: { guestOnly: true }, component: () => import('@/pages/auth/ForgotPasswordPage.vue') },

  { path: '/dashboard', meta: { requiresAuth: true }, component: () => import('@/pages/dashboard/DashboardPage.vue') },
  { path: '/transactions', meta: { requiresAuth: true }, component: () => import('@/pages/transactions/TransactionsPage.vue') },
  { path: '/transactions/:id', meta: { requiresAuth: true }, component: () => import('@/pages/transactions/TransactionDetailPage.vue') },
  { path: '/transfer', meta: { requiresAuth: true }, component: () => import('@/pages/transfer/TransferPage.vue') },
  { path: '/beneficiaries', meta: { requiresAuth: true }, component: () => import('@/pages/beneficiaries/BeneficiariesPage.vue') },
  { path: '/cards', meta: { requiresAuth: true }, component: () => import('@/pages/cards/CardsPage.vue') },
  { path: '/analytics', meta: { requiresAuth: true }, component: () => import('@/pages/analytics/AnalyticsPage.vue') },
  { path: '/security', meta: { requiresAuth: true }, component: () => import('@/pages/security/SecurityPage.vue') },
  { path: '/notifications', meta: { requiresAuth: true }, component: () => import('@/pages/notifications/NotificationsPage.vue') },
  { path: '/profile', meta: { requiresAuth: true }, component: () => import('@/pages/profile/ProfilePage.vue') },
  { path: '/settings', meta: { requiresAuth: true }, component: () => import('@/pages/settings/SettingsPage.vue') },

  { path: '/admin', meta: { requiresAdmin: true }, component: () => import('@/pages/admin/AdminOverviewPage.vue') },
  { path: '/admin/transactions', meta: { requiresAdmin: true }, component: () => import('@/pages/admin/AdminTransactionsPage.vue') },
  { path: '/admin/customers', meta: { requiresAdmin: true }, component: () => import('@/pages/admin/AdminCustomersPage.vue') },
  { path: '/admin/customers/:id', meta: { requiresAdmin: true }, component: () => import('@/pages/admin/AdminCustomerDetailPage.vue') },
  { path: '/admin/fraud', meta: { requiresAdmin: true }, component: () => import('@/pages/admin/AdminFraudPage.vue') },
  { path: '/admin/audit-logs', meta: { requiresAdmin: true }, component: () => import('@/pages/admin/AdminAuditLogsPage.vue') },

  { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes,
})

setupGuards(router)

export default router
