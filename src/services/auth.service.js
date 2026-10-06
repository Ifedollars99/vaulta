import { simulate } from './api'
import { demoCredentials, demoUsers } from '@/data/users'

const REGISTERED_KEY = 'vaulta.registeredUsers'

/**
 * Demo-only account persistence. Registered users are kept in localStorage
 * so they survive logout/refresh in the same browser. A real backend would
 * replace all of this with server-side identity — never store passwords
 * client-side in production.
 */
function readRegistered() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeRegistered(list) {
  try {
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(list))
  } catch {
    // Storage unavailable — registration still works for this session.
  }
}

function normalizePhone(value) {
  return String(value ?? '').replace(/[\s-]/g, '')
}

/**
 * Simulated auth service. Replace with real HTTP calls later —
 * stores already treat these as async API boundaries.
 */
export async function loginRequest({ identifier, password }) {
  const raw = String(identifier ?? '').trim()
  if (raw.includes('@')) {
    const value = raw.toLowerCase()
    const record = demoCredentials.find((c) => c.email.toLowerCase() === value)
    if (record && record.password === password) {
      const user = demoUsers.find((u) => u.id === record.userId)
      return simulate({ user, token: `sim_${user.id}` }, { delay: 800 })
    }
    const registered = readRegistered().find((r) => r.user.email.toLowerCase() === value)
    if (registered && registered.password === password) {
      return simulate({ user: registered.user, token: `sim_${registered.user.id}` }, { delay: 800 })
    }
  } else {
    const phone = normalizePhone(raw)
    const demoUser = demoUsers.find((u) => normalizePhone(u.phone) === phone)
    if (demoUser) {
      const record = demoCredentials.find((c) => c.userId === demoUser.id)
      if (record && record.password === password) {
        return simulate({ user: demoUser, token: `sim_${demoUser.id}` }, { delay: 800 })
      }
    } else {
      const registered = readRegistered().find((r) => normalizePhone(r.user.phone) === phone)
      if (registered && registered.password === password) {
        return simulate({ user: registered.user, token: `sim_${registered.user.id}` }, { delay: 800 })
      }
    }
  }
  return simulate({ ok: false }, { delay: 800 }).then(() => {
    throw new Error('Incorrect email or password. Check the demo credentials below and try again.')
  })
}

export async function registerRequest({ firstName, lastName, email, phone, city, dateOfBirth, password }) {
  const normalized = String(email).toLowerCase()
  const exists =
    demoUsers.some((u) => u.email.toLowerCase() === normalized) ||
    readRegistered().some((r) => r.user.email.toLowerCase() === normalized)
  if (exists) {
    return simulate({ ok: false }, { delay: 800 }).then(() => {
      throw new Error('An account with this email already exists. Try logging in instead.')
    })
  }
  const user = {
    id: `usr_${Date.now()}`,
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone,
    city,
    dateOfBirth,
    role: 'customer',
    kycStatus: 'Pending review',
    status: 'Active',
    accountNumber: `012345${String(Math.floor(1000 + Math.random() * 9000))}`,
  }
  return simulate({ user, token: `sim_${user.id}` }, { delay: 1000 }).then((res) => {
    const list = readRegistered()
    // NOTE: demo only. Real apps never persist passwords client-side.
    list.push({ user, password: password ?? '' })
    writeRegistered(list)
    return res
  })
}

export async function passwordResetRequest({ email }) {
  const known =
    demoUsers.some((u) => u.email.toLowerCase() === String(email).toLowerCase()) ||
    readRegistered().some((r) => r.user.email.toLowerCase() === String(email).toLowerCase())
  if (!known) {
    return simulate({ ok: false }, { delay: 800 }).then(() => {
      throw new Error('We could not find an account with that email address.')
    })
  }
  return simulate({ ok: true }, { delay: 800 })
}

export async function logoutRequest() {
  return simulate({ ok: true }, { delay: 200 })
}
