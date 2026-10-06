import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import {
  fetchInsightsRequest,
  fetchMonthlySummaryRequest,
  fetchRecentTransactionsRequest,
  fetchTransactionByIdRequest,
  fetchTransactionsRequest,
} from '@/services/transaction.service'
import { usePagination } from '@/composables/usePagination'

export const STATUSES = ['All', 'Completed', 'Pending', 'Failed', 'Reversed']
export const DIRECTIONS = [
  { value: 'All', label: 'All types' },
  { value: 'credit', label: 'Money in' },
  { value: 'debit', label: 'Money out' },
]
export const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amountHigh', label: 'Amount: high to low' },
  { value: 'amountLow', label: 'Amount: low to high' },
]

/**
 * Dashboard state + full transaction management. Filters live here so
 * going detail → back preserves the list exactly as the user left it.
 */
export const useTransactionStore = defineStore('transactions', () => {
  const all = ref([])
  const recent = ref([])
  const summary = ref([])
  const insights = ref(null)
  const loading = ref(false)
  const error = ref('')
  const listLoading = ref(false)
  const listError = ref('')
  const selected = ref(null)
  const selectedLoading = ref(false)
  const selectedError = ref('')

  const filters = reactive({
    search: '',
    category: 'All',
    status: 'All',
    direction: 'All',
    from: '',
    to: '',
    minAmount: '',
    maxAmount: '',
  })
  const sort = ref('newest')

  const categories = computed(() => {
    const set = new Set(all.value.map((t) => t.category))
    return ['All', ...[...set].sort()]
  })

  const filtered = computed(() => {
    const q = filters.search.trim().toLowerCase()
    const from = filters.from ? new Date(filters.from) : null
    const to = filters.to ? new Date(`${filters.to}T23:59:59`) : null
    const min = filters.minAmount === '' ? null : Number(filters.minAmount)
    const max = filters.maxAmount === '' ? null : Number(filters.maxAmount)

    const list = all.value.filter((t) => {
      if (q && !`${t.counterparty} ${t.reference} ${t.category}`.toLowerCase().includes(q)) return false
      if (filters.category !== 'All' && t.category !== filters.category) return false
      if (filters.status !== 'All' && t.status !== filters.status) return false
      if (filters.direction !== 'All' && t.direction !== filters.direction) return false
      const d = new Date(t.date)
      if (from && d < from) return false
      if (to && d > to) return false
      if (min !== null && t.amount < min) return false
      if (max !== null && t.amount > max) return false
      return true
    })

    const by = {
      newest: (a, b) => new Date(b.date) - new Date(a.date),
      oldest: (a, b) => new Date(a.date) - new Date(b.date),
      amountHigh: (a, b) => b.amount - a.amount,
      amountLow: (a, b) => a.amount - b.amount,
    }[sort.value]
    return [...list].sort(by)
  })

  const activeFilterCount = computed(() => {
    let n = 0
    if (filters.search.trim()) n += 1
    if (filters.category !== 'All') n += 1
    if (filters.status !== 'All') n += 1
    if (filters.direction !== 'All') n += 1
    if (filters.from || filters.to) n += 1
    if (filters.minAmount !== '' || filters.maxAmount !== '') n += 1
    return n
  })

  const pagination = usePagination(filtered, {
    perPage: 10,
    resetOn: () => [
      filters.search,
      filters.category,
      filters.status,
      filters.direction,
      filters.from,
      filters.to,
      filters.minAmount,
      filters.maxAmount,
      sort.value,
    ],
  })

  function resetFilters() {
    filters.search = ''
    filters.category = 'All'
    filters.status = 'All'
    filters.direction = 'All'
    filters.from = ''
    filters.to = ''
    filters.minAmount = ''
    filters.maxAmount = ''
    sort.value = 'newest'
  }

  async function ensureLoaded() {
    if (all.value.length > 0) return
    listLoading.value = true
    listError.value = ''
    try {
      all.value = await fetchTransactionsRequest()
    } catch (err) {
      listError.value = err.message || 'Something went wrong. Try again.'
    } finally {
      listLoading.value = false
    }
  }

  async function fetchDashboard() {
    loading.value = true
    error.value = ''
    try {
      const [recentRes, summaryRes, insightsRes] = await Promise.all([
        fetchRecentTransactionsRequest(6),
        fetchMonthlySummaryRequest(6),
        fetchInsightsRequest(),
      ])
      recent.value = recentRes
      summary.value = summaryRes
      insights.value = insightsRes
    } catch (err) {
      error.value = err.message || 'Something went wrong. Try again.'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    selectedLoading.value = true
    selectedError.value = ''
    selected.value = null
    try {
      await ensureLoaded()
      selected.value = all.value.find((t) => t.id === id) ?? (await fetchTransactionByIdRequest(id))
    } catch (err) {
      selectedError.value = err.message || 'Something went wrong. Try again.'
    } finally {
      selectedLoading.value = false
    }
  }

  /**
   * Commits a settled transfer: newest-first in the list. Dashboard
   * recent/summary refresh on next fetch — single commit point.
   */
  function addTransaction(record) {
    all.value.unshift(record)
    recent.value = [...all.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
  }

  return {
    all, recent, summary, insights, loading, error,
    listLoading, listError, selected, selectedLoading, selectedError,
    filters, sort, categories, filtered, activeFilterCount, pagination,
    resetFilters, ensureLoaded, fetchDashboard, fetchById, addTransaction,
  }
})
