<template>
  <AppLayout>
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="page-title">Notifications</h1>
        <p class="mt-1 text-sm text-slate-500">{{ unread }} unread.</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium" role="group" aria-label="Filter notifications">
          <button
            v-for="opt in filterOptions"
            :key="opt.value"
            type="button"
            class="rounded-md px-3 py-1.5"
            :class="filter === opt.value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'"
            :aria-pressed="filter === opt.value"
            @click="store.filter = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <button
          type="button"
          :disabled="unread === 0"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-600 hover:text-brand-700 disabled:opacity-40"
          @click="store.markAllRead"
        >
          Mark all read
        </button>
      </div>
    </div>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load notifications</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.ensureLoaded">
        Try again
      </button>
    </div>

    <div v-else-if="loading" class="mt-6 space-y-2" role="status" aria-label="Loading notifications">
      <div v-for="n in 5" :key="n" class="card h-20 animate-pulse bg-slate-100" />
    </div>

    <template v-else>
      <ul v-if="visible.length" class="mt-6 space-y-2">
        <li
          v-for="n in visible"
          :key="n.id"
          class="card flex cursor-pointer gap-3 p-4 transition-colors hover:border-brand-600"
          :class="n.read ? '' : 'border-l-4 border-l-brand-600'"
          @click="store.markRead(n.id)"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" :class="typeBg(n.type)">
            <ShieldAlert v-if="n.type === 'security'" class="h-5 w-5 text-amber-700" aria-hidden="true" />
            <ArrowLeftRight v-else-if="n.type === 'transaction'" class="h-5 w-5 text-brand-700" aria-hidden="true" />
            <Info v-else class="h-5 w-5 text-slate-500" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-medium" :class="n.read ? 'text-slate-700' : 'text-slate-900'">{{ n.title }}</p>
              <span class="shrink-0 text-xs text-slate-400">{{ timeAgo(n.date) }}</span>
            </div>
            <p class="mt-0.5 text-sm text-slate-500">{{ n.body }}</p>
          </div>
          <span v-if="!n.read" class="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />
        </li>
      </ul>
      <AppEmptyState v-else title="All caught up" message="No notifications match this filter." class="mt-6" />
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ArrowLeftRight, Info, ShieldAlert } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import { useNotificationStore } from '@/stores/notifications'
import { timeAgo } from '@/utils/formatDate'

const store = useNotificationStore()

const loading = computed(() => store.loading && store.items.length === 0)
const error = computed(() => store.error)
const visible = computed(() => store.visible)
const unread = computed(() => store.unreadCount)
const filter = computed(() => store.filter)

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'security', label: 'Security' },
  { value: 'transaction', label: 'Money' },
]

function typeBg(type) {
  return {
    security: 'bg-amber-50',
    transaction: 'bg-brand-50',
    info: 'bg-slate-100',
  }[type] ?? 'bg-slate-100'
}

onMounted(() => store.ensureLoaded())
</script>
