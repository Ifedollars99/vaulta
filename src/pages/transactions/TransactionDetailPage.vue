<template>
  <AppLayout>
    <RouterLink to="/transactions" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      Back to transactions
    </RouterLink>

    <div v-if="selectedLoading" class="card mt-4 animate-pulse space-y-3 p-6" role="status" aria-label="Loading transaction">
      <div class="h-8 w-48 rounded bg-slate-100" />
      <div class="h-4 w-32 rounded bg-slate-100" />
      <div class="h-40 rounded bg-slate-100" />
    </div>

    <div v-else-if="selectedError" class="card mt-4 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">{{ selectedError }}</p>
      <RouterLink to="/transactions" class="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        View all transactions
      </RouterLink>
    </div>

    <template v-else-if="txn">
      <!-- Header -->
      <div class="card mt-4 p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600" aria-hidden="true">
              {{ initials(txn.counterparty) }}
            </span>
            <div>
              <h1 class="text-lg font-semibold tracking-tight text-slate-900">{{ txn.counterparty }}</h1>
              <p class="text-sm text-slate-500">{{ formatDateTime(txn.date) }} · {{ txn.category }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="tnum text-2xl font-semibold tracking-tight" :class="txn.direction === 'credit' ? 'text-green-700' : 'text-slate-900'">
              {{ txn.direction === 'credit' ? '+' : '−' }}{{ formatNaira(txn.amount) }}
            </p>
            <AppBadge :status="txn.status" class="mt-1" />
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <AppButton variant="secondary" @click="printReceipt">
            <Download class="h-4 w-4" aria-hidden="true" />
            Download receipt
          </AppButton>
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <!-- Transfer trail -->
        <div class="card p-5 sm:p-6 lg:col-span-2">
          <h2 class="section-title">Transfer details</h2>
          <dl class="mt-4 divide-y divide-slate-100 text-sm">
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Transaction ID</dt><dd class="font-mono text-xs text-slate-900">{{ txn.id }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Reference</dt><dd class="tnum font-mono text-xs text-slate-900">{{ txn.reference }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Sender</dt><dd class="text-right font-medium text-slate-900">{{ sender }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Recipient</dt><dd class="text-right font-medium text-slate-900">{{ recipient }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Bank</dt><dd class="font-medium text-slate-900">{{ txn.bank }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Account number</dt><dd class="tnum font-mono text-slate-900">{{ txn.accountNumber }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Date</dt><dd class="font-medium text-slate-900">{{ formatDate(txn.date) }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Time</dt><dd class="font-medium text-slate-900">{{ formatTime(txn.date) }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Type</dt><dd class="font-medium text-slate-900">{{ txn.direction === 'credit' ? 'Money in' : 'Money out' }}</dd></div>
            <div class="flex justify-between gap-4 py-2.5"><dt class="text-slate-500">Category</dt><dd class="font-medium text-slate-900">{{ txn.category }}</dd></div>
          </dl>
        </div>

        <!-- Security panel -->
        <div class="card h-fit p-5 sm:p-6">
          <h2 class="section-title">Security check</h2>
          <div class="mt-4">
            <div class="flex items-baseline justify-between">
              <p class="text-sm text-slate-500">Risk score</p>
              <p class="tnum text-lg font-semibold text-slate-900">{{ txn.riskScore }}/100</p>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="img" :aria-label="`Risk score ${txn.riskScore} out of 100, ${band.label}`">
              <div class="h-full rounded-full" :class="bandBar" :style="{ width: txn.riskScore + '%' }" />
            </div>
            <AppBadge :status="band.label" class="mt-2" />
          </div>
          <dl class="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div class="flex justify-between gap-4"><dt class="text-slate-500">Device</dt><dd class="text-right font-medium text-slate-900">{{ txn.device }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-500">Location</dt><dd class="font-medium text-slate-900">{{ txn.location }}, Nigeria</dd></div>
          </dl>
          <p class="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
            Simulated risk scoring for demonstration. If you don't recognise this transaction, contact support immediately.
          </p>
        </div>
      </div>

      <!-- Printable receipt (visible only when printing) -->
      <section id="receipt" aria-label="Transaction receipt">
        <div class="mx-auto max-w-md text-center">
          <p class="text-lg font-bold">Vaulta</p>
          <p class="text-xs">Transaction Receipt (demo — not a fiscal document)</p>
          <hr class="my-4" />
          <p class="text-2xl font-bold">{{ txn.direction === 'credit' ? '+' : '−' }}{{ formatNaira(txn.amount) }}</p>
          <p class="mt-1 text-sm">{{ txn.counterparty }}</p>
          <dl class="mt-4 space-y-1 text-left text-xs">
            <div class="flex justify-between"><dt>Reference</dt><dd>{{ txn.reference }}</dd></div>
            <div class="flex justify-between"><dt>Date</dt><dd>{{ formatDateTime(txn.date) }}</dd></div>
            <div class="flex justify-between"><dt>Status</dt><dd>{{ txn.status }}</dd></div>
            <div class="flex justify-between"><dt>Sender</dt><dd>{{ sender }}</dd></div>
            <div class="flex justify-between"><dt>Recipient</dt><dd>{{ recipient }}</dd></div>
            <div class="flex justify-between"><dt>Bank</dt><dd>{{ txn.bank }}</dd></div>
          </dl>
          <hr class="my-4" />
          <p class="text-xs">Generated {{ formatDateTime(new Date()) }}</p>
        </div>
      </section>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, Download } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useTransactionStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDate, formatDateTime, formatTime } from '@/utils/formatDate'
import { riskBand } from '@/utils/riskScoring'

const route = useRoute()
const store = useTransactionStore()
const auth = useAuthStore()

const txn = computed(() => store.selected)
const selectedLoading = computed(() => store.selectedLoading)
const selectedError = computed(() => store.selectedError)
const band = computed(() => riskBand(txn.value?.riskScore))
const bandBar = computed(() => ({
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
}[band.value.tone]))

const sender = computed(() => {
  if (!txn.value) return ''
  return txn.value.direction === 'credit' ? txn.value.counterparty : (auth.user?.name ?? 'Adewale Ogunleye')
})
const recipient = computed(() => {
  if (!txn.value) return ''
  return txn.value.direction === 'credit' ? (auth.user?.name ?? 'Adewale Ogunleye') : txn.value.counterparty
})

function initials(name) {
  return String(name ?? '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function printReceipt() {
  window.print()
}

onMounted(() => {
  store.fetchById(route.params.id)
})
</script>

<style scoped>
#receipt {
  display: none;
}
</style>
