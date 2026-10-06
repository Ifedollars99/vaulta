<template>
  <div v-if="!dismissed" class="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center" role="alert">
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
      <ShieldAlert class="h-5 w-5 text-amber-700" aria-hidden="true" />
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-slate-900">New device signed into your account</p>
      <p class="mt-0.5 text-sm text-slate-600">Chrome on Windows · Lagos, Nigeria · 2 hours ago. Was this you?</p>
    </div>
    <div class="flex shrink-0 gap-2">
      <RouterLink to="/security" class="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700">
        Review
      </RouterLink>
      <button type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50" @click="dismissed = true">
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShieldAlert } from 'lucide-vue-next'

const dismissed = ref(false)
</script>
