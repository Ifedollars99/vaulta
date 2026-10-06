<template>
  <AuthLayout>
    <h1 class="page-title">Welcome back</h1>
    <p class="mt-1 text-sm text-slate-500">Log in to manage your money.</p>

    <div v-if="auth.error" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
      <p class="flex gap-2">
        <CircleAlert class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{{ auth.error }}</span>
      </p>
      <p v-if="showStorageHint" class="mt-2 border-t border-red-200 pt-2 text-xs">
        This browser has no registered accounts saved. If you signed up in a different
        browser, private window, or before the account-saving update, please register again.
      </p>
    </div>

    <div v-if="success" class="mt-4 flex gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700" role="status">
      <CircleCheck class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Login successful. Taking you to your account…</span>
    </div>

    <form class="mt-6 space-y-4" novalidate @submit.prevent="onSubmit">
      <div>
        <label for="identifier" class="mb-1 block text-sm font-medium text-slate-700">Email or phone number</label>
        <input
          id="identifier"
          v-model="form.identifier"
          type="text"
          autocomplete="username"
          placeholder="you@example.ng or +234 803 000 0000"
          class="input"
          :aria-invalid="Boolean(errors.identifier)"
          :aria-describedby="errors.identifier ? 'identifier-error' : undefined"
        />
        <p v-if="errors.identifier" id="identifier-error" class="mt-1 text-xs text-red-600">{{ errors.identifier }}</p>
      </div>

      <div>
        <div class="mb-1 flex items-center justify-between">
          <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
          <RouterLink to="/forgot-password" class="text-xs font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </RouterLink>
        </div>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Enter your password"
            class="input pr-11"
            :aria-invalid="Boolean(errors.password)"
            :aria-describedby="errors.password ? 'password-error' : undefined"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-slate-600"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" class="h-4 w-4" aria-hidden="true" />
            <Eye v-else class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p v-if="errors.password" id="password-error" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>

      <label class="flex items-center gap-2 text-sm text-slate-600">
        <input v-model="form.rememberMe" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
        Remember me on this device
      </label>

      <AppButton type="submit" block :loading="auth.loading">
        {{ auth.loading ? 'Logging in…' : 'Log in' }}
      </AppButton>
    </form>

    <div class="mt-6 rounded-lg bg-slate-50 p-3">
      <p class="label">Demo accounts — click to fill</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <button type="button" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-600 hover:text-brand-700" @click="fillDemo('customer')">
          Customer demo
        </button>
        <button type="button" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-brand-600 hover:text-brand-700" @click="fillDemo('admin')">
          Admin demo
        </button>
      </div>
    </div>

    <p class="mt-6 text-center text-sm text-slate-500">
      New to Vaulta?
      <RouterLink to="/register" class="font-medium text-brand-600 hover:text-brand-700">Open an account</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CircleAlert, CircleCheck, Eye, EyeOff } from 'lucide-vue-next'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useAuth } from '@/composables/useAuth'
import { isValidEmail, isValidNigerianPhone } from '@/utils/validators'
import { hasRegisteredAccounts, storageAvailable } from '@/utils/storage'

const { auth, redirectAfterLogin, demoCredentials } = useAuth()

const storageBlocked = !storageAvailable()
const showStorageHint = computed(
  () => Boolean(auth.error) && (storageBlocked || !hasRegisteredAccounts())
)

const form = reactive({ identifier: '', password: '', rememberMe: true })
const errors = reactive({ identifier: '', password: '' })
const showPassword = ref(false)
const success = ref(false)

function validate() {
  errors.identifier = ''
  errors.password = ''
  const id = form.identifier.trim()
  if (!id) {
    errors.identifier = 'Enter your email address or phone number.'
  } else if (!isValidEmail(id) && !isValidNigerianPhone(id.replace(/[\s-]/g, ''))) {
    errors.identifier = 'Enter a valid email address or Nigerian phone number.'
  }
  if (!form.password) {
    errors.password = 'Enter your password.'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }
  return !errors.identifier && !errors.password
}

function fillDemo(kind) {
  form.identifier = demoCredentials[kind].identifier
  form.password = demoCredentials[kind].password
  errors.identifier = ''
  errors.password = ''
}

async function onSubmit() {
  if (!validate()) return
  success.value = false
  try {
    const user = await auth.login({
      identifier: form.identifier.trim(),
      password: form.password,
      rememberMe: form.rememberMe,
    })
    success.value = true
    setTimeout(() => redirectAfterLogin(user), 600)
  } catch {
    // Error is surfaced via auth.error.
  }
}
</script>
