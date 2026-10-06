const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NG_PHONE_RE = /^(\+234|0)(70|80|81|90|91|71|79|78|77|76|75|74|73|70)\d{8}$/

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value ?? '').trim())
}

export function isValidNigerianPhone(value) {
  return NG_PHONE_RE.test(String(value ?? '').replace(/[\s-]/g, ''))
}

export function passwordStrength(password) {
  const value = String(password ?? '')
  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^a-zA-Z0-9]/.test(value)) score += 1

  if (score <= 2) return { score, label: 'Weak' }
  if (score <= 3) return { score, label: 'Fair' }
  if (score <= 4) return { score, label: 'Strong' }
  return { score, label: 'Excellent' }
}
