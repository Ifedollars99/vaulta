<template>
  <AdminLayout>
    <h1 class="page-title">Fraud queue</h1>
    <p class="mt-1 text-sm text-slate-500">{{ store.fraudQueue.length }} transactions need review — simulated scoring.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load the queue</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="mt-6 flex gap-2" role="group" aria-label="Filter by risk band">
        <button
          v-for="opt in bandOptions"
          :key="opt.value"
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-medium"
          :class="band === opt.value ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-600'"
          :aria-pressed="band === opt.value"
          @click="band = opt.value"
        >
          {{ opt.label }} ({{ counts[opt.value] }})
        </button>
      </div>

      <div v-if="loading" class="mt-4 space-y-2" role="status" aria-label="Loading fraud queue">
        <div v-for="n in 5" :key="n" class="card h-24 animate-pulse bg-slate-100" />
      </div>

      <template v-else>
        <AppEmptyState v-if="queue.length === 0" title="Queue clear" message="No transactions in this band." class="mt-4" />
        <ul v-else class="mt-4 space-y-3">
          <li v-for="t in queue" :key="t.id" class="card cursor-pointer p-4 transition-colors hover:border-red-300" @click="selected = t">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-900">
                  {{ formatNaira(t.amount) }} → {{ t.counterparty }}
                </p>
                <p class="mt-0.5 text-xs text-slate-500">{{ t.customer }} · {{ t.reference }} · {{ formatDateTime(t.date) }}</p>
                <p class="mt-1 flex flex-wrap gap-1.5">
                  <span v-for="reason in reasonsFor(t).slice(0, 3)" :key="reason" class="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                    {{ reason }}
                  </span>
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <AppBadge :status="t.status" />
                <span class="tnum rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">{{ t.riskScore }}</span>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </template>

    <TxnDrawer
      v-if="selected"
      :txn="selected"
      :contacted="Boolean(store.contacted[selected.id])"
      @close="selected = null"
      @triage="onTriage"
    />
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import TxnDrawer from '@/components/admin/TxnDrawer.vue'
import { useAdminStore } from '@/stores/admin'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDate'
import { deriveFraudReasons } from '@/utils/fraud'

const store = useAdminStore()
const band = ref('all')
const selected = ref(null)

const loading = computed(() => store.loading && store.transactions.length === 0)
const error = computed(() => store.error)

const bandOptions = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
]

function bandOf(score) {
  if (score > 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

const counts = computed(() => {
  const c = { all: store.fraudQueue.length, high: 0, medium: 0 }
  for (const t of store.fraudQueue) c[bandOf(Number(t.riskScore))] += 1
  return c
})

const queue = computed(() => {
  if (band.value === 'all') return store.fraudQueue
  return store.fraudQueue.filter((t) => bandOf(Number(t.riskScore)) === band.value)
})

function reasonsFor(t) {
  return deriveFraudReasons(t)
}

async function onTriage({ id, decision }) {
  await store.triage(id, decision)
  selected.value = store.transactions.find((t) => t.id === id) ?? null
}

onMounted(() => store.ensureLoaded())
</script>
