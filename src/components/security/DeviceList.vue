<template>
  <AppCard title="Your devices">
    <template #action><span class="text-xs text-slate-400">{{ devices.length }} signed in</span></template>
    <ul class="space-y-3">
      <li v-for="d in devices" :key="d.id" class="rounded-xl border border-slate-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Smartphone v-if="d.kind === 'phone'" class="h-5 w-5 text-slate-600" aria-hidden="true" />
              <Monitor v-else class="h-5 w-5 text-slate-600" aria-hidden="true" />
            </span>
            <div>
              <p class="text-sm font-medium text-slate-900">
                {{ d.name }}
                <span v-if="d.current" class="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">This device</span>
              </p>
              <p class="text-xs text-slate-500">{{ d.location }} · Active {{ timeAgo(d.lastActive) }}</p>
            </div>
          </div>
          <AppBadge :status="d.trusted ? 'Trusted' : 'Unreviewed'" />
        </div>
        <div v-if="!d.trusted" class="mt-3 flex flex-col gap-2 rounded-lg bg-amber-50 p-3 sm:flex-row">
          <p class="flex-1 text-xs leading-relaxed text-amber-800">Don't recognise this sign-in? Revoke it immediately.</p>
          <div class="flex gap-2">
            <button type="button" class="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700" @click="$emit('trust', d.id)">
              That was me
            </button>
            <button type="button" class="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50" @click="$emit('revoke', d.id)">
              That wasn't me
            </button>
          </div>
        </div>
      </li>
    </ul>
  </AppCard>
</template>

<script setup>
import { Monitor, Smartphone } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import { timeAgo } from '@/utils/formatDate'

defineProps({ devices: { type: Array, default: () => [] } })
defineEmits(['trust', 'revoke'])
</script>
