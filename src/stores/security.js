import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchSecurityRequest } from '@/services/security.service'
import { computeScore } from '@/data/security'

/**
 * Security Center state: score (computed from settings + devices),
 * device trust actions and login history.
 */
export const useSecurityStore = defineStore('security', () => {
  const devices = ref([])
  const logins = ref([])
  const settings = ref({ twoFactor: true, loginAlerts: true, transactionApproval: true, biometric: false })
  const loading = ref(false)
  const error = ref('')

  const score = computed(() => computeScore(settings.value, devices.value).score)
  const factors = computed(() => computeScore(settings.value, devices.value).factors)
  const band = computed(() => {
    if (score.value >= 80) return 'Strong'
    if (score.value >= 60) return 'Good'
    return 'At risk'
  })
  const untrustedCount = computed(() => devices.value.filter((d) => !d.trusted).length)

  async function fetchAll() {
    if (devices.value.length > 0) return
    loading.value = true
    error.value = ''
    try {
      const res = await fetchSecurityRequest()
      devices.value = res.devices
      logins.value = res.logins
      settings.value = res.settings
    } catch (err) {
      error.value = err.message || 'Something went wrong. Try again.'
    } finally {
      loading.value = false
    }
  }

  function trust(id) {
    const device = devices.value.find((d) => d.id === id)
    if (device) device.trusted = true
  }

  function revoke(id) {
    devices.value = devices.value.filter((d) => d.id !== id)
    logins.value.unshift({
      id: `log_${Date.now()}`,
      event: 'Device access revoked',
      detail: 'You reported an unrecognised sign-in',
      date: new Date().toISOString(),
      tone: 'bad',
    })
  }

  function toggle(key) {
    settings.value[key] = !settings.value[key]
  }

  return { devices, logins, settings, loading, error, score, factors, band, untrustedCount, fetchAll, trust, revoke, toggle }
})
