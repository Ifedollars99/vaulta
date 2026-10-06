import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchNotificationsRequest } from '@/services/notification.service'

/**
 * Notification inbox. Local read-state only — no backend in the demo.
 */
export const useNotificationStore = defineStore('notifications', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')
  const filter = ref('all')

  const unreadCount = computed(() => items.value.filter((n) => !n.read).length)

  const visible = computed(() => {
    if (filter.value === 'unread') return items.value.filter((n) => !n.read)
    if (filter.value !== 'all') return items.value.filter((n) => n.type === filter.value)
    return items.value
  })

  async function ensureLoaded() {
    if (items.value.length > 0) return items.value
    loading.value = true
    error.value = ''
    try {
      items.value = await fetchNotificationsRequest()
      return items.value
    } catch (err) {
      error.value = err.message || 'Something went wrong. Try again.'
      return []
    } finally {
      loading.value = false
    }
  }

  function markRead(id) {
    const item = items.value.find((n) => n.id === id)
    if (item) item.read = true
  }

  function markAllRead() {
    items.value.forEach((n) => {
      n.read = true
    })
  }

  return { items, loading, error, filter, unreadCount, visible, ensureLoaded, markRead, markAllRead }
})
