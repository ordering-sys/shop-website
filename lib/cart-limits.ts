import { addCartItem, cartItemKey } from './sugar'
import type { CartItem, MenuItem } from './types'

export const MAX_LINE_QUANTITY = 99
export const MAX_CART_QUANTITY = 100
export const MAX_CART_LINES = 30

export function remainingQuantity(cart: CartItem[], item: MenuItem, notes: string, sugarLevel?: number) {
  const key = cartItemKey({ id: item.id, notes, sugar_level: sugarLevel })
  const line = cart.find(entry => cartItemKey(entry) === key)
  if (!line && cart.length >= MAX_CART_LINES) return 0
  const total = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  return Math.max(0, Math.min(MAX_LINE_QUANTITY - (line?.quantity ?? 0), MAX_CART_QUANTITY - total))
}

export function addCartItemWithinLimits(cart: CartItem[], item: MenuItem, quantity: number, notes: string, sugarLevel?: number) {
  if (!Number.isInteger(quantity) || quantity < 1) return cart
  const allowed = remainingQuantity(cart, item, notes, sugarLevel)
  return allowed ? addCartItem(cart, item, Math.min(quantity, allowed), notes, sugarLevel) : cart
}
