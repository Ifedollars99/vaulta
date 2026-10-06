/**
 * Admin seed — fictional platform customers and cross-customer activity.
 * Adewale's own history lives in data/transactions.js and is merged in
 * the admin service with customer attribution.
 */

export const customersSeed = [
  {
    id: 'cus_adewale',
    name: 'Adewale Ogunleye',
    email: 'adewale.ogunleye@example.ng',
    phone: '+234 803 452 1890',
    city: 'Lagos',
    status: 'Active',
    kycStatus: 'Verified',
    balance: 2847500.0,
    accountNumber: '0123454821',
    joined: '2024-03-14',
  },
  {
    id: 'cus_chiamaka',
    name: 'Chiamaka Okafor',
    email: 'chiamaka.okafor@example.ng',
    phone: '+234 805 781 2345',
    city: 'Abuja',
    status: 'Active',
    kycStatus: 'Verified',
    balance: 612300.0,
    accountNumber: '0123457790',
    joined: '2024-06-02',
  },
  {
    id: 'cus_ibrahim',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@example.ng',
    phone: '+234 706 233 9810',
    city: 'Kano',
    status: 'Active',
    kycStatus: 'Verified',
    balance: 198450.0,
    accountNumber: '0098765432',
    joined: '2024-09-19',
  },
  {
    id: 'cus_funke',
    name: 'Funke Adeyemi',
    email: 'funke.adeyemi@example.ng',
    phone: '+234 810 554 7302',
    city: 'Ibadan',
    status: 'Under review',
    kycStatus: 'Pending review',
    balance: 87500.0,
    accountNumber: '3099881122',
    joined: '2025-11-27',
  },
  {
    id: 'cus_emeka',
    name: 'Emeka Obi',
    email: 'emeka.obi@example.ng',
    phone: '+234 903 117 6645',
    city: 'Enugu',
    status: 'Active',
    kycStatus: 'Verified',
    balance: 1430200.0,
    accountNumber: '4012567890',
    joined: '2024-12-08',
  },
  {
    id: 'cus_tolu',
    name: 'Tolu Adebayo',
    email: 'tolu.adebayo@example.ng',
    phone: '+234 813 908 2214',
    city: 'Port Harcourt',
    status: 'Suspended',
    kycStatus: 'Verified',
    balance: 12400.0,
    accountNumber: '2034567812',
    joined: '2025-04-30',
  },
]

/**
 * Cross-customer platform activity (Adewale's rows merge in separately).
 * Deliberate risk mix: low, medium and high for the fraud queue.
 */
