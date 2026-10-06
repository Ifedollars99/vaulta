import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchAdminRequest,
  setCustomerStatusRequest,
  triageTransactionRequest,
} from '@/services/admin.service'
import { useAuthStore } from '@/stores/auth'

/**
 * Operations console state. Every mutating action appends an audit entry —
 * traceability is the point of this console.
 */
export const useAdminStore = defineStore('admin', () => {
  const customers = ref([])
  const transactions = ref([])
  const auditLogs = ref([])
  const loading = ref(false)
  const error = ref('')
  const contacted = ref({})

  const kpis = computed(() => {
    const settled = transactions.value.filter((t) => t.status === 'Completed')
    const volume = settled.reduce((s, t) => s + t.amount, 0)
    const latestDay = transactions.value
      .map((t) => t.date.slice(0, 10))
      .sort()
      .at(-1)
    const daily = settled
      .filter((t) => t.date.slice(0, 10) === latestDay)
      .reduce((s, t) => s + t.amount, 0)
    return {
      totalCustomers: customers.value.length,
      activeCustomers: customers.value.filter((c) => c.status === 'Active').length,
      volume,
      dailyVolume: daily,
      dailyLabel: latestDay,
      failed: transactions.value.filter((t) => t.status === 'Failed').length,
      pending: transactions.value.filter((t) => t.status === 'Pending').length,
      fraudAlerts: transactions.value.filter((t) => Number(t.riskScore) > 70).length,
    }
  })

  const fraudQueue = computed(() =>
    [...transactions.value]
      .filter((t) => Number(t.riskScore) >= 40)
      .sort((a, b) => b.riskScore - a.riskScore)
  )

  function log(event, action) {
    const auth = useAuthStore()
    auditLogs.value.unshift({
      id: `aud_${Date.now()}`,
      event,
      actor: `${auth.user?.name ?? 'Ops'} (Ops)`,
      action,
      timestamp: new Date().toISOString(),
      location: 'Lagos, NG',
    })
  }

  async function fetchAll() {
    if (transactions.value.length > 0) return
    loading.value = true
    error.value = ''
    try {
      const res = await fetchAdminRequest()
      customers.value = res.customers
      transactions.value = res.transactions
      auditLogs.value = res.auditLogs
    } catch (err) {
      error.value = err.message || 'Something went wrong. Try again.'
    } finally {
      loading.value = false
    }
  }

  async function ensureLoaded() {
    await fetchAll()
  }

  function customerVolume(name) {
    return transactions.value
      .filter((t) => t.customer === name && t.status === 'Completed')
      .reduce((s, t) => s + t.amount, 0)
  }

  function customerTransactions(name, limit = 8) {
    return transactions.value.filter((t) => t.customer === name).slice(0, limit)
  }

  function customerAlerts(name) {
    return transactions.value.filter((t) => t.customer === name && Number(t.riskScore) > 70)
  }

  async function triage(id, decision) {
    await triageTransactionRequest(id, decision)
    const txn = transactions.value.find((t) => t.id === id)
    if (!txn) return
    if (decision === 'approve') txn.status = 'Completed'
    if (decision === 'block') txn.status = 'Failed'
    if (decision === 'contact') contacted.value[id] = true
    const verb = decision === 'approve' ? 'Approved' : decision === 'block' ? 'Blocked' : 'Contacted customer about'
    log('Fraud alert reviewed', `${verb} ${txn.reference} (${txn.customer})`)
  }

  async function setCustomerStatus(id, status) {
    await setCustomerStatusRequest(id, status)
    const customer = customers.value.find((c) => c.id === id)
    if (!customer) return
    customer.status = status
    log(
      status === 'Active' ? 'Account reactivated' : `Account ${status.toLowerCase()}`,
      `${status} ${customer.name}`
    )
  }

  function logCustomerView(name) {
    log('Customer viewed', `Opened profile: ${name}`)
  }

  return {
    customers, transactions, auditLogs, loading, error, contacted,
    kpis, fraudQueue,
    fetchAll, ensureLoaded, customerVolume, customerTransactions, customerAlerts,
    triage, setCustomerStatus, logCustomerView,
  }
})
