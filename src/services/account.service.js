import { simulate } from './api'
import { accountSeed } from '@/data/users'

/**
 * Simulated account service. Replace with real HTTP later.
 */
export async function fetchAccountRequest() {
  return simulate({ ...accountSeed }, { delay: 500 })
}
