/**
 * Notification seed — fictional events for the demo inbox.
 * type: 'security' | 'transaction' | 'info'
 */

export const notificationsSeed = [
  {
    id: 'not_1',
    type: 'security',
    title: 'New device signed in',
    body: 'Chrome on Windows · Lagos, Nigeria · 2 hours ago. Review it in the Security Center.',
    date: '2026-10-06T05:20:00',
    read: false,
  },
  {
    id: 'not_2',
    type: 'transaction',
    title: 'You sent ₦150,000 to Chiamaka Okafor',
    body: 'Reference VAU-4F6D2S · Completed instantly. Receipt is ready.',
    date: '2026-10-04T15:31:00',
    read: false,
  },
  {
    id: 'not_3',
    type: 'transaction',
    title: 'Salary received',
    body: '₦850,000 from Paystack Salary landed in your account.',
    date: '2026-10-01T08:13:00',
    read: true,
  },
  {
    id: 'not_4',
    type: 'transaction',
    title: 'Transfer failed',
    body: '₦200,000 to Tolu Adebayo failed (network timeout). No money left your account — try again.',
    date: '2026-09-15T16:45:00',
    read: true,
  },
  {
    id: 'not_5',
    type: 'security',
    title: 'Failed login attempt blocked',
    body: 'Someone entered the wrong password twice from an unknown device in Lagos.',
    date: '2026-10-05T22:04:00',
    read: true,
  },
  {
    id: 'not_6',
    type: 'info',
    title: 'Your September roundup is ready',
    body: 'You spent 30% less than August. Subscriptions rose the most — see Analytics.',
    date: '2026-10-01T09:00:00',
    read: true,
  },
  {
    id: 'not_7',
    type: 'info',
    title: 'IKEDC bill due soon',
    body: 'Roughly ₦25,000 due 12 Oct based on your history. Pay from Quick actions.',
    date: '2026-10-05T08:00:00',
    read: true,
  },
]
