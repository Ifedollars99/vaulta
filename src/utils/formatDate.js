const dateFmt = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFmt = new Intl.DateTimeFormat('en-NG', {
  hour: 'numeric',
  minute: '2-digit',
})

const dateTimeFmt = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}

export function formatDate(value) {
  return dateFmt.format(toDate(value))
}

export function formatTime(value) {
  return timeFmt.format(toDate(value))
}

export function formatDateTime(value) {
  return dateTimeFmt.format(toDate(value))
}

export function timeAgo(value) {
  const diffMs = Date.now() - toDate(value).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
