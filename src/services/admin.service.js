import { simulate } from './api'
import { auditSeed, customersSeed, platformTransactionsSeed } from '@/data/admin'
import { transactionsSeed } from '@/data/transactions'

/**
 * Simulated ops service. Platform transactions = cross-customer seeds
 * plus Adewale's own history with customer attribution.
 */
export async function fetchAdminRequest() {
  const adewale = transactionsSeed.map((t) => ({ ...t, customer: 'Adewale Ogunleye' }))
  const txns = [...platformTransactionsSeed.map((t) => ({ ...t })), ...adewale].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )
  return simulate(
    {
      customers: customersSeed.map((c) => ({ ...c })),
      transactions: txns,
      auditLogs: [...auditSeed].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    },
    { delay: 600 }
  )
}

export async function triageTransactionRequest(id, decision) {
  return simulate({ id, decision }, { delay: 500 })
}

export async function setCustomerStatusRequest(id, status) {
  return simulate({ id, status }, { delay: 500 })
}
