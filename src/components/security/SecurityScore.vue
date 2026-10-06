<template>
  <AppCard title="Security score">
    <div class="flex items-center gap-5">
      <div class="relative h-28 w-28 shrink-0" role="img" :aria-label="`Security score ${score} out of 100, ${band}`">
        <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" stroke-width="10" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            :stroke="ringColor" stroke-width="10" stroke-linecap="round"
            :stroke-dasharray="`${(score / 100) * 264} 264`"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="tnum text-2xl font-semibold text-slate-900">{{ score }}</span>
          <span class="text-[11px] text-slate-400">/100</span>
        </div>
      </div>
      <div>
        <p class="text-sm font-semibold" :class="bandColor">{{ band }}</p>
        <p class="mt-1 text-sm text-slate-500">Review the new device below to finish hardening your account.</p>
      </div>
    </div>
    <ul class="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
      <li v-for="f in factors" :key="f.label" class="flex items-center justify-between gap-3">
        <span class="flex items-center gap-2" :class="f.active ? 'text-slate-700' : 'text-slate-400'">
          <CircleCheck v-if="f.active" class="h-4 w-4 text-green-600" aria-hidden="true" />
          <CircleDashed v-else class="h-4 w-4" aria-hidden="true" />
          {{ f.label }}
        </span>
        <span class="tnum text-xs font-semibold" :class="f.active ? 'text-green-700' : 'text-slate-300'">
          {{ f.active ? `+${f.points}` : '—' }}
        </span>
      </li>
    </ul>
  </AppCard>
</template>

<script setup>
import { computed } from 'vue'
import { CircleCheck, CircleDashed } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'

const props = defineProps({
  score: { type: Number, default: 0 },
  band: { type: String, default: '' },
  factors: { type: Array, default: () => [] },
})

const ringColor = computed(() => {
  if (props.score >= 80) return '#16A34A'
  if (props.score >= 60) return '#D97706'
  return '#DC2626'
})
const bandColor = computed(() => {
  if (props.score >= 80) return 'text-green-700'
  if (props.score >= 60) return 'text-amber-600'
  return 'text-red-600'
})
</script>
