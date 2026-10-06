<template>
  <PublicLayout>
    <div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
      <h1 class="page-title">Page not found</h1>
      <p class="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        Back home
      </RouterLink>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '@/layouts/PublicLayout.vue'
</script>
