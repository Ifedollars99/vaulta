<template>
  <div class="min-h-screen bg-slate-50 lg:pl-64">
    <AppSidebar />
    <div class="flex min-h-screen flex-col">
      <AppTopbar />
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
        <slot />
      </main>
      <MobileNav />
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
</script>
