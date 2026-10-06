<template>
  <AppModal title="Enter transfer PIN" @close="$emit('close')">
    <p class="text-sm text-slate-600">
      Confirm sending <span class="tnum font-semibold text-slate-900">{{ formatNaira(total) }}</span>
      to <span class="font-semibold text-slate-900">{{ recipientName }}</span>.
    </p>
    <form class="mt-4" @submit.prevent="onSubmit">
      <label for="tf-pin" class="mb-1 block text-sm font-medium text-slate-700">4-digit PIN</label>
      <input
        id="tf-pin"
        ref="pinInput"
        v-model="pin"
        type="password"
        inputmode="numeric"
        maxlength="4"
        autocomplete="off"
        placeholder="••••"
        class="tnum input text-center text-xl font-semibold tracking-[0.5em]"
      />
      <p v-if="error" class="mt-1 text-xs text-red-600" role="alert">{{ error }}</p>
      <p class="mt-2 text-xs text-slate-400">Demo PIN is <span class="font-mono font-semibold">1234</span>.</p>
      <AppButton type="submit" block class="mt-4" :loading="confirming">
        {{ confirming ? 'Sending…' : `Send ${formatNaira(total)}` }}
      </AppButton>
    </form>
  </AppModal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { formatNaira } from '@/utils/formatCurrency'
import { DEMO_TRANSFER_PIN } from '@/utils/transfer'

defineProps({
  total: { type: Number, default: 0 },
  recipientName: { type: String, default: '' },
  confirming: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'confirm'])

const pin = ref('')
const error = ref('')
const pinInput = ref(null)

onMounted(() => pinInput.value?.focus())

function onSubmit() {
  error.value = ''
  if (pin.value !== DEMO_TRANSFER_PIN) {
    error.value = 'Incorrect PIN. Hint: the demo PIN is 1234.'
    return
  }
  emit('confirm')
}
</script>
