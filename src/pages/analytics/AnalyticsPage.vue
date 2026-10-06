<template>
  <AppLayout>
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="page-title">Analytics</h1>
        <p class="mt-1 text-sm text-slate-500">Where your money goes, computed from your activity.</p>
      </div>
      <div class="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium" role="group" aria-label="Analytics range">
        <button
          v-for="opt in rangeOptions"
          :key="opt.months"
          type="button"
          class="rounded-md px-3 py-1.5"
          :class="range === opt.months ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'"
          :aria-pressed="range === opt.months"
          @click="range = opt.months"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load analytics</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="load">
        Try again
      </button>
    </div>

    <div v-else-if="loading" class="mt-6 space-y-4" role="status" aria-label="Loading analytics">
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="card h-24 animate-pulse bg-slate-100" />
      </div>
      <div class="card h-72 animate-pulse bg-slate-100" />
    </div>

    <template v-else>
      <!-- KPIs -->
      <dl class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="card p-4">
          <dt class="label">Money in</dt>
          <dd class="tnum mt-1 text-xl font-semibold text-green-700">{{ formatNaira(kpis.income) }}</dd>
        </div>
        <div class="card p-4">
          <dt class="label">Money out</dt>
          <dd class="tnum mt-1 text-xl font-semibold text-slate-900">{{ formatNaira(kpis.expenses) }}</dd>
        </div>
        <div class="card p-4">
          <dt class="label">Net saved</dt>
          <dd class="tnum mt-1 text-xl font-semibold text-brand-700">{{ formatNaira(kpis.saved) }}</dd>
        </div>
        <div class="card p-4">
          <dt class="label">Savings rate</dt>
          <dd class="tnum mt-1 text-xl font-semibold text-slate-900">{{ kpis.savingsRate }}%</dd>
        </div>
      </dl>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <!-- Category breakdown -->
        <AppCard title="Spending by category">
          <div class="h-56"><DoughnutChart :labels="categories.map((c) => c.category)" :values="categories.map((c) => c.amount)" /></div>
          <ul class="mt-4 space-y-2.5">
            <li v-for="c in categories" :key="c.category">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-slate-700">{{ c.category }}</span>
                <span class="tnum font-semibold text-slate-900">{{ formatNaira(c.amount) }} <span class="font-normal text-slate-400">· {{ c.share }}%</span></span>
              </div>
              <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full bg-brand-600" :style="{ width: c.share + '%' }" />
              </div>
            </li>
          </ul>
        </AppCard>

        <!-- Weekly spending -->
        <AppCard title="Weekly spending">
          <template #action><span class="text-xs text-slate-400">Last 8 weeks</span></template>
          <div class="h-56">
            <WeeklySpendingChart :labels="weekly.map((w) => w.label)" :values="weekly.map((w) => w.total)" />
          </div>
          <p class="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{{ weeklyInsight }}</p>
        </AppCard>
      </div>

      <!-- Monthly comparison -->
      <AppCard title="Income vs expenses" class="mt-4">
        <div class="h-64">
          <MonthlySpendingChart
            :labels="summary.map((m) => m.label)"
            :income="summary.map((m) => m.income)"
            :expenses="summary.map((m) => m.expenses)"
            aria-label="Monthly income versus expenses chart"
          />
        </div>
      </AppCard>

      <!-- Automated insights -->
      <AppCard title="What changed" class="mt-4">
        <ul class="space-y-3">
          <li v-for="insight in autoInsights" :key="insight" class="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <Sparkles class="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <span>{{ insight }}</span>
          </li>
        </ul>
      </AppCard>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import AppCard from '@/components/ui/AppCard.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import WeeklySpendingChart from '@/components/charts/WeeklySpendingChart.vue'
import MonthlySpendingChart from '@/components/charts/MonthlySpendingChart.vue'
import {
  fetchCategoryTotalsRequest,
  fetchMonthlySummaryRequest,
  fetchWeeklySpendingRequest,
} from '@/services/transaction.service'
import { formatNaira } from '@/utils/formatCurrency'

const rangeOptions = [
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
]
const range = ref(6)

const loading = ref(false)
const error = ref('')
const categories = ref([])
const categoryTotal = ref(0)
const weekly = ref([])
const summary = ref([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [cat, week, monthly] = await Promise.all([
      fetchCategoryTotalsRequest(range.value),
      fetchWeeklySpendingRequest(8),
      fetchMonthlySummaryRequest(6),
    ])
    categories.value = cat.rows
    categoryTotal.value = cat.total
    weekly.value = week
    summary.value = monthly
  } catch (err) {
    error.value = err.message || 'Something went wrong. Try again.'
  } finally {
    loading.value = false
  }
}

const kpis = computed(() => {
  const income = summary.value.slice(-range.value).reduce((s, m) => s + m.income, 0)
  const expenses = summary.value.slice(-range.value).reduce((s, m) => s + m.expenses, 0)
  const saved = Math.max(0, income - expenses)
  return { income, expenses, saved, savingsRate: income === 0 ? 0 : Math.round((saved / income) * 100) }
})

const weeklyInsight = computed(() => {
  if (weekly.value.length === 0) return ''
  const peak = weekly.value.reduce((a, b) => (b.total > a.total ? b : a))
  return `Your biggest week started ${peak.label} at ${formatNaira(peak.total)}. Most weeks stay under ${formatNaira(60000)}.`
})

const autoInsights = computed(() => {
  const out = []
  if (categories.value.length > 0) {
    const top = categories.value[0]
    out.push(`${top.category} is your biggest expense at ${formatNaira(top.amount)} — ${top.share}% of spending in this period.`)
  }
  const months = summary.value.slice(-range.value)
  if (months.length >= 2) {
    const last = months[months.length - 1]
    const prev = months[months.length - 2]
    if (prev.expenses > 0) {
      const delta = Math.round(((last.expenses - prev.expenses) / prev.expenses) * 100)
      out.push(delta <= 0
        ? `Spending fell ${Math.abs(delta)}% from ${prev.label} to ${last.label}.`
        : `Spending rose ${delta}% from ${prev.label} to ${last.label}.`)
    }
  }
  out.push(`You're keeping ${kpis.value.savingsRate}% of income — ${kpis.value.savingsRate >= 20 ? 'above' : 'below'} the 20% rule of thumb.`)
  return out
})

watch(range, load)

onMounted(load)
</script>
