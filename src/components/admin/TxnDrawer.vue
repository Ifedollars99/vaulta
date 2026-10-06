<template>
  <div
    class="fixed inset-0 z-50 flex justify-end bg-slate-900/50"
    role="dialog"
    aria-modal="true"
    aria-label="Transaction investigation"
    @click.self="$emit('close')"
  >
    <div class="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl sm:p-6">
      <div class="flex items-start justify-between">
        <div>
          <p class="label">Investigation</p>
          <h2 class="section-title mt-1">{{ txn.counterparty }}</h2>
          <p class="mt-0.5 font-mono text-xs text-slate-500">{{ txn.reference }} · {{ txn.customer }}</p>
        </div>
        <button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close investigation" @click="$emit('close')">
          <X class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <p class="tnum mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        {{ txn.direction === 'credit' ? '+' : '−' }}{{ formatNaira(txn.amount) }}
      </p>
      <div class="mt-2 flex gap-2">
        <AppBadge :status="txn.status" />
        <AppBadge :status="band.label" />
      </div>

      <div class="mt-5 rounded-xl border border-red-200 bg-red-50/50 p-4">
        <p class="flex items-baseline justify-between text-sm">
          <span class="font-medium text-slate-700">Risk score</span>
          <span class="tnum text-lg font-semibold text-slate-900">{{ txn.riskScore }}/100</span>
        </p>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-white" role="img" :aria-label="`Risk ${txn.riskScore} of 100`">
          <div class="h-full rounded-full" :class="bandBar" :style="{ width: txn.riskScore + '%' }" />
        </div>
        <ul class="mt-3 space-y-1 text-sm text-slate-700">
          <li v-for="reason in reasons" :key="reason" class="flex gap-2">
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
            {{ reason }}
          </li>
        </ul>
      </div>

      <dl class="mt-4 divide-y divide-slate-100 text-sm">
        <div class="flex justify-between py-2"><dt class="text-slate-500">Bank</dt><dd class="font-medium">{{ txn.bank }}</dd></div>
        <div class="flex justify-between py-2"><dt class="text-slate-500">Account</dt><dd class="tnum font-mono">{{ txn.accountNumber }}</dd></div>
        <div class="flex justify-between py-2"><dt class="text-slate-500">Date</dt><dd class="font-medium">{{ formatDateTime(txn.date) }}</dd></div>
        <div class="flex justify-between py-2"><dt class="text-slate-500">Location</dt><dd class="font-medium">{{ txn.location }}</dd></div>
        <div class="flex justify-between py-2"><dt class="text-slate-500">Device</dt><dd class="text-right font-medium">{{ txn.device }}</dd></div>
      </dl>

      <div v-if="txn.status === 'Pending'" class="mt-5 grid grid-cols-3 gap-2">
        <AppButton variant="secondary" @click="emit('triage', { id: txn.id, decision: 'contact' })">
          {{ contacted ? 'Contacted' : 'Contact' }}
        </AppButton>
        <AppButton variant="danger" @click="emit('triage', { id: txn.id, decision: 'block' })">Block</AppButton>
        <AppButton @click="emit('triage', { id: txn.id, decision: 'approve' })">Approve</AppButton>
      </div>
      <p v-else class="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        Settled as {{ txn.status }} — no further action. Decisions are recorded in the audit log.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import { deriveFraudReasons, fraudBand } from '@/utils/fraud'

const props = defineProps({
  txn: { type: Object, required: true },
  contacted: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'triage'])

const reasons = computed(() => deriveFraudReasons(props.txn))
const band = computed(() => fraudBand(props.txn))
const bandBar = computed(() => ({
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
}[band.value.tone]))

</script>
