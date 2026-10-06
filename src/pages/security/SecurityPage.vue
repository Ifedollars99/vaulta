<template>
  <AppLayout>
    <h1 class="page-title">Security Center</h1>
    <p class="mt-1 text-sm text-slate-500">Score, devices, activity and protections — all simulated.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load security data</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <div v-else-if="loading" class="mt-6 grid gap-4 lg:grid-cols-2" role="status" aria-label="Loading security">
      <div v-for="n in 2" :key="n" class="card h-64 animate-pulse bg-slate-100" />
    </div>

    <div v-else class="mt-6 grid items-start gap-4 lg:grid-cols-2">
      <div class="space-y-4">
        <SecurityScore :score="store.score" :band="store.band" :factors="store.factors" />
        <LoginActivity :logins="store.logins" />
      </div>
      <div class="space-y-4">
        <DeviceList :devices="store.devices" @trust="store.trust" @revoke="revoke" />
        <AppCard title="Protections">
          <ul class="divide-y divide-slate-100">
            <li v-for="opt in protectionOptions" :key="opt.key" class="flex items-center justify-between gap-3 py-3">
              <div>
                <p class="text-sm font-medium text-slate-900">{{ opt.title }}</p>
                <p class="text-xs text-slate-500">{{ opt.body }}</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="store.settings[opt.key]"
                :aria-label="opt.title"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                :class="store.settings[opt.key] ? 'bg-brand-600' : 'bg-slate-200'"
                @click="store.toggle(opt.key)"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                  :class="store.settings[opt.key] ? 'left-[22px]' : 'left-0.5'"
                />
              </button>
            </li>
          </ul>
        </AppCard>
      </div>
    </div>

    <AppModal v-if="revoked" title="Device revoked" @close="revoked = false">
      <p class="text-sm text-slate-600">
        Access for that device was removed and the event logged below. If money ever moves without you,
        freeze your cards immediately.
      </p>
      <AppButton block class="mt-4" @click="revoked = false">Got it</AppButton>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import SecurityScore from '@/components/security/SecurityScore.vue'
import DeviceList from '@/components/security/DeviceList.vue'
import LoginActivity from '@/components/security/LoginActivity.vue'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()
const revoked = ref(false)

const loading = computed(() => store.loading && store.devices.length === 0)
const error = computed(() => store.error)

const protectionOptions = [
  { key: 'twoFactor', title: 'Two-factor authentication', body: 'Approve new-device sign-ins by SMS code.' },
  { key: 'loginAlerts', title: 'Login notifications', body: 'Instant alert on every sign-in.' },
  { key: 'transactionApproval', title: 'Transfer PIN approval', body: 'Require your 4-digit PIN per transfer.' },
  { key: 'biometric', title: 'Biometric login', body: 'Face or fingerprint on supported devices.' },
]

function revoke(id) {
  store.revoke(id)
  revoked.value = true
}

onMounted(() => store.fetchAll())
</script>
