<template>
  <div class="min-h-screen bg-slate-100 lg:pl-64">
    <AdminSidebar />
    <div class="flex min-h-screen flex-col">
      <header class="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <p class="text-sm font-semibold text-slate-900">
            Operations console
            <span class="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">SIMULATED</span>
          </p>
          <RouterLink to="/dashboard" class="text-sm font-medium text-brand-600 hover:text-brand-700">
            View customer app
          </RouterLink>
        </div>
      </header>
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
</script>
