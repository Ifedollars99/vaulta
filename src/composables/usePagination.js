import { computed, ref, watch } from 'vue'

/**
 * Generic client-side pagination. Reset the page whenever the
 * underlying list identity changes (e.g. filters) via resetOn.
 */
export function usePagination(list, { perPage = 10, resetOn = null } = {}) {
  const page = ref(1)

  const totalItems = computed(() => list.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / perPage)))

  const paged = computed(() => {
    const start = (page.value - 1) * perPage
    return list.value.slice(start, start + perPage)
  })

  function goto(p) {
    page.value = Math.min(Math.max(1, p), totalPages.value)
  }
  function next() {
    goto(page.value + 1)
  }
  function prev() {
    goto(page.value - 1)
  }
  function reset() {
    page.value = 1
  }

  if (resetOn) watch(resetOn, reset)

  watch(totalPages, () => {
    if (page.value > totalPages.value) page.value = totalPages.value
  })

  return { page, perPage, totalItems, totalPages, paged, goto, next, prev, reset }
}
