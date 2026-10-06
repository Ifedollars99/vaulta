<template>
  <AuthLayout>
    <div class="mx-auto -mt-2 mb-6 max-w-md">
      <ol class="flex items-center gap-1" aria-label="Registration progress">
        <li v-for="(s, i) in steps" :key="s.label" class="flex flex-1 items-center gap-1">
          <div class="flex-1">
            <div
              class="h-1.5 rounded-full"
              :class="i + 1 <= step ? 'bg-brand-600' : 'bg-slate-200'"
            />
            <p class="mt-1 hidden text-[11px] font-medium sm:block" :class="i + 1 <= step ? 'text-brand-700' : 'text-slate-400'">
              {{ s.label }}
            </p>
          </div>
        </li>
      </ol>
      <p class="mt-1 text-xs text-slate-500 sm:hidden">Step {{ step }} of 4 — {{ steps[step - 1].label }}</p>
    </div>

    <template v-if="step <= 3">
      <h1 class="page-title">{{ steps[step - 1].title }}</h1>
      <p class="mt-1 text-sm text-slate-500">{{ steps[step - 1].subtitle }}</p>
    </template>

    <div v-if="auth.error" class="mt-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
      <CircleAlert class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{{ auth.error }}</span>
    </div>

    <!-- STEP 1 -->
    <form v-if="step === 1" class="mt-6 space-y-4" novalidate @submit.prevent="nextFromStep1">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="firstName" class="mb-1 block text-sm font-medium text-slate-700">First name</label>
          <input id="firstName" v-model="form.firstName" type="text" autocomplete="given-name" placeholder="Adaeze" class="input" />
          <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
        </div>
        <div>
          <label for="lastName" class="mb-1 block text-sm font-medium text-slate-700">Last name</label>
          <input id="lastName" v-model="form.lastName" type="text" autocomplete="family-name" placeholder="Nwosu" class="input" />
          <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
        </div>
      </div>
      <div>
        <label for="dob" class="mb-1 block text-sm font-medium text-slate-700">Date of birth</label>
        <input id="dob" v-model="form.dateOfBirth" type="date" class="input" :max="maxDob" />
        <p v-if="errors.dateOfBirth" class="mt-1 text-xs text-red-600">{{ errors.dateOfBirth }}</p>
        <p v-else class="mt-1 text-xs text-slate-500">You must be at least 18 years old.</p>
      </div>
      <AppButton type="submit" block>Continue</AppButton>
    </form>

    <!-- STEP 2 -->
    <form v-if="step === 2" class="mt-6 space-y-4" novalidate @submit.prevent="nextFromStep2">
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email address</label>
        <input id="email" v-model="form.email" type="email" autocomplete="email" placeholder="you@example.ng" class="input" />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>
      <div>
        <label for="phone" class="mb-1 block text-sm font-medium text-slate-700">Phone number</label>
        <input id="phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="+234 803 000 0000" class="input" />
        <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
      </div>
      <div>
        <label for="city" class="mb-1 block text-sm font-medium text-slate-700">City</label>
        <select id="city" v-model="form.city" class="input">
          <option value="" disabled>Select your city</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>
        <p v-if="errors.city" class="mt-1 text-xs text-red-600">{{ errors.city }}</p>
      </div>
      <div class="flex gap-2">
        <AppButton variant="secondary" @click="step = 1">Back</AppButton>
        <AppButton type="submit" block>Continue</AppButton>
      </div>
    </form>

    <!-- STEP 3 -->
    <form v-if="step === 3" class="mt-6 space-y-4" novalidate @submit.prevent="nextFromStep3">
      <div>
        <label for="password" class="mb-1 block text-sm font-medium text-slate-700">Create password</label>
        <input id="password" v-model="form.password" type="password" autocomplete="new-password" placeholder="Minimum 8 characters" class="input" />
        <div class="mt-2"><PasswordStrengthBar :password="form.password" /></div>
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>
      <div>
        <label for="confirm" class="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
        <input id="confirm" v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Repeat your password" class="input" />
        <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-600">{{ errors.confirmPassword }}</p>
      </div>
      <label class="flex items-start gap-2 text-sm text-slate-600">
        <input v-model="form.acceptedTerms" type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600" />
        <span>I agree to the <span class="font-medium text-slate-800">Terms of Use</span> and <span class="font-medium text-slate-800">Privacy Policy</span> (demo — no real agreement).</span>
      </label>
      <p v-if="errors.acceptedTerms" class="text-xs text-red-600">{{ errors.acceptedTerms }}</p>
      <div class="flex gap-2">
        <AppButton variant="secondary" @click="step = 2">Back</AppButton>
        <AppButton type="submit" block>Review details</AppButton>
      </div>
    </form>

    <!-- STEP 4: review -->
    <div v-if="step === 4 && !createdUser" class="mt-6">
      <h1 class="page-title">Confirm your details</h1>
      <p class="mt-1 text-sm text-slate-500">Check everything looks right before we open your account.</p>
      <dl class="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm">
        <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Full name</dt><dd class="font-medium text-slate-900">{{ form.firstName }} {{ form.lastName }}</dd></div>
        <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Email</dt><dd class="font-medium text-slate-900">{{ form.email }}</dd></div>
        <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">Phone</dt><dd class="font-medium text-slate-900">{{ form.phone }}</dd></div>
        <div class="flex justify-between px-4 py-2.5"><dt class="text-slate-500">City</dt><dd class="font-medium text-slate-900">{{ form.city }}</dd></div>
      </dl>
      <div class="mt-4 flex gap-2">
        <AppButton variant="secondary" @click="step = 3">Back</AppButton>
        <AppButton block :loading="auth.loading" @click="createAccount">
          {{ auth.loading ? 'Opening account…' : 'Create account' }}
        </AppButton>
      </div>
    </div>

    <!-- SUCCESS -->
    <div v-if="step === 4 && createdUser" class="mt-6 text-center">
      <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <CircleCheck class="h-6 w-6 text-green-600" aria-hidden="true" />
      </span>
      <h1 class="page-title mt-3">Account ready 🎉</h1>
      <p class="mt-1 text-sm text-slate-500">
        Welcome, {{ createdUser.name }}. Your demo account
        <span class="font-mono font-medium text-slate-800">{{ maskAccountNumber(createdUser.accountNumber) }}</span>
        is ready.
      </p>
      <p v-if="storageBlocked" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-relaxed text-amber-800" role="alert">
        This browser is blocking saved data, so this account can't be stored. You'll stay
        logged in now, but you won't be able to log back in later from here.
      </p>
      <AppButton block class="mt-6" @click="goToDashboard">Go to dashboard</AppButton>
    </div>

    <p v-if="!createdUser" class="mt-6 text-center text-sm text-slate-500">
      Already have an account?
      <RouterLink to="/login" class="font-medium text-brand-600 hover:text-brand-700">Log in</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CircleAlert, CircleCheck } from 'lucide-vue-next'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppButton from '@/components/ui/AppButton.vue'
