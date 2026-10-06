/**
 * Vaulta formatting utilities.
 * All money rendering goes through formatNaira so currency,
 * decimals and sign handling stay consistent (see §32 Financial UX Rules).
 */

export function formatNaira(amount, { decimals = 2, withSymbol = true } = {}) {
  const value = Number(amount ?? 0)
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value))

  const sign = value < 0 ? '−' : ''
  return `${sign}${withSymbol ? '₦' : ''}${formatted}`
}

export function maskAccountNumber(accountNumber, visible = 4) {
  const digits = String(accountNumber ?? '')
  if (digits.length <= visible) return digits
  return `•••• ${digits.slice(-visible)}`
}

export function maskCardNumber(pan) {
  const digits = String(pan ?? '').replace(/\s/g, '')
  if (digits.length < 8) return '•••• •••• •••• ••••'
  return `•••• •••• •••• ${digits.slice(-4)}`
}

export function formatReference(ref) {
  return String(ref ?? '').toUpperCase()
}
