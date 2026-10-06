<template>
  <AppLayout>
    <h1 class="page-title">Transactions</h1>
    <p class="mt-1 text-sm text-slate-500">Search, filter and review every movement on your account.</p>

    <div v-if="listError" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load transactions</p>
      <p class="mt-1 text-sm text-slate-500">{{ listError }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.ensureLoaded">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="mt-6"><TransactionFilters :result-count="filtered.length" /></div>

      <div v-if="listLoading" class="card mt-4 animate-pulse space-y-3 p-5" role="status" aria-label="Loading transactions">
        <div v-for="n in 8" :key="n" class="h-12 rounded bg-slate-100" />
      </div>

      <template v-else>
        <div v-if="filtered.length === 0" class="mt-4">
          <AppEmptyState
            title="No transactions found"
            message="Try widening the date range or clearing some filters."
          >
            <template #action>
              <button type="button" class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.resetFilters">
                Clear filters
              </button>
            </template>
          </AppEmptyState>
        </div>

        <template v-else>
          <div class="mt-4"><TransactionTable :transactions="pagination.paged" /></div>
          <div class="mt-4">
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
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import TransactionFilters from '@/components/transactions/TransactionFilters.vue'
import TransactionTable from '@/components/transactions/TransactionTable.vue'
import { useTransactionStore } from '@/stores/transactions'

const store = useTransactionStore()
const listLoading = computed(() => store.listLoading && store.all.length === 0)
const listError = computed(() => store.listError)
const filtered = computed(() => store.filtered)
const pagination = store.pagination

onMounted(() => {
  store.ensureLoaded()
})
</script>
