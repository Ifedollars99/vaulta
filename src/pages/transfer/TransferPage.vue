<template>
  <AppLayout>
    <h1 class="page-title">Send money</h1>
    <p class="mt-1 text-sm text-slate-500">To any Nigerian bank — review before you pay.</p>

    <ol class="mt-6 flex items-center gap-1" aria-label="Transfer progress">
      <li v-for="(s, i) in steps" :key="s" class="flex flex-1 items-center gap-1">
        <div class="flex-1">
          <div class="h-1.5 rounded-full" :class="i + 1 <= step ? 'bg-brand-600' : 'bg-slate-200'" />
          <p class="mt-1 hidden text-[11px] font-medium sm:block" :class="i + 1 <= step ? 'text-brand-700' : 'text-slate-400'">{{ s }}</p>
        </div>
      </li>
    </ol>

    <div class="mx-auto mt-6 max-w-xl">
      <div v-if="pageError" class="card mb-4 p-8 text-center" role="alert">
        <p class="text-sm font-medium text-slate-900">Couldn't start your transfer</p>
        <p class="mt-1 text-sm text-slate-500">{{ pageError }}</p>
        <button type="button" class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700" @click="boot">
          Try again
        </button>
      </div>

      <div v-else-if="bootLoading" class="card animate-pulse space-y-3 p-6" role="status" aria-label="Loading transfer">
        <div v-for="n in 4" :key="n" class="h-12 rounded bg-slate-100" />
      </div>

      <div v-else class="card p-5 sm:p-6">
        <StepBeneficiary
          v-if="step === 1"
          :beneficiaries="beneficiaries"
          :selected-id="selected?.id ?? null"
          @select="selectBeneficiary"
          @add="showAddModal = true"
        />

        <StepAmount
          v-if="step === 2"
          v-model:amount="amount"
          v-model:description="description"
          :beneficiary="selected"
          :balance="balance"
          :error="amountError"
        />

        <StepReview
          v-if="step === 3"
          :beneficiary="selected"
          :amount="parsedAmount"
          :fee="fee"
          :description="description.trim()"
        />

        <StepSuccess
          v-if="step === 4 && record"
          :record="record"
          :fee="fee"
          :pending="record.status === 'Pending'"
          @again="resetFlow"
        />

        <p v-if="serverError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ serverError }}
        </p>

        <div v-if="step < 4" class="mt-6 flex gap-2">
          <AppButton v-if="step > 1" variant="secondary" @click="step -= 1">Back</AppButton>
          <AppButton v-if="step === 1" block :disabled="!selected" @click="step = 2">
            Continue
          </AppButton>
          <AppButton v-if="step === 2" block @click="goToReview">Review transfer</AppButton>
          <AppButton v-if="step === 3" block :loading="confirming" @click="showPin = true">
            Confirm and send
          </AppButton>
        </div>
      </div>
    </div>

    <BeneficiaryFormModal
      v-if="showAddModal"
      :saving="benStore.saving"
      :save-error="benStore.saveError"
      @close="showAddModal = false"
      @submit="quickAdd"
    />

    <PinModal
      v-if="showPin"
      :total="parsedAmount + fee"
      :recipient-name="selected?.name ?? ''"
      :confirming="confirming"
      @close="showPin = false"
      @confirm="execute"
    />
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import BeneficiaryFormModal from '@/components/beneficiaries/BeneficiaryFormModal.vue'
import StepBeneficiary from '@/components/transfer/StepBeneficiary.vue'
import StepAmount from '@/components/transfer/StepAmount.vue'
import StepReview from '@/components/transfer/StepReview.vue'
import StepSuccess from '@/components/transfer/StepSuccess.vue'
import PinModal from '@/components/transfer/PinModal.vue'
import { useAccountStore } from '@/stores/account'
import { useBeneficiaryStore } from '@/stores/beneficiaries'
import { useTransactionStore } from '@/stores/transactions'
import { executeTransferRequest } from '@/services/transfer.service'
import { TRANSFER_MIN, transferFee } from '@/utils/transfer'

const steps = ['Beneficiary', 'Amount', 'Review', 'Done']

const accountStore = useAccountStore()
const benStore = useBeneficiaryStore()
const txnStore = useTransactionStore()
const route = useRoute()

const step = ref(1)
const selected = ref(null)
const amount = ref('')
const description = ref('')
const amountError = ref('')
const serverError = ref('')
const showAddModal = ref(false)
const showPin = ref(false)
const confirming = ref(false)
const record = ref(null)
const fee = ref(transferFee())

const bootLoading = computed(() => (accountStore.loading && !accountStore.account) || (benStore.loading && benStore.list.length === 0))
const pageError = computed(() => accountStore.error || benStore.error)
const beneficiaries = computed(() => benStore.list)
const balance = computed(() => accountStore.account?.balance ?? 0)
const parsedAmount = computed(() => Number(amount.value) || 0)

function boot() {
  if (!accountStore.account) accountStore.fetchAccount()
  benStore.fetchAll().then(() => {
    const preselected = route.query.to
    if (typeof preselected === 'string') {
      const found = benStore.list.find((b) => b.id === preselected)
      if (found) {
        selected.value = found
        step.value = 2
      }
    }
  })
}

function selectBeneficiary(b) {
  selected.value = b
}

async function quickAdd(payload) {
  try {
    const created = await benStore.add(payload)
    selected.value = created
    showAddModal.value = false
  } catch {
    // Validation message surfaces inside the modal via saveError.
  }
}

function goToReview() {
  amountError.value = ''
  serverError.value = ''
  const value = Number(amount.value)
  if (!amount.value || !Number.isFinite(value) || value <= 0) {
    amountError.value = 'Enter an amount greater than ₦0.'
    return
  }
  if (value < TRANSFER_MIN) {
    amountError.value = `Minimum transfer is ₦${TRANSFER_MIN.toLocaleString('en-NG')}.`
    return
  }
  fee.value = transferFee()
  if (value + fee.value > balance.value) {
    amountError.value = 'Insufficient balance for this amount plus fee.'
    return
  }
  step.value = 3
}

async function execute() {
  confirming.value = true
  serverError.value = ''
  try {
    const res = await executeTransferRequest({
      amount: parsedAmount.value,
      beneficiary: selected.value,
      description: description.value.trim(),
    })
    record.value = res.record
    fee.value = res.fee
    txnStore.addTransaction(res.record)
    benStore.markTransferred(selected.value.id, res.record.date)
    if (res.record.status === 'Completed') {
      accountStore.applyDebit(res.total)
    }
    showPin.value = false
    step.value = 4
  } catch (err) {
    serverError.value = err.message || 'Transfer failed. Try again.'
    showPin.value = false
  } finally {
    confirming.value = false
  }
}

function resetFlow() {
  step.value = 1
  selected.value = null
  amount.value = ''
  description.value = ''
  amountError.value = ''
  serverError.value = ''
  record.value = null
}

onMounted(boot)
</script>
