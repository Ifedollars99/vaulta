<template>
  <div class="animate-pulse space-y-3" role="status" aria-label="Loading">
    <div v-for="n in lines" :key="n" class="h-4 rounded bg-slate-200" />
  </div>
</template>

<script setup>
defineProps({ lines: { type: Number, default: 3 } })
</script>
