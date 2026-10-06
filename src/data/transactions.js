/**
 * Canonical transaction seed — fictional Nigerian activity, Jun–Oct 2026.
 * Shared by dashboard, transactions, analytics, transfer and admin phases.
 * Never real customer data.
 *
 * amount: always positive. direction: 'credit' | 'debit'.
 */

export const accountSeed = {
  holderName: 'Adewale Ogunleye',
  accountNumber: '0123454821',
  bank: 'Vaulta Microfinance Bank',
  accountType: 'Savings',
  balance: 2847500.0,
}

export const transactionsSeed = [
  // ---- OCTOBER 2026 ----
  { id: 'txn_oct_01', reference: 'VAU-9X2K4M', amount: 850000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-01T08:12:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 4 },
  { id: 'txn_oct_02', reference: 'VAU-7T8Q1Z', amount: 5000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'MTN Airtime', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-02T10:41:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 6 },
  { id: 'txn_oct_03', reference: 'VAU-3M5N8P', amount: 8500, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Uber Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-03T18:22:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 8 },
  { id: 'txn_oct_04', reference: 'VAU-2K9R4T', amount: 64200, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Shoprite Lekki', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-03T13:05:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 11 },
  { id: 'txn_oct_05', reference: 'VAU-6H1J7L', amount: 7500, direction: 'debit', status: 'Completed', category: 'Subscriptions', counterparty: 'Netflix', bank: 'Virtual Card •• 4412', accountNumber: '0123454821', date: '2026-10-04T00:04:00', location: 'Lagos', device: 'Recurring billing', riskScore: 3 },
  { id: 'txn_oct_06', reference: 'VAU-4F6D2S', amount: 150000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'Chiamaka Okafor', bank: 'GTBank', accountNumber: '0123457790', date: '2026-10-04T15:30:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 18 },
  { id: 'txn_oct_07', reference: 'VAU-8A3E9W', amount: 3000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'Airtel Data', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-05T09:14:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 5 },
  { id: 'txn_oct_08', reference: 'VAU-5Q7W1E', amount: 6200, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Bolt Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-05T20:02:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 9 },
  { id: 'txn_oct_09', reference: 'VAU-1R4T6Y', amount: 120000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Flutterwave Payout', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-10-05T11:47:00', location: 'Lagos', device: 'API payout', riskScore: 12 },

  // ---- SEPTEMBER 2026 ----
  { id: 'txn_sep_01', reference: 'VAU-S10M9K', amount: 850000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-01T08:09:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 4 },
  { id: 'txn_sep_02', reference: 'VAU-S22B7N', amount: 25000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'IKEDC Electricity', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-03T12:20:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 7 },
  { id: 'txn_sep_03', reference: 'VAU-S31C4D', amount: 14900, direction: 'debit', status: 'Completed', category: 'Subscriptions', counterparty: 'DSTV Compact', bank: 'Virtual Card •• 4412', accountNumber: '0123454821', date: '2026-09-05T00:03:00', location: 'Lagos', device: 'Recurring billing', riskScore: 3 },
  { id: 'txn_sep_04', reference: 'VAU-S44F2G', amount: 48750, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Shoprite Ikeja', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-06T14:55:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 10 },
  { id: 'txn_sep_05', reference: 'VAU-S58H3J', amount: 12300, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Uber Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-09T19:31:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 9 },
  { id: 'txn_sep_06', reference: 'VAU-S61K8L', amount: 9500, direction: 'debit', status: 'Completed', category: 'Food', counterparty: 'Chicken Republic', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-11T13:12:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 6 },
  { id: 'txn_sep_07', reference: 'VAU-S79M1N', amount: 200000, direction: 'debit', status: 'Failed', category: 'Transfers', counterparty: 'Tolu Adebayo', bank: 'First Bank', accountNumber: '2034567812', date: '2026-09-15T16:44:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 34 },
  { id: 'txn_sep_08', reference: 'VAU-S83P5Q', amount: 2500, direction: 'debit', status: 'Completed', category: 'Subscriptions', counterparty: 'Spotify', bank: 'Virtual Card •• 4412', accountNumber: '0123454821', date: '2026-09-17T00:02:00', location: 'Lagos', device: 'Recurring billing', riskScore: 2 },
  { id: 'txn_sep_09', reference: 'VAU-S90R6S', amount: 32000, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Spar Ilupeju', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-20T11:26:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 9 },
  { id: 'txn_sep_10', reference: 'VAU-S12T4U', amount: 5000, direction: 'debit', status: 'Reversed', category: 'Bills', counterparty: 'MTN Airtime (duplicate)', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-22T09:58:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 15 },
  { id: 'txn_sep_11', reference: 'VAU-S35V7W', amount: 5000, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Cowry Card Top-up', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-09-24T07:40:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 5 },
  { id: 'txn_sep_12', reference: 'VAU-S66X9Y', amount: 750000, direction: 'debit', status: 'Pending', category: 'Transfers', counterparty: 'New Beneficiary · K. Balogun', bank: 'Zenith Bank', accountNumber: '5071238890', date: '2026-09-28T02:17:00', location: 'Abuja', device: 'Chrome on Windows · new device', riskScore: 91 },

  // ---- AUGUST 2026 ----
  { id: 'txn_aug_01', reference: 'VAU-A10B2C', amount: 850000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-08-01T08:11:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 4 },
  { id: 'txn_aug_02', reference: 'VAU-A21D5E', amount: 22000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'IKEDC Electricity', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-08-04T12:02:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 7 },
  { id: 'txn_aug_03', reference: 'VAU-A33F7G', amount: 18900, direction: 'debit', status: 'Completed', category: 'Entertainment', counterparty: 'Genesis Cinemas', bank: 'Physical Card •• 8821', accountNumber: '0123454821', date: '2026-08-08T19:45:00', location: 'Lagos', device: 'POS · Lagos', riskScore: 13 },
  { id: 'txn_aug_04', reference: 'VAU-A44H9J', amount: 9800, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Uber Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-08-12T18:15:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 8 },
  { id: 'txn_aug_05', reference: 'VAU-A55K2L', amount: 41200, direction: 'debit', status: 'Completed', category: 'Food', counterparty: 'Ebeano Supermarket', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-08-15T13:33:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 9 },
  { id: 'txn_aug_06', reference: 'VAU-A67M4N', amount: 100000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'Ibrahim Musa', bank: 'Access Bank', accountNumber: '0098765432', date: '2026-08-19T14:20:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 22 },
  { id: 'txn_aug_07', reference: 'VAU-A78P6Q', amount: 7500, direction: 'debit', status: 'Completed', category: 'Subscriptions', counterparty: 'Netflix', bank: 'Virtual Card •• 4412', accountNumber: '0123454821', date: '2026-08-21T00:04:00', location: 'Lagos', device: 'Recurring billing', riskScore: 3 },
  { id: 'txn_aug_08', reference: 'VAU-A89R8S', amount: 15000, direction: 'debit', status: 'Completed', category: 'Food', counterparty: 'The Place', bank: 'Physical Card •• 8821', accountNumber: '0123454821', date: '2026-08-25T20:10:00', location: 'Lagos', device: 'POS · Lagos', riskScore: 7 },

  // ---- JULY 2026 ----
  { id: 'txn_jul_01', reference: 'VAU-J10K2L', amount: 850000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-07-01T08:10:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 4 },
  { id: 'txn_jul_02', reference: 'VAU-J21M4N', amount: 28000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'IKEDC Electricity', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-07-05T11:48:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 7 },
  { id: 'txn_jul_03', reference: 'VAU-J33P6Q', amount: 35600, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Jumia Order', bank: 'Virtual Card •• 4412', accountNumber: '0123454821', date: '2026-07-10T16:22:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 16 },
  { id: 'txn_jul_04', reference: 'VAU-J44R8S', amount: 7400, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Bolt Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-07-14T08:35:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 8 },
  { id: 'txn_jul_05', reference: 'VAU-J55T1U', amount: 85000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'David Eze', bank: 'UBA', accountNumber: '1029384756', date: '2026-07-18T13:57:00', location: 'Ibadan', device: 'iPhone 14 · Ibadan', riskScore: 28 },
  { id: 'txn_jul_06', reference: 'VAU-J66V3W', amount: 12000, direction: 'debit', status: 'Completed', category: 'Entertainment', counterparty: 'Filmhouse Cinemas', bank: 'Physical Card •• 8821', accountNumber: '0123454821', date: '2026-07-24T19:20:00', location: 'Lagos', device: 'POS · Lagos', riskScore: 11 },

  // ---- JUNE 2026 ----
  { id: 'txn_jun_01', reference: 'VAU-G10H2J', amount: 850000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-06-01T08:08:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 4 },
  { id: 'txn_jun_02', reference: 'VAU-G21K4L', amount: 24000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'Lagos Water', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-06-06T10:15:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 6 },
  { id: 'txn_jun_03', reference: 'VAU-G33M6N', amount: 52300, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Shoprite Lekki', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-06-12T14:02:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 10 },
  { id: 'txn_jun_04', reference: 'VAU-G44P8Q', amount: 9100, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Uber Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-06-16T18:44:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 8 },
  { id: 'txn_jun_05', reference: 'VAU-G55R1S', amount: 60000, direction: 'debit', status: 'Completed', category: 'Transfers', counterparty: 'Chiamaka Okafor', bank: 'GTBank', accountNumber: '0123457790', date: '2026-06-20T15:11:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 17 },

  // ---- MAY 2026 ----
  { id: 'txn_may_01', reference: 'VAU-Y10Z2A', amount: 850000, direction: 'credit', status: 'Completed', category: 'Income', counterparty: 'Paystack Salary', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-05-01T08:07:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 4 },
  { id: 'txn_may_02', reference: 'VAU-Y21B4C', amount: 31000, direction: 'debit', status: 'Completed', category: 'Bills', counterparty: 'IKEDC Electricity', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-05-07T11:30:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 7 },
  { id: 'txn_may_03', reference: 'VAU-Y33D6E', amount: 44800, direction: 'debit', status: 'Completed', category: 'Shopping', counterparty: 'Game Stores', bank: 'Physical Card •• 8821', accountNumber: '0123454821', date: '2026-05-14T13:19:00', location: 'Lagos', device: 'POS · Lagos', riskScore: 12 },
  { id: 'txn_may_04', reference: 'VAU-Y44F8G', amount: 11200, direction: 'debit', status: 'Completed', category: 'Transport', counterparty: 'Bolt Trip', bank: 'Vaulta Microfinance Bank', accountNumber: '0123454821', date: '2026-05-19T08:52:00', location: 'Lagos', device: 'iPhone 14 · Lagos', riskScore: 8 },
]
