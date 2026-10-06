<template>
  <nav class="flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
    <p class="text-xs text-slate-500" role="status">
      Showing <span class="font-semibold text-slate-800">{{ from }}–{{ to }}</span>
      of <span class="font-semibold text-slate-800">{{ totalItems }}</span>
    </p>
    <div class="flex items-center gap-1">
      <button type="button" :disabled="page <= 1" class="pager-btn" aria-label="Previous page" @click="$emit('prev')">
        <ChevronLeft class="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        v-for="p in pageNumbers"
        :key="p"
        type="button"
        class="pager-btn min-w-8"
        :class="p === page ? 'border-brand-600 bg-brand-600 text-white' : ''"
        :aria-label="`Page ${p}`"
        :aria-current="p === page ? 'page' : undefined"
        @click="$emit('goto', p)"
      >
        {{ p }}
      </button>
      <button type="button" :disabled="page >= totalPages" class="pager-btn" aria-label="Next page" @click="$emit('next')">
        <ChevronRight class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 },
})
defineEmits(['goto', 'prev', 'next'])

const from = computed(() => (props.totalItems === 0 ? 0 : (props.page - 1) * props.perPage + 1))
const to = computed(() => Math.min(props.page * props.perPage, props.totalItems))

const pageNumbers = computed(() => {
  const total = props.totalPages
  const current = props.page
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  const pages = []
  for (let p = start; p <= end; p += 1) pages.push(p)
  return pages
})
</script>

<style scoped>
.pager-btn {
  @apply inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600;
}
</style>
