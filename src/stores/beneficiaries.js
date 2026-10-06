import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  createBeneficiaryRequest,
  deleteBeneficiaryRequest,
  fetchBeneficiariesRequest,
  updateBeneficiaryRequest,
} from '@/services/beneficiary.service'

/**
 * Beneficiary address book. Search stays local to the page;
 * the list itself is global because transfer + admin share it.
 */
export const useBeneficiaryStore = defineStore('beneficiaries', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref('')
  const saving = ref(false)
  const saveError = ref('')

  const favorites = computed(() => list.value.filter((b) => b.favorite))

  async function fetchAll() {
    if (list.value.length > 0) return list.value
    loading.value = true
    error.value = ''
    try {
      list.value = await fetchBeneficiariesRequest()
      return list.value
    } catch (err) {
      error.value = err.message || 'Something went wrong. Try again.'
      return []
    } finally {
      loading.value = false
    }
  }

  async function add(payload) {
    saving.value = true
    saveError.value = ''
    try {
      const created = await createBeneficiaryRequest(payload)
      list.value.unshift(created)
      return created
    } catch (err) {
      saveError.value = err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function update(id, payload) {
    saving.value = true
    saveError.value = ''
    try {
      const updated = await updateBeneficiaryRequest(id, payload)
      const index = list.value.findIndex((b) => b.id === id)
      if (index >= 0) list.value[index] = { ...list.value[index], ...updated }
      return updated
    } catch (err) {
      saveError.value = err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    await deleteBeneficiaryRequest(id)
    list.value = list.value.filter((b) => b.id !== id)
  }

  function toggleFavorite(id) {
    const ben = list.value.find((b) => b.id === id)
    if (ben) ben.favorite = !ben.favorite
  }

  function markTransferred(id, date) {
    const ben = list.value.find((b) => b.id === id)
    if (ben) {
      ben.lastTransfer = date
      ben.isNew = false
    }
  }

  return { list, loading, error, saving, saveError, favorites, fetchAll, add, update, remove, toggleFavorite, markTransferred }
})
