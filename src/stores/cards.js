import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchCardsRequest,
  replaceCardRequest,
  setCardStatusRequest,
  updateCardLimitRequest,
} from '@/services/card.service'

const REVEAL_MS = 30000

/**
 * Card state. PAN/CVV reveal is time-boxed and per-card — the store
 * auto re-masks, so no component can leak details by forgetting.
 */
export const useCardStore = defineStore('cards', () => {
  const cards = ref([])
  const loading = ref(false)
  const error = ref('')
  const revealed = ref({})
  const actionLoading = ref({})
  let revealTimers = {}

  async function fetchAll() {
    if (cards.value.length > 0) return cards.value
    loading.value = true
    error.value = ''
    try {
      cards.value = await fetchCardsRequest()
      return cards.value
    } catch (err) {
      error.value = err.message || 'Something went wrong. Try again.'
      return []
    } finally {
      loading.value = false
    }
  }

  function reveal(id) {
    clearTimeout(revealTimers[id])
    revealed.value[id] = true
    revealTimers[id] = setTimeout(() => {
      revealed.value[id] = false
    }, REVEAL_MS)
  }

  function conceal(id) {
    clearTimeout(revealTimers[id])
    revealed.value[id] = false
  }

  function isRevealed(id) {
    return Boolean(revealed.value[id])
  }

  async function setStatus(id, status) {
    actionLoading.value[id] = true
    try {
      await setCardStatusRequest(id, status)
      const card = cards.value.find((c) => c.id === id)
      if (card) card.status = status
      if (status === 'Frozen') conceal(id)
    } finally {
      actionLoading.value[id] = false
    }
  }

  async function updateLimit(id, monthlyLimit) {
    actionLoading.value[id] = true
    try {
      const res = await updateCardLimitRequest(id, monthlyLimit)
      const card = cards.value.find((c) => c.id === id)
      if (card) card.monthlyLimit = res.monthlyLimit
    } finally {
      actionLoading.value[id] = false
    }
  }

  async function replace(id) {
    actionLoading.value[id] = true
    try {
      const res = await replaceCardRequest(id)
      const card = cards.value.find((c) => c.id === id)
      if (card) Object.assign(card, res)
      conceal(id)
    } finally {
      actionLoading.value[id] = false
    }
  }

  return { cards, loading, error, revealed, actionLoading, fetchAll, reveal, conceal, isRevealed, setStatus, updateLimit, replace }
})
