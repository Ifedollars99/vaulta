<template>
  <AdminLayout>
    <h1 class="page-title">Audit logs</h1>
    <p class="mt-1 text-sm text-slate-500">Who did what, when — newest first.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load audit logs</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="relative mt-6">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input v-model="query" type="search" placeholder="Search event, actor or action…" class="input max-w-md pl-9" aria-label="Search audit logs" />
      </div>

      <div v-if="loading" class="card mt-4 animate-pulse space-y-3 p-5" role="status" aria-label="Loading audit logs">
        <div v-for="n in 8" :key="n" class="h-12 rounded bg-slate-100" />
      </div>

      <template v-else>
        <AppEmptyState v-if="results.length === 0" title="No log entries match" message="Try a different search." class="mt-4" />

        <div v-else class="card mt-4 hidden overflow-x-auto lg:block">
          <table class="w-full min-w-[760px] text-left text-sm">
            <caption class="sr-only">Audit log</caption>
            <thead>
              <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" class="px-4 py-3 font-medium">Event</th>
                <th scope="col" class="px-4 py-3 font-medium">Actor</th>
                <th scope="col" class="px-4 py-3 font-medium">Action</th>
                <th scope="col" class="px-4 py-3 font-medium">Timestamp</th>
                <th scope="col" class="px-4 py-3 font-medium">Location</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="log in paged" :key="log.id" class="hover:bg-slate-50">
                <td class="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{{ log.event }}</td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ log.actor }}</td>
                <td class="max-w-md px-4 py-3 text-slate-600">{{ log.action }}</td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ formatDateTime(log.timestamp) }}</td>
                <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ log.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul class="mt-4 space-y-2 lg:hidden">
          <li v-for="log in paged" :key="log.id" class="card p-4">
            <p class="text-sm font-medium text-slate-900">{{ log.event }}</p>
            <p class="mt-0.5 text-sm text-slate-600">{{ log.action }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ log.actor }} · {{ formatDateTime(log.timestamp) }} · {{ log.location }}</p>
          </li>
        </ul>

        <div v-if="results.length > pagination.perPage" class="mt-4">
          <AppPagination
            :page="pagination.page"
            :total-pages="pagination.totalPages"
            :total-items="pagination.totalItems"
            :per-page="pagination.perPage"
            @goto="pagination.goto"
            @prev="pagination.prev"
            @next="pagination.next"
          />
        </div>
      </template>
    </template>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { useAdminStore } from '@/stores/admin'
import { usePagination } from '@/composables/usePagination'
import { formatDateTime } from '@/utils/formatDate'

const store = useAdminStore()
const query = ref('')

const loading = computed(() => store.loading && store.auditLogs.length === 0)
const error = computed(() => store.error)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return store.auditLogs
  return store.auditLogs.filter((l) =>
    `${l.event} ${l.actor} ${l.action}`.toLowerCase().includes(q)
  )
})

const pagination = usePagination(results, { perPage: 10, resetOn: () => [query.value] })
const paged = computed(() => pagination.paged)

onMounted(() => store.ensureLoaded())
</script>
