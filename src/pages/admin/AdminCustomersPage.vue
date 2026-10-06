<template>
  <AdminLayout>
    <h1 class="page-title">Customers</h1>
    <p class="mt-1 text-sm text-slate-500">{{ store.customers.length }} accounts on the platform.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load customers</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="relative mt-6">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input v-model="query" type="search" placeholder="Search name, email or account…" class="input max-w-md pl-9" aria-label="Search customers" />
      </div>

      <div v-if="loading" class="mt-4 space-y-2" role="status" aria-label="Loading customers">
        <div v-for="n in 5" :key="n" class="card h-20 animate-pulse bg-slate-100" />
      </div>

      <template v-else>
        <AppEmptyState v-if="results.length === 0" title="No customers match" message="Try a different search." class="mt-4" />
        <ul v-else class="mt-4 space-y-2">
          <li v-for="c in results" :key="c.id" class="card p-4">
            <RouterLink :to="`/admin/customers/${c.id}`" class="flex flex-wrap items-center gap-3">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800" aria-hidden="true">
                {{ initials(c.name) }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-slate-900">{{ c.name }}</span>
                <span class="block text-xs text-slate-500">{{ c.city }} · {{ c.accountNumber }} · KYC {{ c.kycStatus }}</span>
              </span>
              <span class="tnum hidden text-sm font-semibold text-slate-900 sm:block">{{ formatNaira(c.balance, { decimals: 0 }) }}</span>
              <AppBadge :status="c.status" />
            </RouterLink>
          </li>
        </ul>
      </template>
    </template>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search } from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import { useAdminStore } from '@/stores/admin'
import { formatNaira } from '@/utils/formatCurrency'

const store = useAdminStore()
const query = ref('')

const loading = computed(() => store.loading && store.customers.length === 0)
const error = computed(() => store.error)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return store.customers
  return store.customers.filter((c) =>
    `${c.name} ${c.email} ${c.accountNumber}`.toLowerCase().includes(q)
  )
})

function initials(name) {
  return String(name).split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

onMounted(() => store.ensureLoaded())
</script>
