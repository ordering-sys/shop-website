import type { CartItem } from './types'
import { addCartItemWithinLimits } from './cart-limits'

function storageKey(table: string, token: string) {
  return `table-cart:${JSON.stringify([table, token])}`
}

export function readTableCart(table: string, token: string): CartItem[] {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(storageKey(table, token)) ?? '[]')
    if (!Array.isArray(value)) return []
    const valid = value.filter((line): line is CartItem =>
      line !== null && typeof line === 'object' &&
      typeof line.id === 'string' &&
      Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 100 &&
      typeof line.price === 'number' && Number.isFinite(line.price) &&
      typeof line.name_en === 'string' && typeof line.name_km === 'string' &&
      (line.notes === undefined || typeof line.notes === 'string') &&
      (line.sugar_level === undefined || Number.isInteger(line.sugar_level)))
    return valid.reduce<CartItem[]>((cart, line) => addCartItemWithinLimits(cart, line, line.quantity, line.notes ?? '', line.sugar_level), [])
  } catch {
    return []
  }
}

export function writeTableCart(table: string, token: string, cart: CartItem[]) {
  try {
    sessionStorage.setItem(storageKey(table, token), JSON.stringify(cart))
  } catch {
    // Ordering still works when browser storage is unavailable.
  }
}

