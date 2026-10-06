/**
 * Seed beneficiaries — fictional recipients for the demo customer.
 * lastTransfer is display metadata refreshed when a transfer completes.
 */

export const beneficiariesSeed = [
  {
    id: 'ben_chiamaka',
    name: 'Chiamaka Okafor',
    bank: 'GTBank',
    accountNumber: '0123457790',
    favorite: true,
    lastTransfer: '2026-10-04T15:30:00',
    isNew: false,
  },
  {
    id: 'ben_ibrahim',
    name: 'Ibrahim Musa',
    bank: 'Access Bank',
    accountNumber: '0098765432',
    favorite: true,
    lastTransfer: '2026-08-19T14:20:00',
    isNew: false,
  },
  {
    id: 'ben_tolu',
    name: 'Tolu Adebayo',
    bank: 'First Bank',
    accountNumber: '2034567812',
    favorite: false,
    lastTransfer: null,
    isNew: false,
  },
  {
    id: 'ben_david',
    name: 'David Eze',
    bank: 'UBA',
    accountNumber: '1029384756',
    favorite: false,
    lastTransfer: '2026-07-18T13:57:00',
    isNew: false,
  },
]
