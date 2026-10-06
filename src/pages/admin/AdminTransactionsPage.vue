<template>
  <AdminLayout>
    <h1 class="page-title">Transactions</h1>
    <p class="mt-1 text-sm text-slate-500">Every movement across the platform. Select a row to investigate.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load transactions</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="card mt-6 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input v-model="query" type="search" placeholder="Search customer, reference or counterparty…" class="input pl-9" aria-label="Search platform transactions" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <select v-model="status" class="input" aria-label="Filter by status">
            <option value="All">All statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Reversed</option>
          </select>
          <select v-model="band" class="input" aria-label="Filter by risk band">
            <option value="All">All risk</option>
            <option value="high">High (&gt;70)</option>
            <option value="medium">Medium (40–70)</option>
            <option value="low">Low (&lt;40)</option>
          </select>
          <select v-model="sort" class="input" aria-label="Sort platform transactions">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="risk">Highest risk</option>
            <option value="amount">Largest amount</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="card mt-4 animate-pulse space-y-3 p-5" role="status" aria-label="Loading transactions">
        <div v-for="n in 8" :key="n" class="h-12 rounded bg-slate-100" />
      </div>

      <template v-else>
        <AppEmptyState v-if="filtered.length === 0" title="No transactions match" message="Widen the search or clear the filters." class="mt-4" />

        <template v-else>
          <div class="card mt-4 hidden overflow-x-auto lg:block">
            <table class="w-full min-w-[900px] text-left text-sm">
              <caption class="sr-only">Platform transactions</caption>
              <thead>
                <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" class="px-4 py-3 font-medium">Reference</th>
                  <th scope="col" class="px-4 py-3 font-medium">Customer</th>
                  <th scope="col" class="px-4 py-3 text-right font-medium">Amount</th>
                  <th scope="col" class="px-4 py-3 font-medium">Type</th>
                  <th scope="col" class="px-4 py-3 font-medium">Status</th>
                  <th scope="col" class="px-4 py-3 text-right font-medium">Risk</th>
                  <th scope="col" class="px-4 py-3 font-medium">Location</th>
                  <th scope="col" class="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="t in paged" :key="t.id" class="cursor-pointer hover:bg-slate-50" @click="open(t)">
                  <td class="tnum px-4 py-3 font-mono text-xs text-slate-500">{{ t.reference }}</td>
                  <td class="px-4 py-3 font-medium text-slate-900">{{ t.customer }}</td>
                  <td class="tnum px-4 py-3 text-right font-semibold text-slate-900">{{ formatNaira(t.amount) }}</td>
                  <td class="px-4 py-3 text-slate-600">{{ t.direction === 'credit' ? 'In' : 'Out' }}</td>
                  <td class="px-4 py-3"><AppBadge :status="t.status" /></td>
                  <td class="px-4 py-3 text-right">
                    <span class="tnum font-semibold" :class="riskColor(t.riskScore)">{{ t.riskScore }}</span>
                  </td>
                  <td class="px-4 py-3 text-slate-600">{{ t.location }}</td>
                  <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ formatDate(t.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul class="mt-4 space-y-2 lg:hidden">
            <li v-for="t in paged" :key="t.id" class="card p-4" @click="open(t)">
              <div class="flex justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-slate-900">{{ t.customer }}</p>
                  <p class="font-mono text-xs text-slate-400">{{ t.reference }}</p>
                </div>
                <p class="tnum shrink-0 text-sm font-semibold">{{ formatNaira(t.amount) }}</p>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <AppBadge :status="t.status" />
                <span class="tnum text-xs font-semibold" :class="riskColor(t.riskScore)">Risk {{ t.riskScore }}</span>
                <span class="text-xs text-slate-400">{{ formatDate(t.date) }}</span>
              </div>
            </li>
          </ul>

          <div class="mt-4">
            <AppPagination
              :page="pagination.page"
              :total-pages="pagination.totalPages"
              :total-items="pagination.totalItems"
              :per-page="pagination.perPage"
              @goto="pagination.goto"
              @prev="pagination.prev"
              @next="pagination.next"
            />
          </div>
        </template>
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
import { Search } from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import TxnDrawer from '@/components/admin/TxnDrawer.vue'
import { useAdminStore } from '@/stores/admin'
import { usePagination } from '@/composables/usePagination'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const store = useAdminStore()

const query = ref('')
const status = ref('All')
const band = ref('All')
const sort = ref('newest')
const selected = ref(null)

const loading = computed(() => store.loading && store.transactions.length === 0)
const error = computed(() => store.error)

function bandOf(score) {
  if (score > 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = store.transactions.filter((t) => {
    if (q && !`${t.customer} ${t.counterparty} ${t.reference}`.toLowerCase().includes(q)) return false
    if (status.value !== 'All' && t.status !== status.value) return false
    if (band.value !== 'All' && bandOf(Number(t.riskScore)) !== band.value) return false
    return true
  })
  const sorts = {
    newest: (a, b) => new Date(b.date) - new Date(a.date),
    oldest: (a, b) => new Date(a.date) - new Date(b.date),
    risk: (a, b) => b.riskScore - a.riskScore,
    amount: (a, b) => b.amount - a.amount,
  }
  return [...list].sort(sorts[sort.value])
})

const pagination = usePagination(filtered, {
  perPage: 10,
  resetOn: () => [query.value, status.value, band.value, sort.value],
})
const paged = computed(() => pagination.paged)

function riskColor(score) {
  if (score > 70) return 'text-red-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-slate-400'
}

function open(t) {
  selected.value = t
}

async function onTriage({ id, decision }) {
  await store.triage(id, decision)
  selected.value = store.transactions.find((t) => t.id === id) ?? null
}

onMounted(() => store.ensureLoaded())
</script>
