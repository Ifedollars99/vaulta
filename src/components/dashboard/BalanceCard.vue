<template>
  <section class="overflow-hidden rounded-xl bg-brand-950 p-5 text-white sm:p-6" aria-label="Account balance">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-brand-100">Available balance</p>
        <p class="tnum mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          {{ showBalance ? formatNaira(account?.balance) : '••••••••' }}
        </p>
        <p class="mt-1 font-mono text-xs text-brand-100">
          {{ showBalance ? account?.accountNumber : maskAccountNumber(account?.accountNumber) }} · {{ account?.bank }}
        </p>
      </div>
      <button
        type="button"
        class="rounded-lg p-2 text-brand-100 hover:bg-white/10 hover:text-white"
        :aria-label="showBalance ? 'Hide balance' : 'Show balance'"
        :aria-pressed="showBalance"
        @click="accountStore.toggleBalance"
      >
        <EyeOff v-if="showBalance" class="h-5 w-5" aria-hidden="true" />
        <Eye v-else class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
        @click="accountStore.copyAccountNumber"
      >
        <Check v-if="copied" class="h-3.5 w-3.5" aria-hidden="true" />
        <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
        {{ copied ? 'Copied' : 'Copy account number' }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
        :aria-expanded="detailsOpen"
        @click="detailsOpen = !detailsOpen"
      >
        Account details
        <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="detailsOpen ? 'rotate-180' : ''" aria-hidden="true" />
      </button>
    </div>

    <dl v-if="detailsOpen" class="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-4">
      <div>
        <dt class="text-[11px] uppercase tracking-wide text-brand-100">Account name</dt>
        <dd class="mt-0.5 font-medium">{{ account?.holderName }}</dd>
      </div>
      <div>
        <dt class="text-[11px] uppercase tracking-wide text-brand-100">Account number</dt>
        <dd class="tnum mt-0.5 font-medium">{{ account?.accountNumber }}</dd>
      </div>
      <div>
        <dt class="text-[11px] uppercase tracking-wide text-brand-100">Bank</dt>
        <dd class="mt-0.5 font-medium">{{ account?.bank }}</dd>
      </div>
      <div>
        <dt class="text-[11px] uppercase tracking-wide text-brand-100">Type</dt>
        <dd class="mt-0.5 font-medium">{{ account?.accountType }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Check, ChevronDown, Copy, Eye, EyeOff } from 'lucide-vue-next'
import { useAccountStore } from '@/stores/account'
import { formatNaira, maskAccountNumber } from '@/utils/formatCurrency'

const accountStore = useAccountStore()
const { account, showBalance, copied } = storeToRefs(accountStore)
const detailsOpen = ref(false)
</script>
