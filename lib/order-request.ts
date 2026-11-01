import type { CartItem } from './types'

type PendingRequest = { id: string; signature: string }

function storageKey(table: string, token: string) {
  return `order-request:${JSON.stringify([table, token])}`
}

function signature(cart: CartItem[]) {
  return JSON.stringify(cart.map(item => ({
    id: item.id,
    quantity: item.quantity,
    notes: item.notes?.trim() ?? '',
    sugar_level: item.sugar_level ?? null,
  })))
}

export function getOrderRequestId(table: string, token: string, cart: CartItem[]) {
  const key = storageKey(table, token)
  const selected = signature(cart)
  try {
    const saved: PendingRequest | null = JSON.parse(sessionStorage.getItem(key) ?? 'null')
    if (saved?.signature === selected && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved.id)) {
      return saved.id
    }
  } catch { /* Browser storage can be unavailable. */ }
  const id = crypto.randomUUID()
  try { sessionStorage.setItem(key, JSON.stringify({ id, signature: selected })) }
  catch { /* The current request still has a unique ID. */ }
  return id
}

export function clearOrderRequestId(table: string, token: string, id: string) {
  const key = storageKey(table, token)
  try {
    const saved: PendingRequest | null = JSON.parse(sessionStorage.getItem(key) ?? 'null')
    if (saved?.id === id) sessionStorage.removeItem(key)
  } catch { /* Optional storage. */ }
}
