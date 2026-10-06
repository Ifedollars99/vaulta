<template>
  <AppLayout>
    <h1 class="page-title">Settings</h1>
    <p class="mt-1 text-sm text-slate-500">Personal details, preferences and session.</p>

    <div class="mt-6 grid items-start gap-4 lg:grid-cols-2">
      <AppCard title="Personal details">
        <form class="space-y-4" @submit.prevent="saveProfile">
          <div>
            <label for="set-name" class="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input id="set-name" v-model="profile.name" type="text" class="input" />
            <p v-if="profileError" class="mt-1 text-xs text-red-600">{{ profileError }}</p>
          </div>
          <div>
            <label for="set-phone" class="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input id="set-phone" v-model="profile.phone" type="tel" class="input" />
          </div>
          <div>
            <label for="set-city" class="mb-1 block text-sm font-medium text-slate-700">City</label>
            <select id="set-city" v-model="profile.city" class="input">
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <p v-if="saved" class="rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">Details saved.</p>
          <AppButton type="submit">Save changes</AppButton>
        </form>
      </AppCard>

      <div class="space-y-4">
        <AppCard title="Preferences">
          <ul class="divide-y divide-slate-100">
            <li v-for="pref in prefList" :key="pref.key" class="flex items-center justify-between gap-3 py-3">
              <div>
                <p class="text-sm font-medium text-slate-900">{{ pref.title }}</p>
                <p class="text-xs text-slate-500">{{ pref.body }}</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="prefs[pref.key]"
                :aria-label="pref.title"
                class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                :class="prefs[pref.key] ? 'bg-brand-600' : 'bg-slate-200'"
                @click="togglePref(pref.key)"
              >
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="prefs[pref.key] ? 'left-[22px]' : 'left-0.5'" />
              </button>
            </li>
          </ul>
        </AppCard>

        <AppCard title="Session">
          <p class="text-sm text-slate-500">Signed in as <span class="font-medium text-slate-800">{{ auth.user?.email }}</span>.</p>
          <AppButton variant="danger" class="mt-4" @click="logout">
            <LogOut class="h-4 w-4" aria-hidden="true" />
            Log out
          </AppButton>
        </AppCard>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'
import AppLayout from '@/layouts/AppLayout.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const cities = ['Lagos', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kano', 'Benin City', 'Enugu']

const profile = reactive({
  name: auth.user?.name ?? '',
  phone: auth.user?.phone ?? '',
  city: auth.user?.city ?? 'Lagos',
})
const profileError = ref('')
const saved = ref(false)

const prefs = reactive(loadPrefs())
function loadPrefs() {
  try {
    return { emailAlerts: true, smsAlerts: false, insights: true, ...JSON.parse(localStorage.getItem('vaulta.prefs') ?? '{}') }
  } catch {
    return { emailAlerts: true, smsAlerts: false, insights: true }
  }
}

const prefList = [
  { key: 'emailAlerts', title: 'Email alerts', body: 'Transaction and security emails.' },
  { key: 'smsAlerts', title: 'SMS alerts', body: 'High-value transfer texts.' },
  { key: 'insights', title: 'Weekly insights', body: 'Spending roundup every Monday.' },
]

function togglePref(key) {
  prefs[key] = !prefs[key]
  try {
    localStorage.setItem('vaulta.prefs', JSON.stringify(prefs))
  } catch {
    // Non-critical preference.
  }
}

function saveProfile() {
  profileError.value = ''
  saved.value = false
  if (!profile.name.trim()) {
    profileError.value = 'Enter your full name.'
    return
  }
  auth.user = { ...auth.user, name: profile.name.trim(), phone: profile.phone.trim(), city: profile.city }
  try {
    const raw = localStorage.getItem('vaulta.session') ?? sessionStorage.getItem('vaulta.session')
    if (raw) {
      const parsed = JSON.parse(raw)
      parsed.user = auth.user
      const storage = localStorage.getItem('vaulta.session') ? localStorage : sessionStorage
      storage.setItem('vaulta.session', JSON.stringify(parsed))
    }
  } catch {
    // Session simply won't persist the edit.
  }
  saved.value = true
}

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>
