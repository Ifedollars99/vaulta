<template>
  <AppLayout>
    <h1 class="page-title">Profile</h1>
    <p class="mt-1 text-sm text-slate-500">Your identity and verification status.</p>

    <div class="card mt-6 p-5 sm:p-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-900" aria-hidden="true">
          {{ initials }}
        </div>
        <div class="flex-1">
          <p class="text-lg font-semibold text-slate-900">{{ auth.user?.name }}</p>
          <p class="text-sm text-slate-500">{{ auth.user?.email }}</p>
        </div>
        <AppBadge :status="kyc === 'Verified' ? 'Active' : 'Pending'" />
      </div>
      <span class="sr-only">KYC status: {{ kyc }}</span>

      <dl class="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div class="rounded-xl bg-slate-50 p-4">
          <dt class="label">Phone</dt>
          <dd class="mt-1 font-medium text-slate-900">{{ auth.user?.phone ?? '—' }}</dd>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <dt class="label">City</dt>
          <dd class="mt-1 font-medium text-slate-900">{{ auth.user?.city ?? '—' }}</dd>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <dt class="label">Account number</dt>
          <dd class="tnum mt-1 font-mono font-medium text-slate-900">{{ account?.accountNumber ?? '—' }}</dd>
        </div>
        <div class="rounded-xl bg-slate-50 p-4">
          <dt class="label">KYC status</dt>
          <dd class="mt-1 font-medium text-slate-900">{{ kyc }}</dd>
        </div>
      </dl>

      <div class="mt-6 flex flex-wrap gap-2">
        <RouterLink to="/settings" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Edit in settings
        </RouterLink>
        <RouterLink to="/security" class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Security Center
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import { useAuthStore } from '@/stores/auth'
import { useAccountStore } from '@/stores/account'

const auth = useAuthStore()
const accountStore = useAccountStore()

const initials = computed(() => {
  const name = auth.user?.name ?? 'VA'
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
})
const kyc = computed(() => auth.user?.kycStatus ?? 'Pending review')
const account = computed(() => accountStore.account)

onMounted(() => {
  if (!accountStore.account) accountStore.fetchAccount()
})
</script>
