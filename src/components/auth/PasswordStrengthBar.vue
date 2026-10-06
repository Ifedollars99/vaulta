<template>
  <div>
    <div class="flex h-1.5 gap-1" role="img" :aria-label="`Password strength: ${strength.label}`">
      <div
        v-for="n in 4"
        :key="n"
        class="h-full flex-1 rounded-full"
        :class="n <= filled ? barColor : 'bg-slate-200'"
      />
    </div>
    <p class="mt-1 text-xs" :class="textColor">{{ strength.label }}{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { passwordStrength } from '@/utils/validators'

const props = defineProps({
  password: { type: String, default: '' },
  showHint: { type: Boolean, default: true },
})

const strength = computed(() => passwordStrength(props.password))

const filled = computed(() => {
  if (!props.password) return 0
  if (strength.value.score <= 1) return 1
  if (strength.value.score === 2) return 2
  if (strength.value.score === 3) return 3
  return 4
})

const barColor = computed(() => {
  if (filled.value <= 1) return 'bg-red-500'
  if (filled.value === 2) return 'bg-amber-500'
  if (filled.value === 3) return 'bg-brand-600'
  return 'bg-green-600'
})

const textColor = computed(() => {
  if (filled.value <= 1) return 'text-red-600'
  if (filled.value === 2) return 'text-amber-600'
  if (filled.value === 3) return 'text-brand-700'
  return 'text-green-700'
})

const hint = computed(() => {
  if (!props.showHint || !props.password || filled.value === 4) return ''
  return ' — use 12+ characters with mixed case, a number and a symbol.'
})
</script>
