<template>
  <div>
    <div class="rounded-xl bg-brand-950 p-5 text-center text-white">
      <p class="text-xs uppercase tracking-wide text-brand-100">You're sending</p>
      <p class="tnum mt-1 text-3xl font-semibold tracking-tight">{{ formatNaira(amount) }}</p>
      <p class="mt-1 text-sm text-brand-100">to {{ beneficiary.name }}</p>
    </div>

    <dl class="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm">
      <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Recipient</dt><dd class="font-medium text-slate-900">{{ beneficiary.name }}</dd></div>
      <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Bank</dt><dd class="font-medium text-slate-900">{{ beneficiary.bank }}</dd></div>
      <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Account</dt><dd class="tnum font-mono text-slate-900">{{ beneficiary.accountNumber }}</dd></div>
      <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Amount</dt><dd class="tnum font-medium text-slate-900">{{ formatNaira(amount) }}</dd></div>
      <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Fee</dt><dd class="tnum font-medium text-slate-900">{{ formatNaira(fee) }}</dd></div>
      <div class="flex justify-between px-4 py-2.5"><dt class="font-semibold text-slate-900">Total debit</dt><dd class="tnum font-semibold text-slate-900">{{ formatNaira(amount + fee) }}</dd></div>
      <div v-if="description" class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Note</dt><dd class="font-medium text-slate-900">{{ description }}</dd></div>
      <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Speed</dt><dd class="font-medium text-slate-900">Instant · seconds</dd></div>
    </dl>

    <p class="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
      <TriangleAlert class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Check the account number carefully. Transfers to the wrong account cannot be reversed from this demo.</span>
    </p>
  </div>
</template>

<script setup>
import { TriangleAlert } from 'lucide-vue-next'
import { formatNaira } from '@/utils/formatCurrency'

defineProps({
  beneficiary: { type: Object, required: true },
  amount: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  description: { type: String, default: '' },
})
</script>
