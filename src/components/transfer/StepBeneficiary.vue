<template>
  <div>
    <div class="relative">
      <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input v-model="query" type="search" placeholder="Search name, bank or account…" class="input pl-9" aria-label="Search beneficiaries" />
    </div>

    <p v-if="favorites.length && !query" class="label mt-5">Favorites</p>
    <ul v-if="!query" class="mt-2 space-y-2">
      <li v-for="b in favorites" :key="b.id">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors"
          :class="selectedId === b.id ? 'border-brand-600 bg-brand-50/60' : 'border-slate-200 hover:border-brand-600'"
          :aria-pressed="selectedId === b.id"
          @click="$emit('select', b)"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800" aria-hidden="true">
            {{ initials(b.name) }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-slate-900">{{ b.name }}</span>
            <span class="tnum block font-mono text-xs text-slate-500">{{ b.bank }} · {{ b.accountNumber }}</span>
          </span>
          <span v-if="selectedId === b.id" class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600" aria-hidden="true">
            <Check class="h-3 w-3 text-white" />
          </span>
        </button>
      </li>
    </ul>

    <p class="label mt-5">{{ query ? 'Results' : 'All beneficiaries' }}</p>
    <ul class="mt-2 space-y-2">
      <li v-for="b in results" :key="b.id">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors"
          :class="selectedId === b.id ? 'border-brand-600 bg-brand-50/60' : 'border-slate-200 hover:border-brand-600'"
          :aria-pressed="selectedId === b.id"
          @click="$emit('select', b)"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600" aria-hidden="true">
            {{ initials(b.name) }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-slate-900">{{ b.name }}</span>
            <span class="tnum block font-mono text-xs text-slate-500">{{ b.bank }} · {{ b.accountNumber }}</span>
          </span>
          <span v-if="selectedId === b.id" class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600" aria-hidden="true">
            <Check class="h-3 w-3 text-white" />
          </span>
        </button>
      </li>
    </ul>
    <AppEmptyState v-if="results.length === 0" title="No matches" message="Try a different name, or add a new beneficiary." />

    <button type="button" class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700" @click="$emit('add')">
      <Plus class="h-4 w-4" aria-hidden="true" />
      Add a new beneficiary
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Check, Plus, Search } from 'lucide-vue-next'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'

const props = defineProps({
  beneficiaries: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
})
defineEmits(['select', 'add'])

const query = ref('')
const favorites = computed(() => props.beneficiaries.filter((b) => b.favorite))
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.beneficiaries
  return props.beneficiaries.filter((b) =>
    `${b.name} ${b.bank} ${b.accountNumber}`.toLowerCase().includes(q)
  )
})

function initials(name) {
  return String(name).split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}
</script>
