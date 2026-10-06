<template>
  <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
    <div class="flex h-16 items-center gap-2 px-5">
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-950 text-sm font-bold text-white">V</span>
      <span class="font-semibold tracking-tight text-slate-900">Vaulta <span class="text-xs font-normal text-slate-500">Ops</span></span>
    </div>
    <nav class="space-y-1 px-3" aria-label="Admin">
      <RouterLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
        :class="$route.path === item.to || $route.path.startsWith(item.to + '/')
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-600 hover:bg-slate-50'"
      >
        <component :is="item.icon" class="h-4 w-4" aria-hidden="true" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { LayoutDashboard, ReceiptText, Users, ShieldAlert, ScrollText } from 'lucide-vue-next'

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/fraud', label: 'Fraud queue', icon: ShieldAlert },
  { to: '/admin/audit-logs', label: 'Audit logs', icon: ScrollText },
]
</script>
