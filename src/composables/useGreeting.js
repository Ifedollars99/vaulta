import { computed } from 'vue'

/**
 * Time-aware greeting for the dashboard header.
 */
export function useGreeting(name = '') {
  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })

  const firstName = computed(() => String(name ?? '').split(' ')[0] || 'there')

  const today = computed(() =>
    new Intl.DateTimeFormat('en-NG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date())
  )

  return { greeting, firstName, today }
}
