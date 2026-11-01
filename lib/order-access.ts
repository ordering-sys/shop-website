type OrderAccess = { table: string; token: string }

function storageKey(orderId: string) {
  return `order-access:${orderId}`
}

export function rememberOrderAccess(orderId: string, table: string, token: string) {
  try {
    sessionStorage.setItem(storageKey(orderId), JSON.stringify({ table, token, justPlaced: true }))
  } catch {
    // A browser without session storage can still track the order.
  }
}

export function consumeOrderPlaced(orderId: string): boolean {
  try {
    const key = storageKey(orderId)
    const value: unknown = JSON.parse(sessionStorage.getItem(key) ?? 'null')
    if (!value || typeof value !== 'object' || !('justPlaced' in value) || value.justPlaced !== true) return false
    sessionStorage.setItem(key, JSON.stringify({ ...value, justPlaced: false }))
    return true
  } catch {
    return false
  }
}

export function readOrderAccess(orderId: string): OrderAccess | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(storageKey(orderId)) ?? 'null')
    if (value && typeof value === 'object' && 'table' in value && 'token' in value &&
      typeof value.table === 'string' && typeof value.token === 'string') return value as OrderAccess
  } catch {
    // Treat corrupt or unavailable storage as no access.
  }
  return null
}
