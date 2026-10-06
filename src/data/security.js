/**
 * Security seed — fictional devices and login history for the demo.
 * All monitoring displays are simulated.
 */

export const devicesSeed = [
  {
    id: 'dev_iphone',
    name: 'iPhone 14',
    kind: 'phone',
    location: 'Lagos, Nigeria',
    lastActive: '2026-10-06T07:42:00',
    trusted: true,
    current: true,
  },
  {
    id: 'dev_windows',
    name: 'Chrome on Windows',
    kind: 'pc',
    location: 'Lagos, Nigeria',
    lastActive: '2026-10-06T05:18:00',
    trusted: false,
    current: false,
  },
  {
    id: 'dev_android',
    name: 'Samsung Galaxy A54',
    kind: 'phone',
    location: 'Ibadan, Nigeria',
    lastActive: '2026-09-28T19:05:00',
    trusted: true,
    current: false,
  },
]

export const loginsSeed = [
  { id: 'log_1', event: 'New device sign-in', detail: 'Chrome on Windows · Lagos', date: '2026-10-06T05:18:00', tone: 'warning' },
  { id: 'log_2', event: 'Successful login', detail: 'iPhone 14 · Lagos', date: '2026-10-06T07:42:00', tone: 'ok' },
  { id: 'log_3', event: 'Failed login attempt', detail: 'Unknown device · Lagos', date: '2026-10-05T22:03:00', tone: 'bad' },
  { id: 'log_4', event: 'Successful login', detail: 'Samsung Galaxy A54 · Ibadan', date: '2026-09-28T19:05:00', tone: 'ok' },
  { id: 'log_5', event: 'Password changed', detail: 'iPhone 14 · Lagos', date: '2026-09-06T10:24:00', tone: 'ok' },
]

export const securitySettingsSeed = {
  twoFactor: true,
  loginAlerts: true,
  transactionApproval: true,
  biometric: false,
}

/**
 * Score model: base + enabled protections. Trusting all devices adds the
 * final points — so the demo score moves 84 → 87 when the user acts.
 */
export function computeScore(settings, devices) {
  const factors = []
  let score = 61
  factors.push({ label: 'Strong password + PIN confirmation', points: 61, active: true })
  if (settings.twoFactor) {
    score += 12
    factors.push({ label: 'Two-factor authentication', points: 12, active: true })
  }
  if (settings.loginAlerts) {
    score += 6
    factors.push({ label: 'Login alerts enabled', points: 6, active: true })
  }
  if (settings.transactionApproval) {
    score += 5
    factors.push({ label: 'Transfer PIN approval', points: 5, active: true })
  }
  const untrusted = devices.filter((d) => !d.trusted).length
  if (untrusted === 0) {
    score += 3
    factors.push({ label: 'All devices reviewed', points: 3, active: true })
  } else {
    factors.push({ label: `${untrusted} unreviewed device${untrusted === 1 ? '' : 's'}`, points: 0, active: false })
  }
  if (!settings.biometric) {
    factors.push({ label: 'Biometric login off', points: 0, active: false })
  }
  return { score: Math.min(100, score), factors }
}
