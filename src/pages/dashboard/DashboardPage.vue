<template>
  <AppLayout>
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-900" aria-hidden="true">
          {{ initials }}
        </div>
        <div>
          <h1 class="page-title">{{ greeting }}, {{ firstName }}</h1>
          <p class="text-sm text-slate-500">{{ today }}</p>
        </div>
      </div>
      <RouterLink to="/transfer" class="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 sm:inline-block">
        Send money
      </RouterLink>
    </div>

    <!-- Error state -->
    <div v-if="loadError" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load your dashboard</p>
      <p class="mt-1 text-sm text-slate-500">{{ loadError }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="reload">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="mt-6"><SecurityAlertBanner /></div>

      <div class="mt-6 grid gap-4 lg:grid-cols-3">
        <div class="space-y-4 lg:col-span-2">
          <BalanceCard v-if="!accountLoading" />
          <div v-else class="rounded-xl border border-slate-200 bg-white p-5" role="status" aria-label="Loading balance">
            <div class="animate-pulse space-y-3">
              <div class="h-3 w-32 rounded bg-slate-200" />
              <div class="h-9 w-56 rounded bg-slate-200" />
              <div class="h-3 w-40 rounded bg-slate-200" />
            </div>
          </div>

          <!-- Spending overview -->
          <AppCard title="Spending overview">
            <template #action>
              <div class="flex rounded-lg border border-slate-200 p-0.5 text-xs font-medium" role="group" aria-label="Chart range">
                <button
                  v-for="opt in rangeOptions"
                  :key="opt.months"
                  type="button"
                  class="rounded-md px-2.5 py-1"
                  :class="range === opt.months ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'"
                  :aria-pressed="range === opt.months"
                  @click="range = opt.months"
                >
                  {{ opt.label }}
                </button>
              </div>
            </template>
            <div v-if="txnLoading" class="animate-pulse space-y-2" role="status" aria-label="Loading chart">
              <div class="h-48 rounded bg-slate-100" />
            </div>
            <div v-else class="h-56">
              <MonthlySpendingChart
                :labels="chartSlice.map((m) => m.label)"
                :income="chartSlice.map((m) => m.income)"
                :expenses="chartSlice.map((m) => m.expenses)"
              />
            </div>
            <dl class="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
              <div>
                <dt class="label">Income</dt>
                <dd class="tnum mt-1 text-sm font-semibold text-green-700">{{ formatNaira(totals.income) }}</dd>
              </div>
              <div>
                <dt class="label">Expenses</dt>
                <dd class="tnum mt-1 text-sm font-semibold text-slate-900">{{ formatNaira(totals.expenses) }}</dd>
              </div>
              <div>
                <dt class="label">Saved</dt>
                <dd class="tnum mt-1 text-sm font-semibold text-brand-700">{{ formatNaira(totals.saved) }}</dd>
              </div>
            </dl>
          </AppCard>

          <RecentTransactions v-if="!txnLoading" :transactions="recent" />
          <div v-else class="card animate-pulse space-y-3 p-5" role="status" aria-label="Loading transactions">
            <div v-for="n in 5" :key="n" class="h-12 rounded bg-slate-100" />
          </div>
        </div>

        <div class="space-y-4">
          <QuickActions />
          <InsightList v-if="!txnLoading" :insights="insights" />
          <div v-else class="card animate-pulse space-y-3 p-5" role="status" aria-label="Loading insights">
            <div v-for="n in 3" :key="n" class="h-14 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AppCard from '@/components/ui/AppCard.vue'
import MonthlySpendingChart from '@/components/charts/MonthlySpendingChart.vue'
import BalanceCard from '@/components/dashboard/BalanceCard.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import InsightList from '@/components/dashboard/InsightList.vue'
import SecurityAlertBanner from '@/components/dashboard/SecurityAlertBanner.vue'
import { useAccountStore } from '@/stores/account'
import { useTransactionStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useGreeting } from '@/composables/useGreeting'
import { formatNaira } from '@/utils/formatCurrency'

const accountStore = useAccountStore()
const txnStore = useTransactionStore()
const auth = useAuthStore()

const { greeting, firstName, today } = useGreeting(auth.user?.name)
const initials = computed(() => {
  const name = auth.user?.name ?? 'AO'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
})

const range = ref(6)
const rangeOptions = [
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
]

const accountLoading = computed(() => accountStore.loading && !accountStore.account)
const txnLoading = computed(() => txnStore.loading && txnStore.summary.length === 0)
const loadError = computed(() => accountStore.error || txnStore.error)
const recent = computed(() => txnStore.recent)
const insights = computed(() => txnStore.insights)

const chartSlice = computed(() => txnStore.summary.slice(-range.value))
const totals = computed(() => {
  const income = chartSlice.value.reduce((s, m) => s + m.income, 0)
  const expenses = chartSlice.value.reduce((s, m) => s + m.expenses, 0)
  return { income, expenses, saved: Math.max(0, income - expenses) }
})

function reload() {
  accountStore.fetchAccount()
  txnStore.fetchDashboard()
}

onMounted(() => {
  if (!accountStore.account) accountStore.fetchAccount()
  if (txnStore.summary.length === 0) txnStore.fetchDashboard()
})
</script>
