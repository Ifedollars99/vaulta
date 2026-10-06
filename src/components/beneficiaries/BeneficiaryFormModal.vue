<template>
  <AppModal :title="editing ? 'Edit beneficiary' : 'Add beneficiary'" @close="$emit('close')">
    <form class="space-y-4" novalidate @submit.prevent="onSubmit">
      <div>
        <label for="ben-name" class="mb-1 block text-sm font-medium text-slate-700">Full name</label>
        <input id="ben-name" v-model="form.name" type="text" placeholder="e.g. Funke Adeyemi" class="input" />
        <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
      </div>
      <div>
        <label for="ben-bank" class="mb-1 block text-sm font-medium text-slate-700">Bank</label>
        <select id="ben-bank" v-model="form.bank" class="input">
          <option value="" disabled>Select bank</option>
          <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
        </select>
        <p v-if="errors.bank" class="mt-1 text-xs text-red-600">{{ errors.bank }}</p>
      </div>
      <div>
        <label for="ben-acct" class="mb-1 block text-sm font-medium text-slate-700">Account number</label>
        <input id="ben-acct" v-model="form.accountNumber" type="text" inputmode="numeric" maxlength="10" placeholder="10-digit account number" class="tnum input font-mono" />
        <p v-if="errors.accountNumber" class="mt-1 text-xs text-red-600">{{ errors.accountNumber }}</p>
      </div>
      <label class="flex items-center gap-2 text-sm text-slate-600">
        <input v-model="form.favorite" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
        Mark as favorite
      </label>
      <p v-if="saveError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{{ saveError }}</p>
      <div class="flex gap-2">
        <AppButton variant="secondary" @click="$emit('close')">Cancel</AppButton>
        <AppButton type="submit" block :loading="saving">
          {{ saving ? 'Saving…' : (editing ? 'Save changes' : 'Add beneficiary') }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { reactive } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { NIGERIAN_BANKS } from '@/data/banks'

const props = defineProps({
  editing: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  saveError: { type: String, default: '' },
})
const emit = defineEmits(['close', 'submit'])

const banks = NIGERIAN_BANKS
const form = reactive({
  name: props.editing?.name ?? '',
  bank: props.editing?.bank ?? '',
  accountNumber: props.editing?.accountNumber ?? '',
  favorite: props.editing?.favorite ?? false,
})
const errors = reactive({})

function onSubmit() {
  errors.name = form.name.trim() ? '' : 'Enter the account holder name.'
  errors.bank = form.bank ? '' : 'Select a bank.'
  errors.accountNumber = /^\d{10}$/.test(form.accountNumber.trim())
    ? ''
    : 'Account number must be exactly 10 digits.'
  if (errors.name || errors.bank || errors.accountNumber) return
  emit('submit', {
    name: form.name.trim(),
    bank: form.bank,
    accountNumber: form.accountNumber.trim(),
    favorite: form.favorite,
  })
}
</script>
