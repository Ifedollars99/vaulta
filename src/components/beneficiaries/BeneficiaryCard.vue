<template>
  <li class="card p-4">
    <div class="flex items-start justify-between gap-3">
      <button type="button" class="flex min-w-0 flex-1 items-center gap-3 text-left" @click="$emit('select', beneficiary)">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800" aria-hidden="true">
          {{ initials }}
        </span>
        <span class="min-w-0">
          <span class="flex items-center gap-1.5">
            <span class="truncate text-sm font-medium text-slate-900">{{ beneficiary.name }}</span>
            <Star v-if="beneficiary.favorite" class="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Favorite" />
          </span>
          <span class="tnum block font-mono text-xs text-slate-500">{{ beneficiary.bank }} · {{ beneficiary.accountNumber }}</span>
          <span class="block text-xs text-slate-400">{{ lastTransferText }}</span>
        </span>
      </button>
      <div v-if="showActions" class="flex shrink-0 gap-1">
        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-500" :aria-label="beneficiary.favorite ? 'Remove from favorites' : 'Add to favorites'" :aria-pressed="beneficiary.favorite" @click="$emit('favorite', beneficiary)">
          <Star class="h-4 w-4" :class="beneficiary.favorite ? 'fill-amber-400 text-amber-400' : ''" aria-hidden="true" />
        </button>
        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit beneficiary" @click="$emit('edit', beneficiary)">
          <Pencil class="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete beneficiary" @click="$emit('remove', beneficiary)">
          <Trash2 class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { Pencil, Star, Trash2 } from 'lucide-vue-next'
import { timeAgo } from '@/utils/formatDate'

const props = defineProps({
  beneficiary: { type: Object, required: true },
  showActions: { type: Boolean, default: true },
})
defineEmits(['select', 'edit', 'remove', 'favorite'])

const initials = computed(() =>
  props.beneficiary.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
)
const lastTransferText = computed(() =>
  props.beneficiary.lastTransfer
    ? `Last sent ${timeAgo(props.beneficiary.lastTransfer)}`
    : 'No transfers yet'
)
</script>
