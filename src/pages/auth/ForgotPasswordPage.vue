<template>
  <AuthLayout>
    <template v-if="!sent">
      <h1 class="page-title">Forgot password?</h1>
      <p class="mt-1 text-sm text-slate-500">Enter the email on your account and we'll send a reset link (simulated).</p>

      <div v-if="error" class="mt-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
        <CircleAlert class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{{ error }}</span>
      </div>

      <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
        <div>
          <label for="reset-email" class="mb-1 block text-sm font-medium text-slate-700">Email address</label>
          <input id="reset-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.ng" class="input" />
          <p v-if="fieldError" class="mt-1 text-xs text-red-600">{{ fieldError }}</p>
        </div>
        <AppButton type="submit" block :loading="loading">
          {{ loading ? 'Sending…' : 'Send reset link' }}
        </AppButton>
      </form>
    </template>

    <template v-else>
      <div class="text-center">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
          <MailCheck class="h-6 w-6 text-brand-600" aria-hidden="true" />
        </span>
        <h1 class="page-title mt-3">Check your inbox</h1>
        <p class="mt-1 text-sm text-slate-500">
          If an account exists for <span class="font-medium text-slate-800">{{ email }}</span>,
          a reset link is on its way. Demo only — no email is actually sent.
        </p>
        <div class="mt-6 space-y-2">
          <AppButton variant="secondary" block @click="sent = false">Try a different email</AppButton>
          <RouterLink to="/login" class="block rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700">
            Back to login
          </RouterLink>
        </div>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CircleAlert, MailCheck } from 'lucide-vue-next'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { passwordResetRequest } from '@/services/auth.service'
import { isValidEmail } from '@/utils/validators'

const email = ref('')
const fieldError = ref('')
const error = ref('')
const loading = ref(false)
const sent = ref(false)

async function onSubmit() {
  fieldError.value = ''
  error.value = ''
  if (!email.value.trim()) {
    fieldError.value = 'Enter your email address.'
    return
  }
  if (!isValidEmail(email.value)) {
    fieldError.value = 'Enter a valid email address.'
    return
  }
  loading.value = true
  try {
    await passwordResetRequest({ email: email.value.trim() })
    sent.value = true
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
