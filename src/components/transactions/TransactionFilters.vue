<template>
  <section class="card p-4 sm:p-5" aria-label="Transaction filters">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          v-model="filters.search"
          type="search"
          placeholder="Search name, reference or category…"
          class="input pl-9"
          aria-label="Search transactions"
        />
      </div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
        <select v-model="filters.category" class="input" aria-label="Filter by category">
          <option v-for="c in categories" :key="c" :value="c">{{ c === 'All' ? 'All categories' : c }}</option>
        </select>
        <select v-model="filters.status" class="input" aria-label="Filter by status">
          <option v-for="s in statuses" :key="s" :value="s">{{ s === 'All' ? 'All statuses' : s }}</option>
        </select>
        <select v-model="filters.direction" class="input" aria-label="Filter by transaction type">
          <option v-for="d in directions" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
        <select v-model="sortModel" class="input" aria-label="Sort transactions">
          <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-brand-600 hover:text-brand-700 lg:self-center"
        :aria-expanded="advancedOpen"
        @click="advancedOpen = !advancedOpen"
      >
        <SlidersHorizontal class="h-3.5 w-3.5" aria-hidden="true" />
        {{ advancedOpen ? 'Hide' : 'More' }} filters
        <span v-if="activeFilterCount > 0" class="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
          {{ activeFilterCount }}
        </span>
      </button>
    </div>

    <div v-if="advancedOpen" class="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-4">
      <div>
        <label for="flt-from" class="mb-1 block text-xs font-medium text-slate-500">From date</label>
        <input id="flt-from" v-model="filters.from" type="date" class="input" />
      </div>
      <div>
        <label for="flt-to" class="mb-1 block text-xs font-medium text-slate-500">To date</label>
        <input id="flt-to" v-model="filters.to" type="date" class="input" />
      </div>
      <div>
        <label for="flt-min" class="mb-1 block text-xs font-medium text-slate-500">Min amount (₦)</label>
        <input id="flt-min" v-model="filters.minAmount" type="number" min="0" placeholder="0" class="input" />
      </div>
      <div>
        <label for="flt-max" class="mb-1 block text-xs font-medium text-slate-500">Max amount (₦)</label>
        <input id="flt-max" v-model="filters.maxAmount" type="number" min="0" placeholder="No limit" class="input" />
      </div>
    </div>

    <div v-if="activeFilterCount > 0" class="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
      <p class="text-xs text-slate-500">{{ resultCount }} result{{ resultCount === 1 ? '' : 's' }}</p>
      <button type="button" class="text-xs font-medium text-brand-600 hover:text-brand-700" @click="resetFilters">
        Clear all filters
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search, SlidersHorizontal } from 'lucide-vue-next'
import { DIRECTIONS, SORTS, STATUSES, useTransactionStore } from '@/stores/transactions'

defineProps({ resultCount: { type: Number, default: 0 } })

const store = useTransactionStore()
const filters = store.filters
const categories = computed(() => store.categories)
const activeFilterCount = computed(() => store.activeFilterCount)
const statuses = STATUSES
const directions = DIRECTIONS
const sorts = SORTS

const sortModel = computed({
  get: () => store.sort,
  set: (v) => { store.sort = v },
})

const advancedOpen = ref(false)

function resetFilters() {
  store.resetFilters()
}
</script>
