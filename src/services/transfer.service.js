import { simulate } from './api'
import { assessTransferRisk, generateReference, transferFee } from '@/utils/transfer'

/**
 * Simulated transfer service. Quote is computed locally; execute pretends
 * to hit a payments API and resolves the risk decision with the record.
 */
export async function quoteTransferRequest({ amount }) {
  const value = Number(amount ?? 0)
  if (!Number.isFinite(value) || value <= 0) {
    return simulate(null, { delay: 200 }).then(() => {
      throw new Error('Enter an amount greater than ₦0.')
    })
  }
  return simulate({ amount: value, fee: transferFee(), total: value + transferFee() }, { delay: 300 })
}

export async function executeTransferRequest({ amount, beneficiary, description, category }) {
  const { score, flags } = assessTransferRisk({ amount, beneficiary })
  const status = score > 70 ? 'Pending' : 'Completed'
  const now = new Date().toISOString()
  const record = {
    id: `txn_${Date.now()}`,
    reference: generateReference(),
    amount: Number(amount),
    direction: 'debit',
    status,
    category: category ?? 'Transfers',
    counterparty: beneficiary.name,
    bank: beneficiary.bank,
    accountNumber: beneficiary.accountNumber,
    date: now,
    location: 'Lagos',
    device: 'iPhone 14 · Lagos',
    description: description ?? '',
    riskScore: score,
    riskFlags: flags,
  }
  return simulate({ record, fee: transferFee(), total: Number(amount) + transferFee() }, { delay: 1200 })
}
