/**
 * Transfer pricing + simulated risk rules. Deterministic and explainable —
 * the same rules surface as reasons in the Phase 7 fraud queue.
 */

export const TRANSFER_FEE = 25
export const TRANSFER_MIN = 100
export const DEMO_TRANSFER_PIN = '1234'

export function transferFee() {
  return TRANSFER_FEE
}

export function transferTotal(amount) {
  return Number(amount ?? 0) + TRANSFER_FEE
}

/**
 * Lightweight simulated risk assessment. Returns score 0–100 plus
 * machine-readable flags. Not a real fraud engine.
 */
export function assessTransferRisk({ amount, beneficiary, date = new Date() }) {
  let score = 10
  const flags = []

  if (Number(amount) >= 500000) {
    score += 45
    flags.push('unusual_amount')
  } else if (Number(amount) >= 200000) {
    score += 20
    flags.push('large_amount')
  }
  if (beneficiary?.isNew) {
    score += 30
    flags.push('new_beneficiary')
  }
  const hour = new Date(date).getHours()
  if (hour < 5 || hour >= 23) {
    score += 12
    flags.push('unusual_time')
  }
  if (beneficiary && !beneficiary.favorite && Number(amount) >= 100000) {
    score += 8
    flags.push('non_favorite_large')
  }

  return { score: Math.min(100, score), flags }
}

export function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 6; i += 1) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `VAU-${suffix}`
}
