<template>
  <AppLayout>
    <h1 class="page-title">Cards</h1>
    <p class="mt-1 text-sm text-slate-500">Freeze, limit and replace your cards. Details stay hidden until you ask.</p>

    <div v-if="error" class="card mt-6 p-8 text-center" role="alert">
      <p class="text-sm font-medium text-slate-900">Couldn't load your cards</p>
      <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="store.fetchAll">
        Try again
      </button>
    </div>

    <div v-else-if="loading" class="mt-6 grid gap-4 lg:grid-cols-2" role="status" aria-label="Loading cards">
      <div v-for="n in 2" :key="n" class="card h-80 animate-pulse bg-slate-100" />
    </div>

    <div v-else class="mt-6 grid gap-4 lg:grid-cols-2">
      <CardPanel
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :revealed="store.isRevealed(card.id)"
        :action-loading="Boolean(store.actionLoading[card.id])"
        @reveal="store.reveal"
        @conceal="store.conceal"
        @freeze="freeze"
        @unfreeze="unfreeze"
        @limit="openLimit"
        @replace="askReplace"
      />
    </div>

    <LimitModal
      v-if="limitCard"
      :card="limitCard"
      :saving="saving"
      @close="limitCard = null"
      @save="saveLimit"
    />

    <AppModal v-if="replaceCard" title="Replace card" @close="replaceCard = null">
      <p class="text-sm text-slate-600">
        Issue a new {{ replaceCard.kind.toLowerCase() }} card? The current PAN is cancelled immediately
        and a new number is generated (simulated).
      </p>
      <div class="mt-4 flex gap-2">
        <AppButton variant="secondary" @click="replaceCard = null">Keep card</AppButton>
        <AppButton :loading="replacing" @click="confirmReplace">
          {{ replacing ? 'Issuing…' : 'Replace card' }}
        </AppButton>
      </div>
    </AppModal>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import CardPanel from '@/components/cards/CardPanel.vue'
import LimitModal from '@/components/cards/LimitModal.vue'
import { useCardStore } from '@/stores/cards'

const store = useCardStore()

const limitCard = ref(null)
const replaceCard = ref(null)
const saving = ref(false)
const replacing = ref(false)

const loading = computed(() => store.loading && store.cards.length === 0)
const error = computed(() => store.error)
const cards = computed(() => store.cards)

async function freeze(id) {
  await store.setStatus(id, 'Frozen')
}

async function unfreeze(id) {
  await store.setStatus(id, 'Active')
}

function openLimit(card) {
  limitCard.value = card
}

async function saveLimit(value) {
  saving.value = true
  try {
    await store.updateLimit(limitCard.value.id, value)
    limitCard.value = null
  } catch {
    // Service validates; page-level fallback.
  } finally {
    saving.value = false
  }
}

function askReplace(card) {
  replaceCard.value = card
}

async function confirmReplace() {
  replacing.value = true
  try {
    await store.replace(replaceCard.value.id)
    replaceCard.value = null
  } finally {
    replacing.value = false
  }
}

onMounted(() => store.fetchAll())
</script>
