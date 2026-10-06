/**
 * Seed users — fictional Nigerian personas for the demo.
 * Never real customer data. Auth is simulated (see services/auth.service.js).
 */

export const demoUsers = [
  {
    id: 'usr_adewale',
    name: 'Adewale Ogunleye',
    email: 'adewale.ogunleye@example.ng',
    phone: '+234 803 452 1890',
    city: 'Lagos',
    role: 'customer',
    kycStatus: 'Verified',
    status: 'Active',
    accountNumber: '0123454821',
  },
  {
    id: 'usr_chiamaka',
    name: 'Chiamaka Okafor',
    email: 'chiamaka.okafor@example.ng',
    phone: '+234 805 781 2345',
    city: 'Abuja',
    role: 'customer',
    kycStatus: 'Verified',
    status: 'Active',
    accountNumber: '0123457790',
  },
  {
    id: 'usr_admin',
    name: 'Adaeze Nwosu',
    email: 'admin@vaulta.ng',
    phone: '+234 809 100 4455',
    city: 'Lagos',
    role: 'admin',
    kycStatus: 'Verified',
    status: 'Active',
    accountNumber: null,
  },
]

export const demoCredentials = [
  { email: 'adewale.ogunleye@example.ng', password: 'Vaulta123!', userId: 'usr_adewale' },
  { email: 'admin@vaulta.ng', password: 'Vaulta123!', userId: 'usr_admin' },
]
