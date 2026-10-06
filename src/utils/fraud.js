import { riskBand } from './riskScoring'

/**
 * Derives plain-language fraud reasons from a transaction's attributes.
 * Same rule family as the transfer-time scorer — simulated throughout.
 */
export function deriveFraudReasons(txn) {
  const reasons = []
  if (!txn) return reasons
  if (Number(txn.amount) >= 500000) reasons.push('Unusual amount for this customer')
  else if (Number(txn.amount) >= 200000) reasons.push('Large amount')
  if (/new beneficiary/i.test(txn.counterparty ?? '') || (txn.riskFlags ?? []).includes('new_beneficiary')) {
    reasons.push('New beneficiary')
  }
  if (/new device/i.test(txn.device ?? '') || /unknown device/i.test(txn.device ?? '')) {
    reasons.push('New or unrecognised device')
  }
  if (txn.location && txn.location !== 'Lagos') reasons.push(`Unusual location (${txn.location})`)
  const hour = new Date(txn.date).getHours()
  if (hour < 5 || hour >= 23) reasons.push('Unusual transaction time')
  if (txn.status === 'Failed') reasons.push('Prior failure on this trail')
  return reasons
}

export function fraudBand(txn) {
  return riskBand(txn?.riskScore ?? 0)
}

export function isHighRisk(txn) {
  return Number(txn?.riskScore ?? 0) > 70
}
