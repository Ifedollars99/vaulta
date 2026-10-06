<template>
  <div
    class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-md rounded-xl bg-white p-5 shadow-lg sm:p-6">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="section-title">{{ title }}</h2>
        <button type="button" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Close dialog" @click="$emit('close')">
          <X class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

defineProps({ title: { type: String, default: '' } })
const emit = defineEmits(['close'])

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
