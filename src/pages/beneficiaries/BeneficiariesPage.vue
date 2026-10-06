<template>
  <AppLayout>
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="page-title">Beneficiaries</h1>
        <p class="mt-1 text-sm text-slate-500">People and businesses you send money to.</p>
      </div>
      <AppButton @click="openAdd">
        <Plus class="h-4 w-4" aria-hidden="true" />
        Add beneficiary
      </AppButton>
    </div>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load beneficiaries</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <template v-else>
      <div class="relative mt-6">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input v-model="query" type="search" placeholder="Search beneficiaries…" class="input max-w-md pl-9" aria-label="Search beneficiaries" />
      </div>

      <div v-if="loading" class="mt-4 grid gap-3 sm:grid-cols-2" role="status" aria-label="Loading beneficiaries">
        <div v-for="n in 4" :key="n" class="card h-24 animate-pulse bg-slate-100" />
      </div>

      <template v-else>
        <div v-if="results.length === 0" class="mt-4">
          <AppEmptyState
            :title="query ? 'No beneficiaries match' : 'No beneficiaries yet'"
            :message="query ? 'Try a different search.' : 'Add someone you send money to — it makes transfers one tap.'"
          >
            <template v-if="!query" #action>
              <AppButton @click="openAdd">Add beneficiary</AppButton>
            </template>
          </AppEmptyState>
        </div>

        <ul v-else class="mt-4 grid gap-3 sm:grid-cols-2">
          <BeneficiaryCard
            v-for="b in results"
            :key="b.id"
            :beneficiary="b"
            @select="sendTo"
            @edit="openEdit"
            @remove="askRemove"
            @favorite="store.toggleFavorite(b.id)"
          />
        </ul>
      </template>
    </template>

    <BeneficiaryFormModal
      v-if="showForm"
      :editing="editing"
      :saving="store.saving"
      :save-error="store.saveError"
      @close="closeForm"
      @submit="saveForm"
    />

    <AppModal v-if="pendingDelete" title="Delete beneficiary" @close="pendingDelete = null">
      <p class="text-sm text-slate-600">
        Remove <span class="font-semibold text-slate-900">{{ pendingDelete.name }}</span>
        ({{ pendingDelete.bank }} · {{ pendingDelete.accountNumber }})? Past transactions are kept.
      </p>
      <div class="mt-4 flex gap-2">
        <AppButton variant="secondary" @click="pendingDelete = null">Cancel</AppButton>
        <AppButton variant="danger" :loading="deleting" @click="confirmRemove">
          {{ deleting ? 'Deleting…' : 'Delete' }}
        </AppButton>
      </div>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppModal from '@/components/ui/AppModal.vue'
import BeneficiaryCard from '@/components/beneficiaries/BeneficiaryCard.vue'
import BeneficiaryFormModal from '@/components/beneficiaries/BeneficiaryFormModal.vue'
import { useBeneficiaryStore } from '@/stores/beneficiaries'

const store = useBeneficiaryStore()
const router = useRouter()

const query = ref('')
const showForm = ref(false)
const editing = ref(null)
const pendingDelete = ref(null)
const deleting = ref(false)

const loading = computed(() => store.loading && store.list.length === 0)
const error = computed(() => store.error)
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return store.list
  return store.list.filter((b) => `${b.name} ${b.bank} ${b.accountNumber}`.toLowerCase().includes(q))
})

function openAdd() {
  editing.value = null
  showForm.value = true
}

function openEdit(b) {
  editing.value = b
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editing.value = null
}

async function saveForm(payload) {
  try {
    if (editing.value) await store.update(editing.value.id, payload)
    else await store.add(payload)
    closeForm()
  } catch {
    // Message surfaces inside the modal via saveError.
  }
}

function askRemove(b) {
  pendingDelete.value = b
}

async function confirmRemove() {
  deleting.value = true
  try {
    await store.remove(pendingDelete.value.id)
    pendingDelete.value = null
  } finally {
    deleting.value = false
  }
}

function sendTo(b) {
  router.push({ path: '/transfer', query: { to: b.id } })
}

onMounted(() => store.fetchAll())
</script>
