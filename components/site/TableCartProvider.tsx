'use client'

import { createContext, Suspense, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cartItemKey } from '@/lib/sugar'
import { addCartItemWithinLimits, MAX_CART_QUANTITY, MAX_LINE_QUANTITY } from '@/lib/cart-limits'
import { readTableCart, writeTableCart } from '@/lib/cart-storage'
import { getLocation } from '@/lib/location'
import { rememberOrderAccess } from '@/lib/order-access'
import { clearOrderRequestId, getOrderRequestId } from '@/lib/order-request'
import { useTheme } from '@/lib/theme-context'
import { t } from '@/lib/i18n'
import type { CartItem, MenuItem } from '@/lib/types'
import { submitOrder } from '@/types/order/actions'
import { CartSheet } from './CartSheet'

type TableCartValue = {
  cart: CartItem[]
  count: number
  addItem: (item: MenuItem, quantity: number, notes: string, sugarLevel?: number) => void
  updateQty: (key: string, delta: number) => void
  removeItem: (key: string) => void
  openCart: () => void
}

const TableCartContext = createContext<TableCartValue | null>(null)

function TableCartParams({ onChange }: { onChange: (table: string | null, token: string | null) => void }) {
  const params = useSearchParams()
  const table = params.get('table')
  const token = params.get('token')
  useEffect(() => {
    let active = true
    queueMicrotask(() => { if (active) onChange(table, token) })
    return () => { active = false }
  }, [onChange, table, token])
  return null
}

export function useTableCart() {
  const context = useContext(TableCartContext)
  if (!context) throw new Error('TableCartProvider is missing')
  return context
}

export function TableCartProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [access, setAccess] = useState<{ table: string | null; token: string | null }>({ table: null, token: null })
  const table = access.table
  const token = access.token
  const key = table?.trim() && token?.trim() ? JSON.stringify([table, token]) : ''
  const { lang } = useTheme()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loadedKey, setLoadedKey] = useState('')
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const submittingRef = useRef(false)
  const closeCart = useCallback(() => { if (!submittingRef.current) setOpen(false) }, [])
  const openCart = useCallback(() => { setCheckoutError(''); setOpen(true) }, [])
  const changeAccess = useCallback((nextTable: string | null, nextToken: string | null) => {
    setAccess(previous => previous.table === nextTable && previous.token === nextToken ? previous : { table: nextTable, token: nextToken })
  }, [])

  useEffect(() => {
    if (!key || !table || !token) return
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setCart(readTableCart(table, token))
      setLoadedKey(key)
    })
    return () => { active = false }
  }, [key, table, token])

  useEffect(() => {
    if (key && loadedKey === key && table && token) writeTableCart(table, token, cart)
  }, [cart, key, loadedKey, table, token])

  const visibleCart = loadedKey === key ? cart : []
  const count = visibleCart.reduce((sum, item) => sum + item.quantity, 0)
  const total = visibleCart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addItem(item: MenuItem, quantity: number, notes: string, sugarLevel?: number) {
    if (!key || !table || !token) return
    if (loadedKey !== key) {
      const next = addCartItemWithinLimits(readTableCart(table, token), item, quantity, notes, sugarLevel)
      writeTableCart(table, token, next)
      setCart(next)
      setLoadedKey(key)
      return
    }
    setCart(previous => addCartItemWithinLimits(previous, item, quantity, notes, sugarLevel))
  }

  function updateQty(lineKey: string, delta: number) {
    setCart(previous => {
      const total = previous.reduce((sum, item) => sum + item.quantity, 0)
      const allowedDelta = delta > 0 ? Math.min(delta, MAX_CART_QUANTITY - total) : delta
      return previous
        .map(item => cartItemKey(item) === lineKey ? { ...item, quantity: Math.max(0, Math.min(MAX_LINE_QUANTITY, item.quantity + allowedDelta)) } : item)
        .filter(item => item.quantity > 0)
    })
  }

  function removeItem(lineKey: string) {
    setCart(previous => previous.filter(item => cartItemKey(item) !== lineKey))
  }

  async function placeOrder() {
    if (!table || !token || !visibleCart.length || submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    setCheckoutError('')
    try {
      const requestId = getOrderRequestId(table, token, visibleCart)
      const result = await submitOrder({ tableId: table, token, requestId, location: await getLocation(), items: visibleCart })
      if (!result.success || !result.orderId) throw new Error(result.error ?? 'Failed to place order')
      clearOrderRequestId(table, token, requestId)
      rememberOrderAccess(result.orderId, table, token)
      writeTableCart(table, token, [])
      setCart([])
      setOpen(false)
      router.push(`/tracking/${result.orderId}`)
    } catch (error) {
      console.error('Order failed:', error)
      setCheckoutError(error instanceof Error && error.message ? error.message : t('orderError', lang))
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return <TableCartContext.Provider value={{ cart: visibleCart, count, addItem, updateQty, removeItem, openCart }}>
    <Suspense fallback={null}><TableCartParams onChange={changeAccess} /></Suspense>
    {children}
    {key && <CartSheet cart={visibleCart} lang={lang} table={table} cartTotal={total} cartCount={count} open={open} submitting={submitting} error={checkoutError} onOpen={openCart} onClose={closeCart} onUpdateQty={updateQty} onRemove={removeItem} onSubmit={() => void placeOrder()} />}
  </TableCartContext.Provider>
}
