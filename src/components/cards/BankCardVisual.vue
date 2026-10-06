<template>
  <div
    class="relative overflow-hidden rounded-xl p-5 text-white"
    :class="card.kind === 'Virtual' ? 'bg-brand-600' : 'bg-brand-950'"
    aria-label="Bank card"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium uppercase tracking-wide opacity-80">Vaulta {{ card.kind }}</p>
      <AppBadge :status="card.status === 'Active' ? 'Active' : 'Frozen'" class="!bg-white/15 !text-white" />
    </div>
    <p class="tnum mt-5 font-mono text-lg tracking-widest" aria-label="Card number">
      {{ revealed ? card.pan : maskCardNumber(card.pan) }}
    </p>
    <div class="mt-4 flex items-end justify-between text-sm">
      <div>
        <p class="text-[11px] uppercase tracking-wide opacity-70">Card holder</p>
        <p class="font-medium">{{ card.holderName }}</p>
      </div>
      <div class="flex gap-5">
        <div>
          <p class="text-[11px] uppercase tracking-wide opacity-70">Expires</p>
          <p class="tnum font-mono">{{ revealed ? card.expiry : '••/••' }}</p>
        </div>
        <div>
          <p class="text-[11px] uppercase tracking-wide opacity-70">CVV</p>
          <p class="tnum font-mono">{{ revealed ? card.cvv : '•••' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppBadge from '@/components/ui/AppBadge.vue'
import { maskCardNumber } from '@/utils/formatCurrency'

defineProps({
  card: { type: Object, required: true },
  revealed: { type: Boolean, default: false },
})
</script>
