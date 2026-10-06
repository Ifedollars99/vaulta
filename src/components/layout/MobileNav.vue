<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white lg:hidden" aria-label="Mobile">
    <div class="grid grid-cols-5">
      <RouterLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
        :class="$route.path === item.to ? 'text-brand-700' : 'text-slate-500'"
      >
        <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
        {{ item.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { LayoutDashboard, ReceiptText, ArrowLeftRight, CreditCard, ShieldCheck } from 'lucide-vue-next'

const links = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/transactions', label: 'Activity', icon: ReceiptText },
  { to: '/transfer', label: 'Send', icon: ArrowLeftRight },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/security', label: 'Security', icon: ShieldCheck },
]
</script>
