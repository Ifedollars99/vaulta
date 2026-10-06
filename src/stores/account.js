import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAccountRequest } from '@/services/account.service'

/**
 * Canonical account state: balance, masking preference, copy helper.
 * showBalance persists — everything else is session-fresh.
 */
export const useAccountStore = defineStore('account', () => {
  const account = ref(null)
  const loading = ref(false)
  const error = ref('')
  const showBalance = ref(true)
  const copied = ref(false)
  let copyTimer = null

  try {
    showBalance.value = localStorage.getItem('vaulta.showBalance') !== 'hidden'
  } catch {
    // Storage unavailable — default to visible.
  }

  async function fetchAccount() {
    loading.value = true
    error.value = ''
    try {
      account.value = await fetchAccountRequest()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function toggleBalance() {    showBalance.value = !showBalance.value
    try {
      localStorage.setItem('vaulta.showBalance', showBalance.value ? 'visible' : 'hidden')
    } catch {
      // Non-critical preference.
    }
  }

  async function copyAccountNumber() {
    if (!account.value) return false
    const text = account.value.accountNumber
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
    return true
  }

  /**
   * Settles a completed transfer against the balance. Only called after
   * the (simulated) transfer API confirms — never optimistically.
   */
  function applyDebit(total) {
    if (account.value) account.value.balance = Math.max(0, account.value.balance - Number(total))
  }

  return { account, loading, error, showBalance, copied, fetchAccount, toggleBalance, copyAccountNumber, applyDebit }
})
