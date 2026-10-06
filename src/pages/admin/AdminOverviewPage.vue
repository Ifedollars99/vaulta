<template>
  <AdminLayout>
    <h1 class="page-title">Operations overview</h1>
    <p class="mt-1 text-sm text-slate-500">Platform health at a glance — simulated data.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load operations data</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <div v-else-if="loading" class="mt-6 space-y-4" role="status" aria-label="Loading overview">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div v-for="n in 8" :key="n" class="card h-24 animate-pulse bg-slate-100" />
      </div>
    </div>

    <template v-else>
      <dl class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div v-for="kpi in kpiCards" :key="kpi.label" class="card p-4">
          <dt class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <component :is="kpi.icon" class="h-3.5 w-3.5" aria-hidden="true" />
            {{ kpi.label }}
          </dt>
          <dd class="tnum mt-1 text-xl font-semibold" :class="kpi.tone">{{ kpi.value }}</dd>
          <dd v-if="kpi.sub" class="mt-0.5 text-xs text-slate-400">{{ kpi.sub }}</dd>
        </div>
      </dl>

      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <AppCard title="Transaction volume" class="lg:col-span-2">
          <div class="h-56">
            <MonthlySpendingChart
              :labels="summary.map((m) => m.label)"
              :income="summary.map((m) => m.income)"
              :expenses="summary.map((m) => m.expenses)"
              aria-label="Platform monthly volume chart"
            />
          </div>
        </AppCard>
        <AppCard title="By status">
          <div class="h-56">
            <DoughnutChart :labels="statusBreakdown.map((s) => s.label)" :values="statusBreakdown.map((s) => s.count)" aria-label="Transactions by status chart" />
          </div>
        </AppCard>
      </div>

      <AppCard title="Top fraud alerts" class="mt-4">
        <template #action>
          <RouterLink to="/admin/fraud" class="text-xs font-medium text-brand-600 hover:text-brand-700">Open queue</RouterLink>
        </template>
        <ul class="divide-y divide-slate-100">
          <li v-for="t in topAlerts" :key="t.id" class="flex items-center justify-between gap-3 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-slate-900">{{ t.counterparty }} <span class="font-normal text-slate-400">· {{ t.customer }}</span></p>
              <p class="font-mono text-xs text-slate-400">{{ t.reference }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <span class="tnum text-sm font-semibold text-slate-900">{{ formatNaira(t.amount) }}</span>
              <AppBadge :status="t.riskScore > 70 ? 'High risk' : 'Medium risk'" />
            </div>
          </li>
        </ul>
      </AppCard>
    </template>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  AlertTriangle, CircleDollarSign, CircleX, Clock, ShieldAlert, Users, UserCheck, Wallet,
} from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import MonthlySpendingChart from '@/components/charts/MonthlySpendingChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import { useAdminStore } from '@/stores/admin'
import { formatNaira } from '@/utils/formatCurrency'

const store = useAdminStore()

const loading = computed(() => store.loading && store.transactions.length === 0)
const error = computed(() => store.error)
const kpis = computed(() => store.kpis)

const kpiCards = computed(() => [
  { label: 'Customers', value: kpis.value.totalCustomers, icon: Users, tone: 'text-slate-900', sub: `${kpis.value.activeCustomers} active` },
  { label: 'Active rate', value: `${Math.round((kpis.value.activeCustomers / Math.max(1, kpis.value.totalCustomers)) * 100)}%`, icon: UserCheck, tone: 'text-slate-900' },
  { label: 'Volume', value: formatNaira(kpis.value.volume, { decimals: 0 }), icon: Wallet, tone: 'text-slate-900', sub: 'settled' },
  { label: 'Today', value: formatNaira(kpis.value.dailyVolume, { decimals: 0 }), icon: CircleDollarSign, tone: 'text-green-700', sub: kpis.value.dailyLabel },
  { label: 'Pending', value: kpis.value.pending, icon: Clock, tone: 'text-amber-600' },
  { label: 'Failed', value: kpis.value.failed, icon: CircleX, tone: 'text-red-600' },
  { label: 'Fraud alerts', value: kpis.value.fraudAlerts, icon: ShieldAlert, tone: 'text-red-600', sub: 'risk > 70' },
  { label: 'Flagged accts', value: store.customers.filter((c) => c.status !== 'Active').length, icon: AlertTriangle, tone: 'text-amber-600', sub: 'review + suspended' },
])

const statusBreakdown = computed(() => {
  const counts = { Completed: 0, Pending: 0, Failed: 0, Reversed: 0 }
  for (const t of store.transactions) {
    if (t.status in counts) counts[t.status] += 1
  }
  return Object.entries(counts).map(([label, count]) => ({ label, count }))
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Platform-wide monthly settled volume, oldest → newest. */
const summary = computed(() => {
  const buckets = new Map()
  for (const t of store.transactions) {
    if (t.status === 'Failed' || t.status === 'Reversed') continue
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!buckets.has(key)) {
      buckets.set(key, { key, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, income: 0, expenses: 0 })
    }
    const b = buckets.get(key)
    if (t.direction === 'credit') b.income += t.amount
    else b.expenses += t.amount
  }
  return [...buckets.values()].sort((a, b) => (a.key < b.key ? -1 : 1)).slice(-6)
})

const topAlerts = computed(() => store.fraudQueue.slice(0, 5))

onMounted(() => {
  store.ensureLoaded()
})
</script>
