<template>
  <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-brand-950 lg:block">
    <div class="flex h-16 items-center gap-2 px-5">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-950">V</span>
      <span class="font-semibold tracking-tight text-white">Vaulta</span>
    </div>
    <nav class="space-y-1 px-3" aria-label="Customer">
      <RouterLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
        :class="$route.path === item.to || $route.path.startsWith(item.to + '/')
          ? 'bg-white/10 text-white'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'"
      >
        <component :is="item.icon" class="h-4 w-4" aria-hidden="true" />
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="absolute inset-x-3 bottom-4 space-y-2">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        @click="logout"
      >
        <LogOut class="h-4 w-4" aria-hidden="true" />
        Log out
      </button>
      <div class="rounded-lg bg-white/5 p-3 text-xs text-slate-300">
        Demo prototype — fictional data only.
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  LayoutDashboard, ReceiptText, ArrowLeftRight, Users,
  CreditCard, ChartColumn, ShieldCheck, Bell, UserRound, Settings, LogOut,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

async function logout() {
  await auth.logout()
  router.push('/login')
}

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/beneficiaries', label: 'Beneficiaries', icon: Users },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/security', label: 'Security', icon: ShieldCheck },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]
</script>
