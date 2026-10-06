import { simulate } from './api'
import { transactionsSeed } from '@/data/transactions'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}

function sortedByDateDesc(list) {
  return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Simulated transaction service. Replace internals with real HTTP later —
 * return shapes are the contract stores and pages rely on.
 */
export async function fetchTransactionsRequest() {
  return simulate(sortedByDateDesc(transactionsSeed), { delay: 600 })
}

export async function fetchRecentTransactionsRequest(limit = 6) {
  return simulate(sortedByDateDesc(transactionsSeed).slice(0, limit), { delay: 500 })
}

export async function fetchMonthlySummaryRequest(monthCount = 6) {
  const buckets = new Map()
  for (const t of transactionsSeed) {
    if (t.status === 'Failed' || t.status === 'Reversed') continue
    const key = monthKey(t.date)
    if (!buckets.has(key)) buckets.set(key, { key, label: monthLabel(key), income: 0, expenses: 0 })
    const bucket = buckets.get(key)
    if (t.direction === 'credit') bucket.income += t.amount
    else bucket.expenses += t.amount
  }
  const sorted = [...buckets.values()].sort((a, b) => (a.key < b.key ? -1 : 1))
  return simulate(sorted.slice(-monthCount), { delay: 600 })
}

export async function fetchTransactionByIdRequest(id) {  const found = transactionsSeed.find((t) => t.id === id)
  if (!found) {
    return simulate(null, { delay: 400 }).then(() => {
      throw new Error('Transaction not found. It may have been removed.')
    })
  }
  return simulate({ ...found }, { delay: 400 })
}

/**
 * Category totals over the trailing N months (settled debits only).
 */
export async function fetchCategoryTotalsRequest(monthCount = 6) {
  const cutoff = new Date(sortedByDateDesc(transactionsSeed)[0].date)
  cutoff.setMonth(cutoff.getMonth() - monthCount)
  const map = new Map()
  let total = 0
  for (const t of transactionsSeed) {
    if (t.status !== 'Completed' || t.direction !== 'debit') continue
    if (new Date(t.date) < cutoff) continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    total += t.amount
  }
  const rows = [...map.entries()]
    .map(([category, amount]) => ({ category, amount, share: total === 0 ? 0 : Math.round((amount / total) * 100) }))
    .sort((a, b) => b.amount - a.amount)
  return simulate({ rows, total }, { delay: 500 })
}

/**
 * Weekly debit totals for the trailing N weeks, oldest → newest.
 */
export async function fetchWeeklySpendingRequest(weeks = 8) {
  const latest = new Date(sortedByDateDesc(transactionsSeed)[0].date)
  // Anchor weeks to Monday for stable labels.
  const anchor = new Date(latest)
  anchor.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7))
  anchor.setHours(0, 0, 0, 0)

  const buckets = []
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const start = new Date(anchor)
    start.setDate(start.getDate() - i * 7)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    buckets.push({ start, end, total: 0 })
  }

  for (const t of transactionsSeed) {
    if (t.status !== 'Completed' || t.direction !== 'debit') continue
    const d = new Date(t.date)
    const bucket = buckets.find((b) => d >= b.start && d <= b.end)
    if (bucket) bucket.total += t.amount
  }

  const fmt = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short' })
  return simulate(
    buckets.map((b) => ({ label: fmt.format(b.start), total: b.total })),
    { delay: 500 }
  )
}

/**
 * Insights are computed from the seed — not hardcoded — so they stay
 * consistent if the data changes. Compares latest full month vs previous.
 */
export async function fetchInsightsRequest() {
  const settled = transactionsSeed.filter((t) => t.status === 'Completed' && t.direction === 'debit')
  const keys = [...new Set(settled.map((t) => monthKey(t.date)))].sort()
  // The newest month is usually still in progress (partial data), so compare
  // the latest *full* month against the one before it for honest percentages.
  const newestMonth = monthKey(sortedByDateDesc(transactionsSeed)[0].date)
  const fullKeys = keys.filter((k) => k !== newestMonth)
  const latest = fullKeys[fullKeys.length - 1]
  const previous = fullKeys[fullKeys.length - 2]

  const totalFor = (key) => settled.filter((t) => monthKey(t.date) === key).reduce((s, t) => s + t.amount, 0)

  const latestTotal = totalFor(latest)
  const previousTotal = totalFor(previous)
  const spendingDelta = previousTotal === 0 ? 0 : Math.round(((latestTotal - previousTotal) / previousTotal) * 100)

  const catTotals = (key) => {
    const map = new Map()
    for (const t of settled.filter((t) => monthKey(t.date) === key)) {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    }
    return map
  }
  const latestCats = catTotals(latest)
  const prevCats = catTotals(previous)

  let riser = null
  for (const [cat, total] of latestCats) {
    const prev = prevCats.get(cat) ?? 0
    if (prev === 0) continue
    const delta = Math.round(((total - prev) / prev) * 100)
    if (!riser || delta > riser.delta) riser = { category: cat, delta }
  }

  const monthIncome = transactionsSeed
    .filter((t) => t.status === 'Completed' && t.direction === 'credit' && monthKey(t.date) === latest)
    .reduce((s, t) => s + t.amount, 0)
  const savingsRate = monthIncome === 0 ? 0 : Math.max(0, Math.round(((monthIncome - latestTotal) / monthIncome) * 100))

  return simulate(
    { monthLabel: monthLabel(latest), spendingDelta, riser, savingsRate },
    { delay: 400 }
  )
}
