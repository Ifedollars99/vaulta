<template>
  <AdminLayout>
    <RouterLink to="/admin/customers" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      Back to customers
    </RouterLink>

    <div v-if="loading" class="card mt-4 animate-pulse space-y-3 p-6" role="status" aria-label="Loading customer">
      <div class="h-8 w-48 rounded bg-slate-100" />
      <div class="h-40 rounded bg-slate-100" />
    </div>

    <div v-else-if="!customer" class="card mt-4 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Customer not found.</p>
      <RouterLink to="/admin/customers" class="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        View all customers
      </RouterLink>
    </div>

    <template v-else>
      <div class="card mt-4 p-5 sm:p-6">
        <div class="flex flex-wrap items-center gap-4">
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-base font-semibold text-brand-800" aria-hidden="true">
            {{ initials }}
          </span>
          <div class="min-w-0 flex-1">
            <h1 class="truncate text-lg font-semibold text-slate-900">{{ customer.name }}</h1>
            <p class="text-sm text-slate-500">{{ customer.email }} · {{ customer.phone }}</p>
          </div>
          <AppBadge :status="customer.status" />
        </div>

        <dl class="mt-5 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="label">Balance</dt>
            <dd class="tnum mt-1 font-semibold text-slate-900">{{ formatNaira(customer.balance) }}</dd>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="label">Settled volume</dt>
            <dd class="tnum mt-1 font-semibold text-slate-900">{{ formatNaira(store.customerVolume(customer.name), { decimals: 0 }) }}</dd>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="label">KYC</dt>
            <dd class="mt-1 font-semibold text-slate-900">{{ customer.kycStatus }}</dd>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="label">City</dt>
            <dd class="mt-1 font-semibold text-slate-900">{{ customer.city }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex flex-wrap gap-2">
          <AppButton v-if="customer.status !== 'Active'" variant="secondary" :loading="acting" @click="setStatus('Active')">
            Reactivate
          </AppButton>
          <AppButton v-if="customer.status !== 'Under review'" variant="secondary" :loading="acting" @click="setStatus('Under review')">
            Flag for review
          </AppButton>
          <AppButton v-if="customer.status !== 'Suspended'" variant="danger" :loading="acting" @click="setStatus('Suspended')">
            Suspend
          </AppButton>
        </div>
      </div>

      <div class="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <AppCard title="Recent transactions">
          <ul v-if="recent.length" class="divide-y divide-slate-100">
            <li v-for="t in recent" :key="t.id" class="flex items-center justify-between gap-3 py-2.5">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-slate-900">{{ t.counterparty }}</p>
                <p class="font-mono text-xs text-slate-400">{{ t.reference }} · {{ formatDate(t.date) }}</p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <span class="tnum text-sm font-semibold" :class="t.direction === 'credit' ? 'text-green-700' : 'text-slate-900'">
                  {{ t.direction === 'credit' ? '+' : '−' }}{{ formatNaira(t.amount) }}
                </span>
                <AppBadge :status="t.status" />
              </div>
            </li>
          </ul>
          <p v-else class="py-4 text-center text-sm text-slate-400">No transactions on record.</p>
        </AppCard>

        <AppCard title="Fraud alerts">
          <template #action><span class="text-xs text-slate-400">{{ alerts.length }} flagged</span></template>
          <ul v-if="alerts.length" class="space-y-2">
            <li v-for="t in alerts" :key="t.id" class="flex items-center justify-between gap-3 rounded-lg bg-red-50/60 p-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-slate-900">{{ formatNaira(t.amount) }} → {{ t.counterparty }}</p>
                <p class="text-xs text-slate-500">{{ formatDate(t.date) }} · {{ t.status }}</p>
              </div>
              <AppBadge :status="t.riskScore > 70 ? 'High risk' : 'Medium risk'" />
            </li>
          </ul>
          <p v-else class="py-4 text-center text-sm text-slate-400">No high-risk activity. Clean record.</p>
        </AppCard>
      </div>
    </template>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useAdminStore } from '@/stores/admin'
import { formatNaira } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

const route = useRoute()
const store = useAdminStore()
const acting = ref(false)
const viewed = ref(false)

const loading = computed(() => store.loading && store.customers.length === 0)
const customer = computed(() => store.customers.find((c) => c.id === route.params.id))
const initials = computed(() =>
  (customer.value?.name ?? 'CU').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
)
const recent = computed(() => (customer.value ? store.customerTransactions(customer.value.name) : []))
const alerts = computed(() => (customer.value ? store.customerAlerts(customer.value.name) : []))

async function setStatus(status) {
  acting.value = true
  try {
    await store.setCustomerStatus(customer.value.id, status)
  } finally {
    acting.value = false
  }
}

onMounted(async () => {
  await store.ensureLoaded()
  if (customer.value && !viewed.value) {
    viewed.value = true
    store.logCustomerView(customer.value.name)
  }
})
</script>
