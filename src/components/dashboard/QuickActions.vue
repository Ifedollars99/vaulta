<template>
  <AppCard title="Quick actions">
    <ul class="grid grid-cols-4 gap-2 sm:gap-3">
      <li v-for="action in actions" :key="action.label">
        <component
          :is="action.to ? 'RouterLink' : 'button'"
          :to="action.to"
          type="button"
          class="flex w-full flex-col items-center gap-2 rounded-xl border border-slate-200 p-3 text-center transition-colors hover:border-brand-600 hover:bg-brand-50/50 sm:p-4"
          @click="action.onClick"
        >
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
            <component :is="action.icon" class="h-5 w-5 text-brand-700" aria-hidden="true" />
          </span>
          <span class="text-xs font-medium text-slate-700">{{ action.label }}</span>
        </component>
      </li>
    </ul>
  </AppCard>

  <!-- Receive modal -->
  <AppModal v-if="modal === 'receive'" title="Receive money" @close="modal = null">
    <p class="text-sm text-slate-600">Share these details with anyone sending you money.</p>
    <dl class="mt-4 space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
      <div class="flex justify-between"><dt class="text-slate-500">Account name</dt><dd class="font-medium text-slate-900">{{ account?.holderName }}</dd></div>
      <div class="flex justify-between"><dt class="text-slate-500">Account number</dt><dd class="tnum font-mono font-medium text-slate-900">{{ account?.accountNumber }}</dd></div>
      <div class="flex justify-between"><dt class="text-slate-500">Bank</dt><dd class="font-medium text-slate-900">{{ account?.bank }}</dd></div>
    </dl>
    <AppButton block class="mt-4" @click="copyReceive">
      {{ copied ? 'Copied to clipboard' : 'Copy account number' }}
    </AppButton>
  </AppModal>

  <!-- Add money modal -->
  <AppModal v-if="modal === 'add'" title="Add money" @close="modal = null">
    <p class="text-sm text-slate-600">Fund your Vaulta account from any Nigerian bank app or USSD.</p>
    <ol class="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
      <li>Open your bank app and choose <span class="font-medium">Transfer to bank account</span>.</li>
      <li>Enter <span class="tnum font-mono font-semibold">{{ account?.accountNumber }}</span> ({{ account?.bank }}).</li>
      <li>Confirm the name <span class="font-medium">{{ account?.holderName }}</span> before sending.</li>
    </ol>
    <p class="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Demo prototype — transfers are simulated and no real money moves.</p>
  </AppModal>

  <!-- Pay bills modal -->
  <AppModal v-if="modal === 'bills'" title="Upcoming bills" @close="modal = null">
    <ul class="divide-y divide-slate-100">
      <li v-for="bill in bills" :key="bill.name" class="flex items-center justify-between py-3">
        <div>
          <p class="text-sm font-medium text-slate-900">{{ bill.name }}</p>
          <p class="text-xs text-slate-500">Due {{ bill.due }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="tnum text-sm font-semibold text-slate-900">{{ formatNaira(bill.amount) }}</span>
          <RouterLink to="/transfer" class="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700">
            Pay
          </RouterLink>
        </div>
      </li>
    </ul>
  </AppModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ArrowDownToLine, ArrowLeftRight, Plus, ReceiptText } from 'lucide-vue-next'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useAccountStore } from '@/stores/account'
import { formatNaira } from '@/utils/formatCurrency'

const accountStore = useAccountStore()
const account = computed(() => accountStore.account)
const copied = computed(() => accountStore.copied)

const modal = ref(null)

const bills = [
  { name: 'IKEDC Electricity', due: '12 Oct', amount: 25000 },
  { name: 'DSTV Compact', due: '18 Oct', amount: 14900 },
  { name: 'MTN Airtime', due: 'recurring', amount: 5000 },
]

const actions = [
  { label: 'Send money', icon: ArrowLeftRight, to: '/transfer' },
  { label: 'Receive', icon: ArrowDownToLine, onClick: () => { modal.value = 'receive' } },
  { label: 'Pay bills', icon: ReceiptText, onClick: () => { modal.value = 'bills' } },
  { label: 'Add money', icon: Plus, onClick: () => { modal.value = 'add' } },
]

function copyReceive() {
  accountStore.copyAccountNumber()
}
</script>
