import { simulate } from './api'
import { notificationsSeed } from '@/data/notifications'

export async function fetchNotificationsRequest() {
  const sorted = [...notificationsSeed].sort((a, b) => new Date(b.date) - new Date(a.date))
  return simulate(sorted, { delay: 400 })
}
