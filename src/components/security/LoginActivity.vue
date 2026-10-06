<template>
  <AppCard title="Login activity">
    <ul class="divide-y divide-slate-100">
      <li v-for="entry in logins" :key="entry.id" class="flex items-center gap-3 py-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" :class="toneBg(entry.tone)">
          <CircleCheck v-if="entry.tone === 'ok'" class="h-4 w-4 text-green-600" aria-hidden="true" />
          <TriangleAlert v-else-if="entry.tone === 'warning'" class="h-4 w-4 text-amber-600" aria-hidden="true" />
          <CircleX v-else class="h-4 w-4 text-red-600" aria-hidden="true" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-slate-900">{{ entry.event }}</p>
          <p class="truncate text-xs text-slate-500">{{ entry.detail }}</p>
        </div>
        <span class="shrink-0 text-xs text-slate-400">{{ timeAgo(entry.date) }}</span>
      </li>
    </ul>
  </AppCard>
</template>

<script setup>
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'
import { timeAgo } from '@/utils/formatDate'

defineProps({ logins: { type: Array, default: () => [] } })

function toneBg(tone) {
  return {
    ok: 'bg-green-50',
    warning: 'bg-amber-50',
    bad: 'bg-red-50',
  }[tone] ?? 'bg-slate-100'
}
</script>
