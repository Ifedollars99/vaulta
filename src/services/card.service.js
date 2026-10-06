import { simulate } from './api'
import { cardsSeed } from '@/data/cards'

/**
 * Simulated card service. Replace with real HTTP later.
 */
export async function fetchCardsRequest() {
  return simulate(cardsSeed, { delay: 500 })
}

export async function setCardStatusRequest(id, status) {
  return simulate({ id, status }, { delay: 400 })
}

export async function updateCardLimitRequest(id, monthlyLimit) {
  const value = Number(monthlyLimit)
  if (!Number.isFinite(value) || value < 50000) {
    return simulate(null, { delay: 300 }).then(() => {
      throw new Error('Spending limit must be at least ₦50,000.')
    })
  }
  return simulate({ id, monthlyLimit: value }, { delay: 400 })
}

export async function replaceCardRequest(id) {
  const last4 = String(Math.floor(1000 + Math.random() * 9000))
  return simulate(
    {
      id,
      pan: `5061 2004 ${String(Math.floor(1000 + Math.random() * 9000))} ${last4}`,
      expiry: '10/29',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      status: 'Active',
      spentThisMonth: 0,
    },
    { delay: 800 }
  )
}