export const platformTransactionsSeed = [
  { id: 'ptx_01', reference: 'VAU-P11A2B', customer: 'Funke Adeyemi', amount: 480000, direction: 'debit', status: 'Pending', category: 'Transfers', counterparty: 'New Beneficiary · S. Lawal', bank: 'Opay', accountNumber: '9054412789', date: '2026-10-05T01:42:00', location: 'Ibadan', device: 'Tecno Spark · new device', riskScore: 78 },
  { id: 'ptx_02', reference: 'VAU-P22C3D', customer: 'Emeka Obi', amount: 1200000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'Chiamaka Okafor', bank: 'GTBank', accountNumber: '0123457790', date: '2026-10-03T14:10:00', location: 'Enugu', device: 'iPhone 12 · Enugu', riskScore: 45 },
  { id: 'ptx_03', reference: 'VAU-P33E4F', customer: 'Chiamaka Okafor', amount: 85000, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Jumia Order', bank: 'Virtual Card •• 9021', accountNumber: '0123457790', date: '2026-10-02T16:33:00', location: 'Abuja', device: 'Samsung A54 · Abuja', riskScore: 14 },
  { id: 'ptx_04', reference: 'VAU-P44G5H', customer: 'Ibrahim Musa', amount: 42000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'KEDCO Electricity', bank: 'Access Bank', accountNumber: '0098765432', date: '2026-10-01T11:20:00', location: 'Kano', device: 'Redmi Note · Kano', riskScore: 9 },
  { id: 'ptx_05', reference: 'VAU-P55J6K', customer: 'Tolu Adebayo', amount: 310000, direction: 'debit', status: 'Failed', category: 'Transfers', counterparty: 'Unknown · E. Bello', bank: 'Palmpay', accountNumber: '8899001122', date: '2026-09-29T23:51:00', location: 'Port Harcourt', device: 'Unknown device', riskScore: 88 },
  { id: 'ptx_06', reference: 'VAU-P66L7M', customer: 'Emeka Obi', amount: 250000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Flutterwave Payout', bank: 'UBA', accountNumber: '4012567890', date: '2026-09-27T10:05:00', location: 'Enugu', device: 'API payout', riskScore: 20 },
  { id: 'ptx_07', reference: 'VAU-P77N8P', customer: 'Funke Adeyemi', amount: 15000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'MTN Airtime', bank: 'Wema Bank', accountNumber: '3099881122', date: '2026-09-25T09:44:00', location: 'Ibadan', device: 'Tecno Spark · Ibadan', riskScore: 6 },
  { id: 'ptx_08', reference: 'VAU-P88Q9R', customer: 'Chiamaka Okafor', amount: 640000, direction: 'debit', status: 'Pending', category: 'Transfers', counterparty: 'New Beneficiary · D. Sule', bank: 'Zenith Bank', accountNumber: '5078891234', date: '2026-09-26T02:08:00', location: 'Abuja', device: 'Chrome on Windows · new device', riskScore: 91 },
  { id: 'ptx_09', reference: 'VAU-P99S1T', customer: 'Ibrahim Musa', amount: 18500, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Bolt Trip', bank: 'Access Bank', accountNumber: '0098765432', date: '2026-09-22T18:31:00', location: 'Kano', device: 'Redmi Note · Kano', riskScore: 11 },
  { id: 'ptx_10', reference: 'VAU-P10U2V', customer: 'Emeka Obi', amount: 95000, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Spar Enugu', bank: 'UBA', accountNumber: '4012567890', date: '2026-09-20T13:12:00', location: 'Enugu', device: 'POS · Enugu', riskScore: 16 },
  { id: 'ptx_11', reference: 'VAU-P11W3X', customer: 'Tolu Adebayo', amount: 50000, direction: 'debit', status: 'Reversed', category: 'Bills', counterparty: 'Airtel Data (duplicate)', bank: 'First Bank', accountNumber: '2034567812', date: '2026-09-18T08:27:00', location: 'Port Harcourt', device: 'Infinix · Port Harcourt', riskScore: 13 },
  { id: 'ptx_12', reference: 'VAU-P12Y4Z', customer: 'Chiamaka Okafor', amount: 500000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'GTBank', accountNumber: '0123457790', date: '2026-09-01T08:05:00', location: 'Abuja', device: 'Salary credit', riskScore: 3 },
  { id: 'ptx_13', reference: 'VAU-P13A5B', customer: 'Funke Adeyemi', amount: 220000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'Ibrahim Musa', bank: 'Access Bank', accountNumber: '0098765432', date: '2026-08-30T15:52:00', location: 'Ibadan', device: 'Tecno Spark · Ibadan', riskScore: 52 },
  { id: 'ptx_14', reference: 'VAU-P14C6D', customer: 'Ibrahim Musa', amount: 300000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Access Bank', accountNumber: '0098765432', date: '2026-08-01T08:02:00', location: 'Kano', device: 'Salary credit', riskScore: 3 },
  { id: 'ptx_15', reference: 'VAU-P15E7F', customer: 'Emeka Obi', amount: 75000, direction: 'debit', status: 'Completed', category: 'Entertainment', counterparty: 'Genesis Cinemas', bank: 'UBA', accountNumber: '4012567890', date: '2026-08-14T20:11:00', location: 'Enugu', device: 'POS · Enugu', riskScore: 12 },
  { id: 'ptx_16', reference: 'VAU-P16G8H', customer: 'Tolu Adebayo', amount: 180000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'David Eze', bank: 'UBA', accountNumber: '1029384756', date: '2026-08-09T12:40:00', location: 'Port Harcourt', device: 'Infinix · Port Harcourt', riskScore: 38 },
  { id: 'ptx_17', reference: 'VAU-P17J9K', customer: 'Funke Adeyemi', amount: 120000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Wema Bank', accountNumber: '3099881122', date: '2026-09-01T08:11:00', location: 'Ibadan', device: 'Salary credit', riskScore: 3 },
  { id: 'ptx_18', reference: 'VAU-P18L1M', customer: 'Chiamaka Okafor', amount: 28000, direction: 'debit', status: 'Completed', category: 'Food', counterparty: 'Kilimanjaro', bank: 'GTBank', accountNumber: '0123457790', date: '2026-08-19T13:58:00', location: 'Abuja', device: 'Samsung A54 · Abuja', riskScore: 7 },
]

export const auditSeed = [
  { id: 'aud_01', event: 'Fraud alert reviewed', actor: 'Adaeze Nwosu (Ops)', action: 'Approved VAU-S66X9Y after customer callback', timestamp: '2026-10-05T10:14:00', location: 'Lagos, NG' },
  { id: 'aud_02', event: 'Customer viewed', actor: 'Adaeze Nwosu (Ops)', action: 'Opened profile: Funke Adeyemi', timestamp: '2026-10-05T09:47:00', location: 'Lagos, NG' },
  { id: 'aud_03', event: 'Transaction flagged', actor: 'Risk engine (simulated)', action: 'VAU-P11A2B scored 78/100 — new device + odd hour', timestamp: '2026-10-05T01:43:00', location: 'Ibadan, NG' },
  { id: 'aud_04', event: 'Account suspended', actor: 'Adaeze Nwosu (Ops)', action: 'Suspended Tolu Adebayo pending investigation', timestamp: '2026-10-01T16:02:00', location: 'Lagos, NG' },
  { id: 'aud_05', event: 'Login detected', actor: 'System', action: 'Admin sign-in from recognised device', timestamp: '2026-10-01T08:59:00', location: 'Lagos, NG' },
  { id: 'aud_06', event: 'Fraud alert reviewed', actor: 'Emeka S. (Ops)', action: 'Blocked VAU-P55J6K — customer unreachable', timestamp: '2026-09-30T08:20:00', location: 'Lagos, NG' },
  { id: 'aud_07', event: 'Beneficiary added', actor: 'Adewale Ogunleye (customer)', action: 'Added GTBank ····7790', timestamp: '2026-09-28T12:11:00', location: 'Lagos, NG' },
  { id: 'aud_08', event: 'Password changed', actor: 'Chiamaka Okafor (customer)', action: 'Password updated from recognised device', timestamp: '2026-09-20T19:36:00', location: 'Abuja, NG' },
  { id: 'aud_09', event: 'Customer viewed', actor: 'Emeka S. (Ops)', action: 'Opened profile: Tolu Adebayo', timestamp: '2026-09-19T14:44:00', location: 'Lagos, NG' },
  { id: 'aud_10', event: 'Transaction flagged', actor: 'Risk engine (simulated)', action: 'VAU-S66X9Y scored 91/100 — new beneficiary + amount', timestamp: '2026-09-28T02:18:00', location: 'Abuja, NG' },
]
