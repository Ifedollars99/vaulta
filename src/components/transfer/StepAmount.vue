<template>
  <div>
    <div class="rounded-xl bg-slate-50 p-4">
      <p class="text-xs text-slate-500">Sending to</p>
      <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ beneficiary.name }}</p>
      <p class="tnum font-mono text-xs text-slate-500">{{ beneficiary.bank }} · {{ beneficiary.accountNumber }}</p>
      <p class="tnum mt-2 text-xs text-slate-500">
        Available balance: <span class="font-semibold text-slate-800">{{ formatNaira(balance) }}</span>
      </p>
    </div>

    <label for="tf-amount" class="mb-1 mt-5 block text-sm font-medium text-slate-700">Amount</label>
    <div class="relative">
      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400" aria-hidden="true">₦</span>
      <input
        id="tf-amount"
        v-model="amountModel"
        type="text"
        inputmode="decimal"
        placeholder="0.00"
        class="tnum input pl-8 text-lg font-semibold"
        :aria-invalid="Boolean(error)"
        aria-describedby="tf-amount-error tf-fee"
      />
    </div>
    <p v-if="error" id="tf-amount-error" class="mt-1 text-xs text-red-600">{{ error }}</p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="q in quickAmounts"
        :key="q"
        type="button"
        class="tnum rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-600 hover:text-brand-700"
        @click="amountModel = String(q)"
      >
        ₦{{ q.toLocaleString('en-NG') }}
      </button>
    </div>

    <div id="tf-fee" class="mt-4 space-y-1.5 rounded-xl border border-slate-200 p-4 text-sm">
      <div class="flex justify-between"><dt class="text-slate-500">Amount</dt><dd class="tnum font-medium text-slate-900">{{ formatNaira(parsed) }}</dd></div>
      <div class="flex justify-between"><dt class="text-slate-500">Transfer fee</dt><dd class="tnum font-medium text-slate-900">{{ formatNaira(fee) }}</dd></div>
      <div class="flex justify-between border-t border-slate-100 pt-1.5"><dt class="font-semibold text-slate-900">Total</dt><dd class="tnum font-semibold text-slate-900">{{ formatNaira(parsed + fee) }}</dd></div>
      <p class="pt-1 text-xs text-slate-400">Flat ₦25 fee · Arrives in seconds.</p>
    </div>

    <label for="tf-desc" class="mb-1 mt-4 block text-sm font-medium text-slate-700">Description <span class="font-normal text-slate-400">(optional)</span></label>
    <input id="tf-desc" v-model="descModel" type="text" maxlength="60" placeholder="e.g. October upkeep" class="input" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatNaira } from '@/utils/formatCurrency'
import { transferFee } from '@/utils/transfer'

const props = defineProps({
  beneficiary: { type: Object, required: true },
  balance: { type: Number, default: 0 },
  amount: { type: String, default: '' },
  description: { type: String, default: '' },
  error: { type: String, default: '' },
})
const emit = defineEmits(['update:amount', 'update:description'])

const quickAmounts = [5000, 10000, 50000, 100000]

const amountModel = computed({
  get: () => props.amount,
  set: (v) => emit('update:amount', v.replace(/[^\d.]/g, '')),
})
const descModel = computed({
  get: () => props.description,
  set: (v) => emit('update:description', v),
})
const parsed = computed(() => Number(props.amount) || 0)
const fee = computed(() => (parsed.value > 0 ? transferFee() : 0))
</script>
