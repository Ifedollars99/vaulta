<template>
  <section class="card p-5 sm:p-6" :aria-label="`${card.kind} card management`">
    <BankCardVisual :card="card" :revealed="revealed" />

    <div class="mt-4 flex items-center justify-between">
      <div>
        <h2 class="text-sm font-semibold text-slate-900">{{ card.kind }} card · {{ card.label }}</h2>
        <p class="text-xs text-slate-500">Monthly limit {{ formatNaira(card.monthlyLimit) }}</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-600 hover:text-brand-700"
        @click="toggleReveal"
      >
        <EyeOff v-if="revealed" class="h-3.5 w-3.5" aria-hidden="true" />
        <Eye v-else class="h-3.5 w-3.5" aria-hidden="true" />
        {{ revealed ? 'Hide (auto-hides in 30s)' : 'Show details' }}
      </button>
    </div>

    <div class="mt-4">
      <div class="flex justify-between text-xs">
        <span class="text-slate-500">Spent this month</span>
        <span class="tnum font-semibold" :class="overLimit ? 'text-red-600' : 'text-slate-800'">
          {{ formatNaira(card.spentThisMonth) }} of {{ formatNaira(card.monthlyLimit) }}
        </span>
      </div>
      <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" role="img" :aria-label="`${percent}% of monthly limit used`">
        <div class="h-full rounded-full" :class="overLimit ? 'bg-red-500' : 'bg-brand-600'" :style="{ width: Math.min(100, percent) + '%' }" />
      </div>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-2">
      <button
        type="button"
        :disabled="busy"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium disabled:opacity-50"
        :class="frozen ? 'border-brand-600 text-brand-700 hover:bg-brand-50' : 'border-slate-200 text-slate-600 hover:border-slate-400'"
        @click="toggleFreeze"
      >
        <Snowflake v-if="!frozen" class="h-3.5 w-3.5" aria-hidden="true" />
        <Flame v-else class="h-3.5 w-3.5" aria-hidden="true" />
        {{ actionLoading ? '…' : (frozen ? 'Unfreeze' : 'Freeze') }}
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-400"
        @click="$emit('limit', card)"
      >
        <Gauge class="h-3.5 w-3.5" aria-hidden="true" />
        Limit
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
        @click="$emit('replace', card)"
      >
        <RefreshCw class="h-3.5 w-3.5" aria-hidden="true" />
        Replace
      </button>
    </div>
    <p v-if="frozen" class="mt-3 rounded-lg bg-slate-100 p-2.5 text-xs text-slate-600" role="status">
      Frozen — online and POS payments are blocked until you unfreeze. Transfers are unaffected.
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Eye, EyeOff, Flame, Gauge, RefreshCw, Snowflake } from 'lucide-vue-next'
import BankCardVisual from './BankCardVisual.vue'
import { formatNaira } from '@/utils/formatCurrency'

const props = defineProps({
  card: { type: Object, required: true },
  revealed: { type: Boolean, default: false },
  actionLoading: { type: Boolean, default: false },
})
const emit = defineEmits(['reveal', 'conceal', 'freeze', 'unfreeze', 'limit', 'replace'])

const frozen = computed(() => props.card.status === 'Frozen')
const busy = computed(() => props.actionLoading)
const percent = computed(() => Math.round((props.card.spentThisMonth / props.card.monthlyLimit) * 100))
const overLimit = computed(() => props.card.spentThisMonth >= props.card.monthlyLimit)

function toggleReveal() {
  emit(props.revealed ? 'conceal' : 'reveal', props.card.id)
}

function toggleFreeze() {
  emit(props.frozen ? 'unfreeze' : 'freeze', props.card.id)
}
</script>
