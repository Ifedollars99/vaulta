<template>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
      <div class="lg:hidden">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-950 text-sm font-bold text-white">V</span>
      </div>
      <p class="hidden text-sm text-slate-500 sm:block">Your money. Your control.</p>
      <div class="flex items-center gap-2">
        <RouterLink to="/notifications" class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
          <Bell class="h-5 w-5" aria-hidden="true" />
          <span v-if="unread > 0" class="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {{ unread }}
          </span>
        </RouterLink>
        <div class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-900" aria-hidden="true">
          {{ initials }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Bell } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

const auth = useAuthStore()
const notifications = useNotificationStore()

const unread = computed(() => notifications.unreadCount)
const initials = computed(() => {
  const name = auth.user?.name ?? 'AO'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
})

onMounted(() => {
  notifications.ensureLoaded()
})
</script>