import PasswordStrengthBar from '@/components/auth/PasswordStrengthBar.vue'
import { useAuthStore } from '@/stores/auth'
import { isValidEmail, isValidNigerianPhone, passwordStrength } from '@/utils/validators'
import { maskAccountNumber } from '@/utils/formatCurrency'
import { storageAvailable } from '@/utils/storage'

const storageBlocked = !storageAvailable()

const auth = useAuthStore()
const router = useRouter()

const steps = [
  { label: 'Personal', title: 'Tell us about you', subtitle: 'Step 1 of 4 — your personal information.' },
  { label: 'Contact', title: 'How do we reach you?', subtitle: 'Step 2 of 4 — your contact information.' },
  { label: 'Security', title: 'Secure your account', subtitle: 'Step 3 of 4 — a strong password keeps money safe.' },
  { label: 'Confirm', title: 'Confirm', subtitle: 'Step 4 of 4.' },
]
const cities = ['Lagos', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kano', 'Benin City', 'Enugu']

const step = ref(1)
const createdUser = ref(null)

const form = reactive({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  city: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
})
const errors = reactive({})

const maxDob = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().slice(0, 10)
})()

function setError(key, message) {
  if (message) errors[key] = message
  else delete errors[key]
}

function nextFromStep1() {
  setError('firstName', form.firstName.trim() ? '' : 'Enter your first name.')
  setError('lastName', form.lastName.trim() ? '' : 'Enter your last name.')
  let dobError = ''
  if (!form.dateOfBirth) dobError = 'Enter your date of birth.'
  else if (form.dateOfBirth > maxDob) dobError = 'You must be at least 18 years old.'
  setError('dateOfBirth', dobError)
  if (!errors.firstName && !errors.lastName && !errors.dateOfBirth) step.value = 2
}

function nextFromStep2() {
  setError('email', !form.email.trim() ? 'Enter your email address.' : (!isValidEmail(form.email) ? 'Enter a valid email address.' : ''))
  const phone = form.phone.replace(/[\s-]/g, '')
  setError('phone', !phone ? 'Enter your phone number.' : (!isValidNigerianPhone(phone) ? 'Enter a valid Nigerian phone number, e.g. +234 803 000 0000.' : ''))
  setError('city', form.city ? '' : 'Select your city.')
  if (!errors.email && !errors.phone && !errors.city) step.value = 3
}

function nextFromStep3() {
  const strength = passwordStrength(form.password)
  setError('password', form.password.length < 8 ? 'Password must be at least 8 characters.' : (strength.score <= 1 ? 'Password is too weak — add mixed case, a number or a symbol.' : ''))
  setError('confirmPassword', form.confirmPassword !== form.password ? 'Passwords do not match.' : '')
  setError('acceptedTerms', form.acceptedTerms ? '' : 'Please accept the terms to continue.')
  if (!errors.password && !errors.confirmPassword && !errors.acceptedTerms) step.value = 4
}

async function createAccount() {
  try {
    createdUser.value = await auth.register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth,
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city,
      password: form.password,
    })
  } catch {
    step.value = 3
  }
}

function goToDashboard() {
  router.push('/dashboard')
}
</script>
