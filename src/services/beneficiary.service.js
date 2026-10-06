import { simulate } from './api'
import { beneficiariesSeed } from '@/data/beneficiaries'

/**
 * Simulated beneficiary service. Replace with real HTTP later.
 */
export async function fetchBeneficiariesRequest() {
  return simulate(beneficiariesSeed, { delay: 500 })
}

export async function createBeneficiaryRequest(payload) {
  if (!/^\d{10}$/.test(payload.accountNumber)) {
    return simulate(null, { delay: 400 }).then(() => {
      throw new Error('Account number must be exactly 10 digits.')
    })
  }
  return simulate(
    { ...payload, id: `ben_${Date.now()}`, lastTransfer: null, isNew: true },
    { delay: 600 }
  )
}

export async function updateBeneficiaryRequest(id, payload) {
  if (!/^\d{10}$/.test(payload.accountNumber)) {
    return simulate(null, { delay: 400 }).then(() => {
      throw new Error('Account number must be exactly 10 digits.')
    })
  }
  return simulate({ id, ...payload }, { delay: 500 })
}

export async function deleteBeneficiaryRequest() {
  return simulate({ ok: true }, { delay: 400 })
}
