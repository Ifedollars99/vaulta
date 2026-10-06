/**
 * Seed cards — fictional PANs for the demo. Never real card numbers.
 * Full PAN/CVV are masked in the UI by default (see cards store).
 */

export const cardsSeed = [
  {
    id: 'card_virtual',
    kind: 'Virtual',
    label: 'Online shopping',
    holderName: 'ADEWALE OGUNLEYE',
    pan: '5061 2004 8812 4412',
    expiry: '09/28',
    cvv: '317',
    status: 'Active',
    monthlyLimit: 500000,
    spentThisMonth: 184200,
  },
  {
    id: 'card_physical',
    kind: 'Physical',
    label: 'Everyday spending',
    holderName: 'ADEWALE OGUNLEYE',
    pan: '5061 2004 7730 8821',
    expiry: '02/27',
    cvv: '904',
    status: 'Active',
    monthlyLimit: 1000000,
    spentThisMonth: 312500,
  },
]
