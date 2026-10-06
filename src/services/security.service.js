import { simulate } from './api'
import { devicesSeed, loginsSeed, securitySettingsSeed } from '@/data/security'

export async function fetchSecurityRequest() {
  return simulate(
    { devices: devicesSeed, logins: loginsSeed, settings: { ...securitySettingsSeed } },
    { delay: 500 }
  )
}
