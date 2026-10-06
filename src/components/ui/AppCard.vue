<template>
  <div class="card p-5 sm:p-6">
    <div v-if="$slots.header || title" class="mb-4 flex items-center justify-between">
      <h2 class="section-title">{{ title }}</h2>
      <slot name="action" />
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: '' } })
</script>
