<template>
  <!-- Desktop table -->
  <div class="card hidden overflow-x-auto md:block">
    <table class="w-full min-w-[760px] text-left text-sm">
      <caption class="sr-only">Transactions</caption>
      <thead>
        <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
          <th scope="col" class="px-4 py-3 font-medium">Transaction</th>
          <th scope="col" class="px-4 py-3 font-medium">Reference</th>
          <th scope="col" class="px-4 py-3 text-right font-medium">Amount</th>
          <th scope="col" class="px-4 py-3 font-medium">Type</th>
          <th scope="col" class="px-4 py-3 font-medium">Status</th>
          <th scope="col" class="px-4 py-3 font-medium">Date</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-for="t in transactions" :key="t.id" class="transition-colors hover:bg-slate-50">
          <td class="px-4 py-3">
            <RouterLink :to="`/transactions/${t.id}`" class="flex items-center gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600" aria-hidden="true">
                {{ initials(t.counterparty) }}
              </span>
              <span>
                <span class="block font-medium text-slate-900 hover:text-brand-700">{{ t.counterparty }}</span>
                <span class="block text-xs text-slate-500">{{ t.category }}</span>
              </span>
            </RouterLink>
          </td>
          <td class="tnum px-4 py-3 font-mono text-xs text-slate-500">{{ t.reference }}</td>
          <td class="tnum px-4 py-3 text-right font-semibold" :class="t.direction === 'credit' ? 'text-green-700' : 'text-slate-900'">
            {{ t.direction === 'credit' ? '+' : '−' }}{{ formatNaira(t.amount) }}
          </td>
          <td class="px-4 py-3 text-slate-600">{{ t.direction === 'credit' ? 'Money in' : 'Money out' }}</td>
          <td class="px-4 py-3"><AppBadge :status="t.status" /></td>
          <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ formatDate(t.date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Mobile cards -->
  <ul class="space-y-2 md:hidden">
    <li v-for="t in transactions" :key="t.id" class="card p-4">
      <RouterLink :to="`/transactions/${t.id}`" class="flex items-center justify-between gap-3">
        <span class="flex min-w-0 items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600" aria-hidden="true">
            {{ initials(t.counterparty) }}
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-medium text-slate-900">{{ t.counterparty }}</span>
            <span class="block text-xs text-slate-500">{{ formatDate(t.date) }} · {{ t.direction === 'credit' ? 'Money in' : 'Money out' }}</span>
          </span>
        </span>
        <span class="shrink-0 text-right">
          <span class="tnum block text-sm font-semibold" :class="t.direction === 'credit' ? 'text-green-700' : 'text-slate-900'">
            {{ t.direction === 'credit' ? '+' : '−' }}{{ formatNaira(t.amount) }}
          </span>
          <AppBadge :status="t.status" class="mt-1" />
        </span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import AppBadge from '@/components/ui/AppBadge.vue'
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
</script>
