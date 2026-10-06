/**
 * Small storage helpers so auth can distinguish "wrong password" from
 * "this browser has no record of any registered account".
 */
export function storageAvailable() {
  try {
    const key = 'vaulta.storage.probe'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function hasRegisteredAccounts() {
  try {
    const raw = localStorage.getItem('vaulta.registeredUsers')
    return Boolean(raw && JSON.parse(raw).length > 0)
  } catch {
    return false
  }
}
