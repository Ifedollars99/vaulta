<template>
  <span :class="classes">
    <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, default: 'neutral' } })

const label = computed(() => props.status)

const classes = computed(() => {
  const base = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium'
  const map = {
    Completed: 'bg-green-50 text-green-700',
    Pending: 'bg-amber-50 text-amber-700',
    Failed: 'bg-red-50 text-red-700',
    Reversed: 'bg-slate-100 text-slate-600',
    Active: 'bg-green-50 text-green-700',
    Trusted: 'bg-green-50 text-green-700',
    Unreviewed: 'bg-amber-50 text-amber-700',
    'Under review': 'bg-amber-50 text-amber-700',
    Suspended: 'bg-red-50 text-red-700',
    Frozen: 'bg-slate-100 text-slate-600',
    'High risk': 'bg-red-50 text-red-700',
    'Medium risk': 'bg-amber-50 text-amber-700',
    'Low risk': 'bg-green-50 text-green-700',
    neutral: 'bg-slate-100 text-slate-600',
  }
  return [base, map[props.status] ?? map.neutral]
})
</script>
