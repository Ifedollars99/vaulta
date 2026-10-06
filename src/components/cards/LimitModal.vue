<template>
  <AppModal title="Change spending limit" @close="$emit('close')">
    <p class="text-sm text-slate-600">
      Monthly cap for your <span class="font-medium text-slate-900">{{ card.kind.toLowerCase() }} card</span>.
      Card payments above it are declined.
    </p>
    <div class="mt-3 grid grid-cols-3 gap-2">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        class="tnum rounded-lg border px-2 py-2 text-xs font-medium"
        :class="Number(draftInput) === preset ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-600'"
        @click="draftInput = String(preset)"
      >
        {{ shortNaira(preset) }}
      </button>
    </div>
    <label for="card-limit" class="mb-1 mt-4 block text-sm font-medium text-slate-700">Custom limit (₦)</label>
    <input id="card-limit" v-model="draftInput" type="number" min="50000" step="10000" class="tnum input" />
    <p v-if="error" class="mt-1 text-xs text-red-600" role="alert">{{ error }}</p>
    <div class="mt-4 flex gap-2">
      <AppButton variant="secondary" @click="$emit('close')">Cancel</AppButton>
      <AppButton block :loading="saving" @click="save">
        {{ saving ? 'Saving…' : 'Set limit' }}
      </AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  card: { type: Object, required: true },
  saving: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'save'])

const presets = [250000, 500000, 1000000]
const draftInput = ref(String(props.card.monthlyLimit))
const error = ref('')

function shortNaira(v) {
  return v >= 1000000 ? `₦${v / 1000000}M` : `₦${v / 1000}k`
}

function save() {
  error.value = ''
  const value = Number(draftInput.value)
  if (!Number.isFinite(value) || value < 50000) {
    error.value = 'Spending limit must be at least ₦50,000.'
    return
  }
  emit('save', value)
}
</script>
