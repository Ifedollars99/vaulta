/**
 * Deterministic risk bands for the simulated fraud display.
 * This is a portfolio simulation — not a real fraud engine.
 */

export function riskBand(score) {
  const value = Number(score ?? 0)
  if (value > 70) return { label: 'High risk', tone: 'high' }
  if (value >= 40) return { label: 'Medium risk', tone: 'medium' }
  return { label: 'Low risk', tone: 'low' }
}
