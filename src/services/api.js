/**
 * Mock API layer.
 * Every service goes through simulate() so pages always see
 * loading → success/error, and real HTTP can replace this later
 * without touching components or stores.
 */

export function simulate(data, { delay = 500, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) {
        reject(new Error('Something went wrong. Try again.'))
        return
      }
      // Deep-clone so callers can't mutate the seed data.
      resolve(JSON.parse(JSON.stringify(data)))
    }, delay)
  })
}

export function simulateError(message = 'Something went wrong. Try again.', delay = 500) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay)
  })
}
