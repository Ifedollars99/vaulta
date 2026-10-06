<template>
  <div class="card flex flex-col items-center px-6 py-12 text-center">
    <component :is="icon" class="mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
    <p class="text-sm font-medium text-slate-900">{{ title }}</p>
    <p class="mt-1 max-w-sm text-sm text-slate-500">{{ message }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import { Inbox } from 'lucide-vue-next'

defineProps({
  title: { type: String, default: 'Nothing here yet' },
  message: { type: String, default: '' },
  icon: { type: Object, default: () => Inbox },
})
</script>
