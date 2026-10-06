<template>
  <div class="text-center">
    <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full" :class="pending ? 'bg-amber-50' : 'bg-green-50'">
      <Clock v-if="pending" class="h-7 w-7 text-amber-600" aria-hidden="true" />
      <CircleCheck v-else class="h-7 w-7 text-green-600" aria-hidden="true" />
    </span>
    <h2 class="mt-3 text-xl font-semibold tracking-tight text-slate-900">
      {{ pending ? 'Transfer under review' : 'Money sent' }}
    </h2>
    <p class="tnum mt-1 text-3xl font-semibold tracking-tight text-slate-900">{{ formatNaira(record.amount) }}</p>
    <p class="mt-1 text-sm text-slate-500">to {{ record.counterparty }} · {{ record.bank }}</p>

    <div v-if="pending" class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-800" role="status">
      This transfer was flagged by simulated risk checks (score {{ record.riskScore }}/100) and is
      <span class="font-semibold">pending review</span>. Nothing has left your account yet in this demo ledger —
      the record is saved with status Pending.
    </div>

    <dl class="mx-auto mt-4 max-w-xs space-y-1.5 rounded-xl bg-slate-50 p-4 text-left text-sm">
      <div class="flex justify-between"><dt class="text-slate-500">Reference</dt><dd class="tnum font-mono text-xs text-slate-900">{{ record.reference }}</dd></div>
      <div class="flex justify-between"><dt class="text-slate-500">Fee</dt><dd class="tnum text-slate-900">{{ formatNaira(fee) }}</dd></div>
      <div class="flex justify-between"><dt class="text-slate-500">Date</dt><dd class="text-slate-900">{{ formatDateTime(record.date) }}</dd></div>
    </dl>

    <div class="mt-6 flex flex-col gap-2 sm:flex-row">
      <RouterLink :to="`/transactions/${record.id}`" class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50">
        View receipt
      </RouterLink>
      <button type="button" class="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="$emit('again')">
        Send another
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { CircleCheck, Clock } from 'lucide-vue-next'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'

defineProps({
  record: { type: Object, required: true },
  fee: { type: Number, default: 0 },
  pending: { type: Boolean, default: false },
})
defineEmits(['again'])
</script>
