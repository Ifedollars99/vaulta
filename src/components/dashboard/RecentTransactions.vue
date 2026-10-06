<template>
  <AppCard title="Recent transactions">
    <template #action>
      <RouterLink to="/transactions" class="text-xs font-medium text-brand-600 hover:text-brand-700">
        View all
      </RouterLink>
    </template>
    <ul v-if="transactions.length" class="-mx-1 divide-y divide-slate-100">
      <li v-for="t in transactions" :key="t.id">
        <RouterLink :to="`/transactions/${t.id}`" class="flex items-center justify-between gap-3 rounded-lg px-1 py-2.5 hover:bg-slate-50">
          <span class="flex min-w-0 items-center gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600" aria-hidden="true">
              {{ initials(t.counterparty) }}
            </span>
            <span class="min-w-0">
              <span class="block truncate text-sm font-medium text-slate-900">{{ t.counterparty }}</span>
              <span class="block text-xs text-slate-500">{{ formatDate(t.date) }} · {{ t.category }}</span>
            </span>
          </span>
          <span class="shrink-0 text-right">
            <span class="tnum block text-sm font-semibold" :class="t.direction === 'credit' ? 'text-green-700' : 'text-slate-900'">
              {{ t.direction === 'credit' ? '+' : '−' }}{{ formatNaira(t.amount) }}
            </span>
            <span class="mt-0.5 flex items-center justify-end gap-1 text-[11px]" :class="statusColor(t.status)">
              <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              {{ t.status }}
            </span>
          </span>
        </RouterLink>
      </li>
    </ul>
    <AppEmptyState v-else title="No transactions yet" message="Your recent activity will appear here." />
  </AppCard>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import AppCard from '@/components/ui/AppCard.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

defineProps({ transactions: { type: Array, default: () => [] } })

function initials(name) {
  return String(name ?? '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function statusColor(status) {
  return {
    Completed: 'text-green-700',
    Pending: 'text-amber-600',
    Failed: 'text-red-600',
    Reversed: 'text-slate-500',
  }[status] ?? 'text-slate-500'
}
</script>
